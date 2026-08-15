# Portfolio agenzia creativa — Specifica di progetto e prompt di build

> Documento unico. La parte 1 è la specifica di riferimento. La parte 2 è il prompt operativo da incollare in Claude Code.

---

# PARTE 1 — SPECIFICA

## 1. Obiettivo

Sito portfolio per un'agenzia creativa. Architettura ibrida: home ricca più pagine di dettaglio per ogni case study. Il contenuto è gestito da un CMS che vive dentro il sito stesso. Tre lingue. Direzione visiva minimalista giapponese, con animazioni lente e materiche e uno strato di interfaccia in vetro traslucido.

Il sito ha un solo scopo commerciale: portare un potenziale cliente dalla home al form di brief, avendo letto almeno un case study per intero.

## 2. Stack

| Ambito            | Scelta                                                                       |
| ----------------- | ---------------------------------------------------------------------------- |
| Framework         | Next.js 15, App Router, TypeScript strict                                    |
| CMS               | Payload 3 (admin integrato su `/admin`, stesso codebase)                     |
| Database          | PostgreSQL (adapter `@payloadcms/db-postgres`)                               |
| Storage media     | S3-compatibile (Cloudflare R2) via `@payloadcms/storage-s3`                  |
| Styling           | Tailwind CSS v4 con token CSS custom                                         |
| Animazione UI     | Motion (ex Framer Motion)                                                    |
| Animazione scroll | GSAP + ScrollTrigger                                                         |
| Smooth scroll     | Lenis                                                                        |
| WebGL             | OGL (non Three.js: ~10x più leggero, sufficiente allo scopo)                 |
| Email             | Resend                                                                       |
| Font              | Zen Kaku Gothic New (display/body), Geist Mono (dati), Noto Sans SC (cinese) |

**Vincolo di hosting**: Payload 3 richiede un runtime Node 20+ e un database PostgreSQL. Un hosting condiviso PHP non è sufficiente. Il progetto deve includere un `Dockerfile` e un `docker-compose.yml` per essere deployabile su qualsiasi VPS, oltre a funzionare su Vercel senza modifiche.

## 3. Sitemap

```
/[locale]/
├── (home)                    statica, composta a blocchi dal CMS
├── work/                     indice progetti con filtri
│   └── [slug]/               case study
├── services/                 offerta e metodo
├── about/                    agenzia, team, valori, sede
├── contact/                  form di brief
└── legal/
    ├── privacy/
    └── cookie/

/admin                        pannello Payload
```

Locali: `it` (default), `en`, `zh`. Prefisso sempre esplicito nell'URL, incluso il default. `hreflang` reciproci su ogni pagina.

## 4. Modello dati Payload

### Collection: `projects` (case study)

Il modello più importante del progetto. Tutti i campi testuali sono `localized: true`.

**Identità** — `title`, `slug` (unico per locale), `client`, `year`, `industry` (relazione), `services` (relazione multipla, alimenta i filtri), `featured` (boolean), `order` (number, ordinamento manuale).

**Media** — `cover` (upload, con focal point), `coverVideo` (upload opzionale, loop per hover in griglia), `heroMedia` (upload), `accentColor` (text, hex estratto dal progetto: tinge la pagina di dettaglio), `gallery` (array di blocchi, vedi §5 → blocco Media).

**Narrazione** — `claim` (text breve, apertura), `context` (richtext), `challenge` (richtext), `approach` (richtext), `execution` (array di blocchi misti richtext + media), `results` (array: `label`, `value`, `delta`), `testimonial` (relazione).

**Crediti** — `team` (relazione multipla a `team-members`), `partners` (array: nome, ruolo), `liveUrl`, `awards` (array: nome, categoria, anno), `related` (relazione multipla a `projects`).

**SEO** — gruppo `meta`: `title`, `description`, `ogImage`.

### Altre collection

