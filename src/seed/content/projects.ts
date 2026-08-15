import type { Localized } from './taxonomy'

export type ExecutionSeed =
  | { kind: 'prose'; heading: Localized<string>; body: Localized<string[]> }
  | { kind: 'media'; caption: Localized<string> }

export type ProjectSeed = {
  key: string
  client: string
  clientKey: string
  year: number
  industryKey: string
  serviceKeys: string[]
  teamKeys: string[]
  featured: boolean
  order: number
  accentColor: string
  liveUrl?: string
  title: Localized<string>
  slug: Localized<string>
  claim: Localized<string>
  context: Localized<string[]>
  challenge: Localized<string[]>
  approach: Localized<string[]>
  execution: ExecutionSeed[]
  results: Array<{ value: string; label: Localized<string>; delta: Localized<string> }>
  partners: Array<{ name: string; role: Localized<string> }>
  awards: Array<{ name: string; year: number; category: Localized<string> }>
}

/**
 * Three case studies with plausible lengths, in all three languages.
 *
 * The point is not the prose itself: it is that italian paragraphs run long,
 * english ones about 15% shorter and chinese ones 30–50% shorter, which is
 * exactly what breaks a layout built on vertical rhythm. Lorem ipsum would
 * hide that.
 */
export const projects: ProjectSeed[] = [
  {
    key: 'kaisu',
    client: 'Kaisu Coffee',
    clientKey: 'kaisu',
    year: 2025,
    industryKey: 'food',
    serviceKeys: ['strategy', 'identity', 'art-direction'],
    teamKeys: ['dario', 'elena', 'meilin'],
    featured: true,
    order: 0,
    accentColor: '#A83A15',
    liveUrl: 'https://example.com/kaisu',
    title: {
      it: 'Kaisu, il caffè spiegato senza aggettivi',
      en: 'Kaisu, coffee explained without adjectives',
      zh: 'Kaisu：不用形容词讲清楚一杯咖啡',
    },
    slug: { it: 'kaisu', en: 'kaisu', zh: 'kaisu' },
    claim: {
      it: 'Un torrefattore che smette di gridare e comincia a spiegare.',
      en: 'A roaster that stops shouting and starts explaining.',
      zh: '一家不再叫卖、开始讲解的烘焙商。',
    },
    context: {
      it: [
        'Kaisu tosta caffè di singola origine a Bergamo dal 2014. In dieci anni è passata da tre bar a settanta clienti fra locali e negozi, senza cambiare una virgola del modo in cui si presenta.',
        'Il mercato nel frattempo si era riempito di marche che dicevano tutte le stesse cose con la stessa grafica: fondo scuro, foto di chicchi, parole come "eccellenza" e "passione".',
      ],
      en: [
        'Kaisu has been roasting single-origin coffee in Bergamo since 2014. In ten years it went from three bars to seventy accounts across cafés and shops, without changing a comma of how it presents itself.',
        'The market meanwhile filled up with brands saying the same things with the same graphics: dark backgrounds, photographs of beans, words like "excellence" and "passion".',
      ],
      zh: [
        'Kaisu 自 2014 年起在贝加莫烘焙单一产地咖啡。十年间客户从三家酒吧增加到七十家咖啡馆与商店，而它自我呈现的方式一个字也没改过。',
        '与此同时市场上挤满了用同样的画面说着同样话的品牌：深色背景、咖啡豆照片，以及"卓越"和"热情"这样的词。',
      ],
    },
    challenge: {
      it: [
        'Il problema non era la notorietà: era che nessuno sapeva ripetere cosa distinguesse Kaisu. I baristi vendevano il caffè a memoria, e ogni volta con parole diverse.',
        'Serviva un sistema che facesse dire la stessa cosa a un sacchetto da 250 grammi, a un listino all’ingrosso e a una persona dietro il banco.',
      ],
      en: [
        'Awareness was not the problem: nobody could repeat what set Kaisu apart. Baristas sold the coffee from memory, and with different words every time.',
        'What was needed was a system that made a 250-gram bag, a wholesale price list and a person behind the counter say the same thing.',
      ],
      zh: [
        '问题不在知名度，而在于没有人能复述 Kaisu 的不同之处。咖啡师全凭记忆推销，每次用的说法都不一样。',
        '需要的是一套系统，让 250 克的包装袋、批发价目表和柜台后的人说出同一件事。',
      ],
    },
    approach: {
      it: [
        'Abbiamo tolto prima di aggiungere. Fuori le fotografie di chicchi, fuori il gergo da degustazione, fuori i sei caratteri tipografici accumulati negli anni.',
        'Al loro posto un solo alfabeto, una griglia stretta e una regola: ogni confezione dichiara altitudine, varietà, tostatura e data, nello stesso ordine, sempre. Il resto è spazio bianco.',
      ],
      en: [
        'We subtracted before adding. Out went the bean photography, the tasting jargon, and the six typefaces accumulated over the years.',
        'In their place: one alphabet, a tight grid, and a rule. Every pack states altitude, varietal, roast and date, in the same order, always. The rest is white space.',
      ],
      zh: [
        '我们先做减法。去掉咖啡豆照片、品鉴行话，以及多年累积下来的六款字体。',
        '取而代之的是一套字母表、一个紧凑的网格，和一条规则：每一包都按同样的顺序标明海拔、品种、烘焙度与日期，永远如此。其余的都是留白。',
      ],
    },
    execution: [
      {
        kind: 'prose',
        heading: {
          it: 'Un sistema di etichette, non una linea di packaging',
          en: 'A label system, not a packaging line',
          zh: '一套标签系统，而非一条包装线',
        },
        body: {
          it: [
            'La torrefazione cambia origine ogni sei settimane. Un packaging disegnato caso per caso sarebbe morto in un anno, quindi abbiamo progettato la griglia e lasciato che fossero i dati a comporla.',
            'Il risultato è che una nuova origine si mette in produzione in mezza giornata, senza passare da noi. È stata la richiesta più esplicita del cliente e la parte di lavoro che si vede meno.',
          ],
          en: [
            'The roastery changes origin every six weeks. Packaging designed case by case would have died within a year, so we designed the grid and let the data compose it.',
            'The result is that a new origin goes into production in half a day, without going through us. It was the client’s most explicit request and the least visible part of the work.',
          ],
          zh: [
            '烘焙商每六周更换一次产地。逐款设计的包装一年内就会失效，因此我们设计了网格，让数据自己去填充它。',
            '结果是新产地半天就能投产，无需经过我们。这是客户最明确的要求，也是这项工作中最看不见的部分。',
          ],
        },
      },
      {
        kind: 'media',
        caption: {
          it: 'Sistema di etichette, 2025',
          en: 'Label system, 2025',
          zh: '标签系统，2025',
        },
      },
      {
        kind: 'prose',
        heading: {
          it: 'La formazione conta quanto la grafica',
          en: 'Training counts as much as the graphics',
          zh: '培训与图形同等重要',
        },
        body: {
          it: [
            'Abbiamo scritto due pagine per i baristi: cosa dire in dieci secondi, cosa dire in un minuto, cosa non dire mai. Nessun manuale di marca, nessun moodboard.',
            'Sei mesi dopo il lancio, il novanta per cento dei nuovi clienti all’ingrosso cita la stessa frase quando spiega perché ha scelto Kaisu.',
          ],
          en: [
            'We wrote two pages for baristas: what to say in ten seconds, what to say in a minute, what never to say. No brand manual, no moodboard.',
            'Six months after launch, ninety per cent of new wholesale accounts quote the same sentence when they explain why they chose Kaisu.',
          ],
          zh: [
            '我们为咖啡师写了两页纸：十秒钟说什么、一分钟说什么、永远不要说什么。没有品牌手册，也没有情绪板。',
            '上线六个月后，九成的新批发客户在解释为何选择 Kaisu 时引用了同一句话。',
          ],
        },
      },
    ],
    results: [
      {
        value: '+38%',
        label: { it: 'Clienti all’ingrosso', en: 'Wholesale accounts', zh: '批发客户' },
        delta: { it: 'in dodici mesi', en: 'in twelve months', zh: '十二个月内' },
      },
      {
        value: '−52%',
        label: { it: 'Referenze a catalogo', en: 'Catalogue references', zh: '目录 SKU' },
        delta: { it: 'con margine invariato', en: 'at unchanged margin', zh: '毛利率不变' },
      },
      {
        value: '4 h',
        label: {
          it: 'Tempo per una nuova origine',
          en: 'Time to launch an origin',
          zh: '新产地上线耗时',
        },
        delta: { it: 'era due settimane', en: 'was two weeks', zh: '此前为两周' },
      },
    ],
    partners: [
      { name: 'Cartiera Fedrigoni', role: { it: 'Carte', en: 'Papers', zh: '纸张' } },
      {
        name: 'Studio Ottanta',
        role: { it: 'Fotografia still life', en: 'Still life photography', zh: '静物摄影' },
      },
    ],
    awards: [
      {
        name: 'ADI Design Index',
        year: 2025,
        category: { it: 'Packaging', en: 'Packaging', zh: '包装' },
      },
    ],
  },
  {
    key: 'nebbia',
    client: 'Fondazione Nebbia',
    clientKey: 'nebbia',
    year: 2024,
    industryKey: 'culture',
    serviceKeys: ['identity', 'digital', 'art-direction'],
    teamKeys: ['dario', 'tobia', 'meilin'],
    featured: true,
    order: 1,
    accentColor: '#2F5D50',
    title: {
      it: 'Nebbia, un archivio che si legge come una rivista',
      en: 'Nebbia, an archive that reads like a magazine',
      zh: 'Nebbia：像杂志一样可读的档案',
    },
    slug: { it: 'nebbia', en: 'nebbia', zh: 'nebbia' },
    claim: {
      it: 'Quarant’anni di arte contemporanea, finalmente consultabili da chi non è uno studioso.',
      en: 'Forty years of contemporary art, finally readable by someone who is not a scholar.',
      zh: '四十年的当代艺术，终于让非研究者也能读懂。',
    },
    context: {
      it: [
        'La Fondazione Nebbia conserva ottomila opere, quarantamila documenti e una biblioteca che nessuno consultava. Il sito precedente era una banca dati costruita nel 2009 per i ricercatori, e funzionava benissimo per loro.',
        'Il consiglio voleva aprire l’archivio a un pubblico più largo senza trasformarlo in un contenitore di contenuti divulgativi.',
      ],
      en: [
        'Fondazione Nebbia holds eight thousand works, forty thousand documents and a library nobody consulted. The previous site was a database built in 2009 for researchers, and it served them perfectly well.',
        'The board wanted to open the archive to a wider audience without turning it into a container for explainer content.',
      ],
      zh: [
        'Nebbia 基金会收藏八千件作品、四万份文献，以及一座无人查阅的图书馆。此前的网站是 2009 年为研究者建立的数据库，对他们而言运转良好。',
        '理事会希望向更广的公众开放档案，又不希望它变成科普内容的容器。',
      ],
    },
    challenge: {
      it: [
        'Un archivio non si può riscrivere. Le schede erano compilate in un linguaggio tecnico stratificato in quindici anni, e riscriverle avrebbe significato perdere la precisione che le rende utili.',
        'Bisognava quindi cambiare il modo di entrarci, non il contenuto: costruire percorsi di lettura sopra il catalogo, senza toccare il catalogo.',
      ],
      en: [
        'An archive cannot be rewritten. The records were written in a technical language layered over fifteen years, and rewriting them would have cost the precision that makes them useful.',
        'So the way in had to change, not the content: reading paths built on top of the catalogue, without touching the catalogue.',
      ],
      zh: [
        '档案无法重写。那些条目使用的是十五年间层层累积的专业语言，重写会牺牲掉让它们有用的精确性。',
        '因此需要改变的是进入方式，而不是内容：在目录之上构建阅读路径，而不触碰目录本身。',
      ],
    },
    approach: {
      it: [
        'Abbiamo progettato due letture della stessa base dati. Una è la ricerca per campi, invariata, per chi sa cosa cerca. L’altra è una serie di dossier curati, che attraversano il catalogo per temi e durano circa dodici minuti di lettura.',
        'La tipografia fa quasi tutto il lavoro: un solo carattere, sette gradi, e la disciplina di non aggiungere colore dove basta lo spazio.',
      ],
      en: [
        'We designed two readings of the same data. One is field search, unchanged, for people who know what they are looking for. The other is a series of curated dossiers that cut across the catalogue by theme and run about twelve minutes each.',
        'Typography does almost all the work: one typeface, seven grades, and the discipline not to add colour where space is enough.',
      ],
      zh: [
        '我们为同一套数据设计了两种读法。一种是原封不动的字段检索，给知道自己在找什么的人。另一种是一系列策展式专题，横向穿过目录，每篇约十二分钟。',
        '字体排印承担了几乎全部工作：一款字体、七个级别，以及在留白足够时不添加颜色的克制。',
      ],
    },
    execution: [
      {
        kind: 'prose',
        heading: {
          it: 'Dossier sopra il catalogo',
          en: 'Dossiers on top of the catalogue',
          zh: '目录之上的专题',
        },
        body: {
          it: [
            'Ogni dossier è un montaggio: opere, lettere, fotografie di allestimento e schede tecniche messe in sequenza da un curatore. Il sistema non produce nulla automaticamente, e questa è stata una scelta.',
            'La redazione pubblica un dossier al mese. Dopo il primo anno sono ventidue, e sette sono stati citati da testate che prima non si erano mai occupate della fondazione.',
          ],
          en: [
            'Each dossier is an edit: works, letters, installation photographs and technical records sequenced by a curator. The system generates nothing automatically, and that was a decision.',
            'The team publishes one dossier a month. After the first year there are twenty-two, and seven have been cited by publications that had never covered the foundation before.',
          ],
          zh: [
            '每一份专题都是一次剪辑：作品、信件、布展照片与技术条目由策展人排成序列。系统不自动生成任何内容，这是一个选择。',
            '编辑部每月发布一份专题。第一年结束时共二十二份，其中七份被此前从未报道过基金会的媒体引用。',
          ],
        },
      },
      {
        kind: 'media',
        caption: {
          it: 'Dossier 04, allestimenti 1998',
          en: 'Dossier 04, installations 1998',
          zh: '专题 04，1998 年布展',
        },
      },
    ],
    results: [
      {
        value: '×6',
        label: { it: 'Visite all’archivio', en: 'Archive sessions', zh: '档案访问量' },
        delta: { it: 'primo anno', en: 'first year', zh: '第一年' },
      },
      {
        value: '9:40',
        label: {
          it: 'Tempo medio sui dossier',
          en: 'Average time on dossiers',
          zh: '专题平均停留时长',
        },
        delta: {
          it: 'contro 0:48 delle schede',
          en: 'against 0:48 on records',
          zh: '条目页为 0:48',
        },
      },
      {
        value: '22',
        label: { it: 'Dossier pubblicati', en: 'Dossiers published', zh: '已发布专题' },
        delta: { it: 'senza supporto esterno', en: 'with no outside help', zh: '无外部支持' },
      },
    ],
    partners: [
      { name: 'Archivio Storico Nebbia', role: { it: 'Curatela', en: 'Curatorship', zh: '策展' } },
    ],
    awards: [
      {
        name: 'European Design Awards',
        year: 2024,
        category: { it: 'Digitale', en: 'Digital', zh: '数字' },
      },
      {
        name: 'Awwwards',
        year: 2024,
        category: { it: 'Site of the Day', en: 'Site of the Day', zh: '每日最佳网站' },
      },
    ],
  },
  {
    key: 'ferrovivo',
    client: 'Ferro Vivo',
    clientKey: 'ferrovivo',
    year: 2025,
    industryKey: 'manufacturing',
    serviceKeys: ['strategy', 'digital', 'motion'],
    teamKeys: ['elena', 'tobia'],
    featured: false,
    order: 2,
    accentColor: '#8A5B1F',
    liveUrl: 'https://example.com/ferrovivo',
    title: {
      it: 'Ferro Vivo, utensili venduti senza nostalgia',
      en: 'Ferro Vivo, tools sold without nostalgia',
      zh: 'Ferro Vivo：不贩卖怀旧的手工工具',
    },
    slug: { it: 'ferro-vivo', en: 'ferro-vivo', zh: 'ferro-vivo' },
    claim: {
      it: 'Trent’anni di forgia raccontati come una scelta tecnica, non come un ricordo.',
      en: 'Thirty years of forging told as a technical choice, not as a memory.',
      zh: '三十年的锻造，被讲述为一种技术选择，而非一段回忆。',
    },
    context: {
      it: [
        'Ferro Vivo forgia utensili da giardino a Vicenza. Vende in tutta Europa, soprattutto a vivaisti e paesaggisti, e da tre anni anche direttamente ai privati.',
        'Il sito esistente era un catalogo con settecento fotografie in penombra e una pagina "la nostra storia" più lunga della descrizione dei prodotti.',
      ],
      en: [
        'Ferro Vivo forges garden tools in Vicenza. It sells across Europe, mostly to nurseries and landscapers, and for the last three years directly to private customers too.',
        'The existing site was a catalogue with seven hundred dimly lit photographs and an "our story" page longer than the product descriptions.',
      ],
      zh: [
        'Ferro Vivo 在维琴察锻造园艺工具，销往整个欧洲，主要客户是苗圃与景观公司，近三年也开始直接面向个人。',
        '原有网站是一个目录：七百张光线昏暗的照片，加上一页比产品说明还长的"我们的故事"。',
      ],
    },
    challenge: {
      it: [
        'Il pubblico professionale compra su specifiche: acciaio, tempra, peso, garanzia. Quello privato compra su fiducia, ma non sopporta di essere trattato da turista.',
        'Il sito doveva servire due modi di comprare senza spaccarsi in due siti, e senza scivolare nel racconto dell’artigiano con le mani sporche.',
      ],
      en: [
        'Professionals buy on specification: steel, temper, weight, warranty. Private customers buy on trust, but cannot stand being treated like tourists.',
        'The site had to serve two ways of buying without splitting into two sites, and without sliding into the tale of the craftsman with dirty hands.',
      ],
      zh: [
        '专业客户按规格购买：钢材、淬火、重量、保修。个人客户凭信任购买，却无法忍受被当作游客对待。',
        '网站必须同时服务两种购买方式，既不能拆成两个站点，也不能滑向"双手沾满油污的匠人"那套叙事。',
      ],
    },
    approach: {
      it: [
        'Abbiamo messo le specifiche in cima e la storia in fondo. Ogni scheda prodotto si apre con quattro dati e una fotografia a luce piena, senza ombre teatrali.',
        'Il montaggio video mostra la forgia per quello che è: un procedimento, con tempi e temperature. Dura quarantadue secondi e non ha musica.',
      ],
      en: [
        'We put the specification at the top and the story at the bottom. Every product page opens with four numbers and a photograph in full light, with no theatrical shadows.',
        'The film shows forging for what it is: a process, with times and temperatures. It runs forty-two seconds and has no music.',
      ],
      zh: [
        '我们把规格放在最上面，把故事放在最下面。每个产品页以四项数据和一张全光照片开始，没有戏剧化的阴影。',
        '影片如实呈现锻造：一道工序，有时间与温度。全长四十二秒，没有配乐。',
      ],
    },
    execution: [
      {
        kind: 'prose',
        heading: {
          it: 'Due percorsi, un catalogo',
          en: 'Two paths, one catalogue',
          zh: '两条路径，一个目录',
        },
        body: {
          it: [
            'La stessa scheda prodotto risponde a due domande diverse a seconda di come ci si arriva. Dai filtri tecnici mostra confronti e tolleranze; dalla home mostra uso, manutenzione e durata.',
            'Nessun contenuto è nascosto all’uno o all’altro: cambia l’ordine, non il diritto di leggere.',
          ],
          en: [
            'The same product page answers two different questions depending on how you arrive. From the technical filters it shows comparisons and tolerances; from the home page it shows use, maintenance and lifespan.',
            'No content is hidden from either audience: the order changes, not the right to read.',
          ],
          zh: [
            '同一个产品页会根据你从哪里进来回答不同的问题。从技术筛选进入时展示对比与公差；从首页进入时展示用途、保养与寿命。',
            '没有任何内容对某一方隐藏：改变的是顺序，而不是阅读的权利。',
          ],
        },
      },
      {
        kind: 'media',
        caption: { it: 'Tempra, 980 °C', en: 'Tempering, 980 °C', zh: '淬火，980 °C' },
      },
    ],
    results: [
      {
        value: '+61%',
        label: { it: 'Conversione da mobile', en: 'Mobile conversion', zh: '移动端转化' },
        delta: { it: 'a traffico invariato', en: 'at unchanged traffic', zh: '流量不变' },
      },
      {
        value: '−34%',
        label: { it: 'Richieste di assistenza', en: 'Support requests', zh: '售前咨询' },
        delta: { it: 'sulle specifiche', en: 'about specifications', zh: '关于规格' },
      },
      {
        value: '42 s',
        label: { it: 'Il film di forgia', en: 'The forging film', zh: '锻造影片' },
        delta: { it: 'senza musica', en: 'no music', zh: '无配乐' },
      },
    ],
    partners: [{ name: 'Officina Rive', role: { it: 'Riprese', en: 'Filming', zh: '拍摄' } }],
    awards: [],
  },
]
