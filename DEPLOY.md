# Deploy su Vercel — stato e cose da finire

Documento di lavoro. Riassume dove siamo, cosa è già pronto, cosa resta da
fare e in che ordine. Aggiornato al commit `b5e6b76`.

---

## Decisioni prese

|                   |                                                                            |
| ----------------- | -------------------------------------------------------------------------- |
| **Piattaforma**   | Vercel                                                                     |
| **Database**      | Postgres gestito — Neon o Supabase, piano gratuito                         |
| **Media**         | Cloudflare R2 — **obbligatorio**, il filesystem di Vercel è effimero       |
| **Dominio**       | Registrato altrove, puntato su Vercel via record DNS (l'email resta dov'è) |
| **Hosting Plesk** | Resta per email, dominio e DNS. Il sito non ci gira: richiede Node ≥ 20.9  |

**Nota sulla licenza.** Il piano Hobby di Vercel è per progetti personali non
commerciali. Il sito di un'agenzia che acquisisce clienti rientra nell'uso
commerciale: il rischio è un'email che chiede il passaggio a Pro (20 $/mese) o,
nel caso peggiore, una sospensione. Il progetto è portabile — Docker, Postgres
standard, storage S3 — quindi una migrazione d'emergenza costa un'ora, ma va
saputo. Alternative gratuite che permettono l'uso commerciale: Railway, Fly.io.

---

## Già sistemato per il deploy

Fatto nel commit `b5e6b76`, dopo un audit di prontezza:

- `output: 'standalone'` è attivo solo fuori da Vercel. Lo stesso repository
  produce l'immagine Docker e il deploy su Vercel.
- Lo script dei font **fallisce rumorosamente** su un checkout a freddo senza
  rete, invece di lasciare un modulo mancante che rompe `next build` con un
  errore che non c'entra. Verificato in entrambi i casi.
- L'heap di build sceso da 8 GB a 4 GB: 8 sono più di quanto abbia un container
  di CI.
- Aggiunto `build:deploy`, che **applica le migrazioni prima di compilare**.

---

## Come si mette online (prima volta)

### 1. Database

Crea il progetto su Neon o Supabase e prendi la connection string (deve
includere `sslmode=require`).

### 2. Storage media

Su Cloudflare R2: crea il bucket, poi un **token limitato a quel bucket** con
lettura e scrittura — mai una chiave di account. Abilita l'accesso pubblico o
mettici davanti un dominio, e usa quell'indirizzo come `S3_PUBLIC_URL`.

### 3. Variabili d'ambiente su Vercel

Prendile da `.env.production.example`, che documenta a cosa serve ognuna, cosa
succede se la ruoti e cosa succede se ti sfugge. Le obbligatorie:

```
NEXT_PUBLIC_SERVER_URL   il dominio finale, con https e senza slash finale
DATABASE_URI             Postgres gestito
PAYLOAD_SECRET           openssl rand -hex 32
PREVIEW_SECRET           openssl rand -hex 16
S3_BUCKET S3_REGION S3_ENDPOINT S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY
S3_FORCE_PATH_STYLE=false
S3_PUBLIC_URL            dominio pubblico dei media
RESEND_API_KEY RESEND_FROM   (il form contatti; senza, segnala l'errore)
```

`NEXT_PUBLIC_SERVER_URL` non è cosmetica: da lì dipendono URL canonici,
`hreflang`, sitemap e le origini ammesse da CORS/CSRF. Deve essere presente
**anche in build**, perché `next.config.ts` ne ricava i domini da cui
`next/image` può caricare.

### 4. Build Command

Nelle impostazioni del progetto Vercel, sostituisci il comando di build con:

```
npm run build:deploy
```

Applica le migrazioni e poi compila. Senza, il primo deploy trova un database
vuoto e ogni pagina risponde 500.

### 5. Primo utente

Appena il sito è online, apri `/admin` e crea il tuo account **subito**: su un
database vuoto quell'endpoint è l'unico che scavalca i controlli di accesso, e
chi arriva primo diventa amministratore.

### 6. Contenuti

Il seed popola un dataset completo e trilingue ed è **distruttivo** — azzera le
collection di contenuto, mai gli utenti:

```bash
DATABASE_URI="<stringa di produzione>" npm run seed
```

Da lanciare dalla tua macchina, una sola volta, se vuoi partire dai contenuti
di esempio invece che da un sito vuoto.

### 7. Dominio

Su Vercel: Settings → Domains, aggiungi il dominio e **usa i record esatti che
ti mostra il pannello**. Nel DNS del tuo provider aggiungi solo quelli — un `A`
sul dominio nudo e un `CNAME` su `www` — senza toccare MX, SPF, DKIM e DMARC,
così l'email continua a funzionare. Il certificato SSL lo emette Vercel.

Scegli quale forma è canonica, dominio nudo o `www`, e lascia che Vercel
rediriga l'altra.

**Attenzione all'SPF** quando configuri Resend: un dominio può avere **un solo**
record SPF. Va fuso con quello esistente dell'email, non aggiunto accanto — due
record si invalidano a vicenda e la posta finisce in spam.