- `pages` — `title`, `slug`, `layout` (campo Blocks, vedi §5), gruppo `meta`. Serve per home, services, about e pagine libere.
- `services` — `title`, `slug`, `summary`, `description`, `icon`, `order`.
- `team-members` — `name`, `role`, `bio`, `photo`, `links`.
- `testimonials` — `quote`, `author`, `role`, `company`, `logo`, `project` (relazione).
- `clients` — `name`, `logo` (SVG), `url`, `order`.
- `media` — upload con `alt` localizzato, focal point, generazione automatica delle size.
- `users` — auth, ruoli `admin` | `editor`.

### Globals

- `settings` — logo chiaro e scuro (SVG), dati di contatto, sedi, social.
- `navigation` — voci di menu, ordinabili, localizzate.
- `footer` — colonne di link, testo legale.
- `seo-defaults` — meta di fallback, OG image di default.

Bozze e anteprima live attive su `projects` e `pages`.

## 5. Libreria blocchi

Ogni blocco espone tre proprietà comuni: **`background`** (`paper` | `sumi` | `accent`), **`spacing`** (`compact` | `normal` | `wide`), **`animate`** (boolean).

La variante è un campo `select` dentro il blocco, non un blocco separato: cambiare variante non deve mai far perdere contenuti o traduzioni.

| Blocco        | Varianti                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| `hero`        | video fullscreen · distorsione WebGL su immagine · solo tipografico      |
| `statement`   | titolo asimmetrico · due colonne con eyebrow · scorrimento orizzontale   |
| `projectGrid` | 2 colonne sfalsate · 3 colonne compatte · lista orizzontale trascinabile |
| `media`       | full-bleed · coppia affiancata · loop video · confronto prima/dopo       |
| `services`    | accordion · griglia di card · lista numerata                             |
| `results`     | contatori animati · griglia statica                                      |
| `testimonial` | singola a tutta pagina · slider · citazione con logo                     |
| `clients`     | griglia statica · marquee infinito                                       |
| `team`        | griglia fotografica · lista con reveal                                   |
| `cta`         | banner tipografico · con form inline · riga minimale                     |
| `faq`         | accordion                                                                |

## 6. Design system

### Architettura dei token

Tre livelli, unidirezionali. Nessun componente accede mai a un primitivo.

1. **Primitivi** — `tokens/brand.ts`. Unico file da modificare quando cambia l'identità: hex del brand, scala grigi, unità base.
2. **Semantici** — variabili CSS con nomi di ruolo: `--bg-primary`, `--bg-secondary`, `--bg-inverse`, `--fg-primary`, `--fg-secondary`, `--fg-muted`, `--border-subtle`, `--border-strong`, `--accent`, `--accent-fg`, più il gruppo vetro descritto in §7.
3. **Componente** — mappature locali derivate dai semantici.

### Colore

Nessun bianco puro, nessun nero puro. La palette è calda e naturale: carta non sbiancata contro inchiostro.

```
Tema chiaro:  bg #F7F5F0   fg #1A1A18
Tema scuro:   bg #131211   fg #EDEAE3
```

I grigi intermedi vanno costruiti sulla stessa dominante calda, mai neutri: un grigio freddo dentro questa palette si legge come un errore di stampa.

L'accento del brand richiede due varianti: quella originale sul tema chiaro, una più chiara e satura sul tema scuro. **Verificare il contrasto AA su entrambi i temi, non assumerlo.**

Se i valori reali del brand non sono ancora disponibili, usare un set segnaposto in `tokens/brand.ts` con un accento saturo e grigi caldi, chiaramente commentato come sostituibile.

### Tipografia

Zen Kaku Gothic New per display e testo, Geist Mono per metadati, etichette e numerazioni di progetto. È un grottesco di disegno giapponese con eccellenti proporzioni latine: forme aperte, contrasto basso, respiro interno ampio.

**Solo tre pesi: 300, 400, 500.** Il grassetto pesante non appartiene a questa direzione — la gerarchia si costruisce con la scala e con lo spazio, non con il peso.

Scala fluida in `clamp()`, sette gradi: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `caption`.

Impostazioni: tracking neutro o leggermente positivo sui corpi grandi (da 0 a +0.01em, mai negativo), interlinea 1.15–1.25 sul display, **1.8 sul testo corrente**. Caption in maiuscolo con tracking marcato (+0.12em).

**Cinese**: stack parallelo `Noto Sans SC` con compensazione ottica del 5–8% (i glifi CJK appaiono più piccoli a parità di `font-size`) e interlinea maggiorata a 2.0. Subsetting dinamico obbligatorio — un font CJK completo pesa 3–8 MB.

### Griglia, spazio e asimmetria

12 colonne su desktop, 6 su tablet, 4 su mobile. Gutter fisso 24px, margini fluidi e generosi.

**Le composizioni sono asimmetriche.** La griglia esiste per essere rispettata nell'allineamento e violata nel bilanciamento: un titolo che occupa le colonne 2–7 con le 8–12 vuote è la norma, non l'eccezione. Il centraggio simmetrico va usato con parsimonia.

Scala di spaziatura su base 4px con salti geometrici, estesa verso l'alto perché **il vuoto è contenuto**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 320. Le spaziature verticali tra sezioni partono da 128px su desktop.

**Raggio angoli**: 0 sui blocchi di contenuto e sui contenitori di media. Angoli continui ampi (20–28px) esclusivamente sugli elementi in vetro descritti in §7. La distinzione è deliberata: il contenuto è carta, la navigazione è schermo.

### Movimento

Durate: 200 / 400 / 800 / 1600ms. Easing unico per tutti i reveal: `cubic-bezier(0.32, 0.72, 0, 1)`. Stagger 80–120ms tra elementi in sequenza.

**Regola di direzione**: il movimento è lento, decelerato e silenzioso. Gli elementi entrano quasi sempre con una traslazione breve (16–24px) più opacità, mai con scala o rotazione. Nessun rimbalzo, nessun overshoot, nessuna molla. La sensazione da ottenere è quella di un pannello che scorre, non di un oggetto che salta.

### Campiture di colore

Le grandi superfici d'accento sono ammesse, a due condizioni: **piatte** (nessun gradiente) e **allineate alla griglia**. In questa direzione visiva funzionano meglio se non simmetriche e se lasciano respirare almeno una colonna vuota su un lato.

## 7. Vetro traslucido (liquid glass)

### Dove si applica

Solo sullo **strato di interfaccia fluttuante**, mai sul contenuto:

navbar sticky · switcher lingua e tema · pillole dei filtri sull'indice work · cursore · chrome del lightbox media · CTA flottante.

I blocchi di contenuto restano opachi e piatti. La regola che tiene insieme la direzione visiva: **il contenuto è carta, l'interfaccia è shoji** — un pannello traslucido che lascia intravedere ciò che ha dietro senza mai competere con esso. È questa lettura che rende il vetro coerente con il minimalismo giapponese anziché estraneo.

### Come si costruisce

Non basta uno sfondo semitrasparente. Servono quattro strati sovrapposti:

1. **Sfocatura di fondo** — `backdrop-filter: blur(24px) saturate(180%)`.
2. **Riempimento adattivo** — tinta semitrasparente che cambia con il tema (chiaro: bianco caldo al 60–70%; scuro: nero al 45–55%).
3. **Bordo speculare** — bordo da 1px non uniforme: più chiaro sul lato superiore, più scuro su quello inferiore, a simulare la rifrazione sullo spigolo. Si ottiene con un `border` semitrasparente più un `inset box-shadow` sul lato alto.
4. **Rifrazione** — un filtro SVG di dislocamento leggero, applicato **solo al cursore**. Sugli altri elementi il costo non giustifica la resa.

Angoli continui ampi (20–28px), coerenti su tutti gli elementi in vetro.

### Vincoli non negoziabili