---

## Cosa resta da fare

In ordine di quanto conta.

### 1. Caching e invalidazione alla pubblicazione — 2–3 ore

**Il lavoro più importante che resta.** Oggi ogni pagina è renderizzata a ogni
richiesta (`dynamic = 'force-dynamic'` nel layout), scelto in Fase 5 perché il
menu arriva dal CMS e il container non ha un database in fase di build.

Su Vercel significa una invocazione di funzione per ogni visita. Da fare:

- letture del CMS avvolte in cache con tag (`unstable_cache` o equivalente);
- hook `afterChange` su collection e globals che invalidano i tag toccati;
- rimozione di `force-dynamic` dal layout.

Risultato: pagine statiche, aggiornate quando un redattore pubblica invece che
a ogni richiesta. Era il debito dichiarato in Fase 5 e ripreso in Fase 9.

### 2. Verifica del form contatti end-to-end — 1 ora

Il form è verificato fino al confine con Resend, non oltre: serve una chiave e
un dominio verificato. Da controllare in produzione: arrivo dell'email,
`replyTo` corretto, honeypot silenzioso, rate limit.

**Nota sul rate limit**: è in memoria di processo. Su Vercel le funzioni sono
molte e indipendenti, quindi il limite effettivo si moltiplica per il numero di
istanze attive. Per un form contatti con honeypot è accettabile; se diventasse
un problema serve uno store condiviso (Upstash Redis ha un piano gratuito).

### 3. Valori reali del brand — 1 ora

`src/tokens/brand.ts` contiene una palette segnaposto, dichiarata come tale.
Sostituendo i valori si aggiorna tutto il resto da sé, e **la styleguide dice
subito se il contrasto regge**: `/[locale]/styleguide` calcola i rapporti WCAG
sugli stessi token da cui nasce il CSS. Se una coppia non passa, il generatore
di token si rifiuta di emettere il vetro sotto la soglia.

### 4. Immagine di dimensione del limite di funzione — da verificare

Payload genera quattro dimensioni per ogni upload con `sharp`. Su un'immagine
molto grande l'elaborazione può avvicinarsi al limite di esecuzione delle
funzioni (10 s sul piano Hobby). Da provare con un file da 5–10 MB; se è un
problema, si riducono le dimensioni generate o si comprime a monte.

### 5. Cookie banner e slot analytics — a cura tua

Escluso dalla Fase 9 su tua richiesta. Lo slot analytics non è stato costruito
perché ha senso solo agganciato al consenso, quindi al banner.

### 6. Video delle cover — contenuto

Il campo `coverVideo` esiste nello schema ma il seed non carica video: servono
asset H.264 + WebM veri, ottimizzati a monte come richiede la specifica.
Loop entro 10–15 s, poster sempre presente.

---

## Cose da sapere prima di rimetterci le mani

- **Array e blocchi non sono localizzati**, solo i campi al loro interno. Chi
  scrive contenuti via API deve rimandare gli `id` di riga esistenti, altrimenti
  Payload li tratta come righe nuove e la lingua scritta prima sparisce. Vedi
  `withRowIds` nel seed: è la trappola che ha colpito due volte.
- **Le convenzioni dei file metadata non funzionano dentro il route group
  `(frontend)`**: `robots.ts`, `sitemap.ts` e `icon.svg` stanno nella radice di
  `src/app` per questo, e la share card è una route handler
  (`/[locale]/work/[slug]/og`) invece che `opengraph-image`.
- **I metadata sono bloccanti per tutti i client** (`htmlLimitedBots: /.*/`),
  altrimenti Next li streamma nel body dove un indicizzatore che non esegue
  JavaScript non li vede.
- **Il CSS dei componenti va nel layer `components`**, non fuori: senza layer
  vince sull'ordine e batte le utility di Tailwind.
- **Le utility di spaziatura passano da `--spacing-*`**: il moltiplicatore
  predefinito di Tailwind è stato rimosso, e per questo `--spacing-0` è
  dichiarato esplicitamente (`inset-0`, `top-0` passano da lì).

---

## Verifiche da rifare dopo ogni cambiamento importante

Tutte riproducibili, tutte già passate:

```bash
npm run typecheck && npm run lint
npm run build                    # senza database: deve compilare comunque
```

- **Accessibilità**: axe-core su 7 pagine × 3 lingue × 2 temi — 0 violazioni.
  Va eseguito con `prefers-reduced-motion` emulato, altrimenti axe misura i
  blocchi ancora a `opacity: 0` in attesa del reveal.
- **Lighthouse**: desktop 100/100/100/100; mobile 93–97 in italiano e inglese,
  76–85 in cinese. Il divario cinese è il font CJK ed è misurato: la stessa
  pagina contatti fa 96 in italiano e 76 in cinese.
- **Prova di contrasto sul vetro**: `auditGlass()` in `src/tokens/glass.ts`,
  visibile anche in fondo alla styleguide.