- **Soglia di opacità minima**: il riempimento non può mai scendere sotto il 55%, altrimenti il testo dell'interfaccia perde il contrasto AA quando ci passa sotto un'immagine chiara. Questo è il punto in cui il vetro rompe l'accessibilità e va bloccato per costruzione, non verificato a campione.
- **Mai animare il raggio di sfocatura.** Provoca ridipinture continue. Si animano solo opacità e trasformazioni.
- **Fallback esplicito**: `@supports not (backdrop-filter: blur(1px))` deve produrre un riempimento opaco, non un elemento invisibile.
- **Numero massimo di elementi in vetro contemporaneamente visibili: quattro.** `backdrop-filter` è tra le proprietà CSS più costose e qui convive già con smooth scroll e un canvas WebGL.
- Il filtro di rifrazione va disattivato su `pointer: coarse` insieme al cursore custom.

## 8. Animazioni e interazioni

**Smooth scroll** — Lenis, integrato con ScrollTrigger tramite `scrollerProxy`. Disattivato con `prefers-reduced-motion`.

**Cursore magnetico in vetro** — elemento `position: fixed` con interpolazione lerp verso il puntatore (fattore 0.15), reso come disco di vetro con rifrazione. Raggio di aggancio 80px sugli elementi marcati `data-magnetic`; l'elemento agganciato si sposta a sua volta di massimo 8px verso il cursore. **Disattivazione totale su `pointer: coarse` e su `prefers-reduced-motion`, con ripristino del cursore di sistema** — mai nascondere il cursore senza sostituirlo.

**WebGL (OGL)** — usato solo per: transizioni immagine sulla griglia progetti e hover distortion sulle cover. Non come sfondo decorativo. Fallback a immagine statica se il contesto WebGL non è disponibile.

**Page transitions** — dissolvenza lenta con traslazione breve, coordinata con il View Transitions API dove supportato.

**Scroll reveal** — un solo pattern condiviso, dichiarativo tramite attributo data, non ripetuto componente per componente.

## 9. Internazionalizzazione

Routing `/[locale]/...` con `it | en | zh`. Localizzazione nativa di Payload a livello di campo. Rilevamento della lingua dal browser al primo accesso, poi persistito.

**I layout vanno verificati in tutte e tre le lingue**: le stringhe cinesi sono del 30–50% più corte delle italiane, quelle inglesi di circa il 15%. I titoli su due righe in italiano diventano una riga in cinese e rompono il ritmo verticale — critico in una direzione visiva costruita sul vuoto.

Il cinese si rivolge a un pubblico internazionale: nessuna licenza ICP né CDN cinese necessari.

## 10. Qualità

**Performance** — l'esperienza è identica su tutti i dispositivi per scelta esplicita. Conseguenza accettata: Lighthouse ~90+ su desktop, ~70–80 su mobile, con il vetro traslucido come costo aggiuntivo rispetto alla stima iniziale. Obbligatori comunque: `next/image` ovunque, `next/font` con subsetting, code splitting delle librerie di animazione, mount pigro del canvas WebGL fuori viewport, tetto di quattro elementi in vetro simultanei.

**Video** — serviti da R2 con CDN davanti, mai dal filesystem dell'app. Pre-compressi H.264 + WebM, loop entro 10–15 secondi, `poster` sempre presente, `preload="none"`, mount pigro. Nessun transcoding adattivo: gli asset vanno ottimizzati a monte.

**Accessibilità** — non negoziabile e indipendente dalle scelte di performance. HTML semantico, focus visibile su ogni elemento interattivo, `prefers-reduced-motion` rispettato in tutto il sito, contrasto AA verificato su entrambi i temi **e sopra gli sfondi variabili degli elementi in vetro**, `alt` localizzato su ogni media, navigazione completa da tastiera.

**SEO** — metadata API di Next, OG image generate dinamicamente per ogni case study, sitemap XML multilingua, `hreflang` reciproci, JSON-LD `Organization` e `CreativeWork`.

**Legale** — cookie banner con consenso preventivo e categorie. Lo strumento di analytics non è ancora stato scelto: predisporre uno slot pluggable, disattivato di default e attivabile solo dopo consenso.

## 11. Form contatti

Campi: nome, azienda, email, tipo di progetto (select), budget indicativo (range), tempistiche, messaggio.

Invio via Resend a un indirizzo configurato in `settings`. Validazione con Zod lato server, honeypot più rate limiting per lo spam. Nessuna persistenza in database. Conferma inline, non redirect.

---

# PARTE 2 — PROMPT PER CLAUDE CODE

> Incolla da qui in giù, allegando anche la Parte 1 come contesto.

Costruisci il sito descritto nella specifica allegata. Segui questo processo, senza saltare fasi.

**Regole di lavoro**

- Prima di scrivere codice, produci un piano di implementazione e attendi conferma.
- Lavora una fase alla volta. Al termine di ogni fase, mostrami cosa è cambiato e fermati.
- TypeScript strict, nessun `any`.
- Ogni valore visivo passa dai token. Nessun colore, spazio o durata scritto a mano in un componente.
- Ogni testo visibile passa dal sistema di traduzione o dal CMS. Nessuna stringa hardcoded.
- Commit atomici con messaggi in inglese.

**Fase 1 — Fondamenta**
Progetto Next.js 15 con App Router e TypeScript. Payload 3 integrato con adapter Postgres e storage S3. Routing `/[locale]` con it/en/zh. Docker compose per sviluppo locale con Postgres. Nessuno stile ancora.

**Fase 2 — Design system**
`tokens/brand.ts` con i primitivi, livello semantico in CSS custom properties, integrazione Tailwind. Toggle tema chiaro/scuro con persistenza e rispetto di `prefers-color-scheme`. Font caricati con `next/font` incluso il subsetting CJK. Scala tipografica fluida. Costruisci una pagina `/styleguide` che mostri ogni token, ogni grado tipografico in tutte e tre le lingue, e la verifica di contrasto sui due temi. Questa pagina è lo strumento di controllo per tutto il resto del progetto.

**Fase 3 — Materiale vetro**
Un unico componente `GlassSurface` che incapsula i quattro strati descritti in §7, con varianti per navbar, pillola, cursore e chrome. Aggiungilo alla styleguide sopra tre fondali di prova: immagine chiara, immagine scura, testo denso. Verifica il contrasto del testo in ciascun caso prima di procedere. Nessun altro componente potrà implementare il vetro per conto proprio.

**Fase 4 — Schema CMS**
Tutte le collection e i global della specifica, con localizzazione, bozze e anteprima live. Seed script con almeno tre case study realistici popolati in tutte e tre le lingue — servono a testare i layout, quindi i contenuti devono avere lunghezze verosimili, non lorem ipsum.

**Fase 5 — Layout e navigazione**
Navbar sticky in vetro, footer, switcher lingua, switcher tema, transizioni di pagina. Ancora senza animazioni complesse.

**Fase 6 — Motore dei blocchi**
Renderer del campo `layout`, con le proprietà comuni background/spacing/animate. Poi i blocchi uno per uno, ciascuno con tutte le sue varianti. Dopo ogni blocco, mostramelo renderizzato in tutte le varianti.

**Fase 7 — Pagine**
Home, indice work con filtri, case study, servizi, about, contatti con form Resend, pagine legali.

**Fase 8 — Sistema di animazione**
Lenis integrato con ScrollTrigger. Pattern unico di scroll reveal. Cursore magnetico in vetro con le sue disattivazioni. Effetti WebGL con OGL sulla griglia progetti e sulle cover. Ogni cosa dietro un controllo di `prefers-reduced-motion`.

**Fase 9 — Rifinitura**
SEO, OG image dinamiche, sitemap, hreflang, JSON-LD, cookie banner con slot analytics pluggable, audit di accessibilità con tastiera e screen reader, audit Lighthouse, verifica di ogni pagina in italiano, inglese e cinese.

**Definizione di completato**

Una fase è chiusa quando: compila senza errori TypeScript, funziona in tutte e tre le lingue, funziona su entrambi i temi, è navigabile da tastiera, rispetta `prefers-reduced-motion`, non supera i quattro elementi in vetro simultanei, e non contiene stringhe o valori visivi hardcoded.
