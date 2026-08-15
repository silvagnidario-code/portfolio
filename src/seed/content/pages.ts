import type { Localized } from './taxonomy'

/**
 * Copy for the composed pages. The blocks themselves are assembled by the seed
 * runner, where the resolved document ids live; only the words are here.
 */

export const homeCopy = {
  title: { it: 'Home', en: 'Home', zh: '首页' } satisfies Localized<string>,
  hero: {
    eyebrow: {
      it: 'Studio di progettazione, Milano',
      en: 'Design studio, Milan',
      zh: '设计工作室，米兰',
    },
    heading: {
      it: 'Progettiamo identità che restano leggibili nel tempo.',
      en: 'We design identities that stay legible over time.',
      zh: '我们设计经得起时间考验的品牌识别。',
    },
    lead: {
      it: 'Lavoriamo con aziende che hanno qualcosa di preciso da dire e non trovano il modo di dirlo due volte allo stesso modo.',
      en: 'We work with companies that have something precise to say and cannot find a way to say it the same way twice.',
      zh: '我们与那些有明确想法、却无法两次用同样方式表达出来的企业合作。',
    },
    ctaLabel: { it: 'Guarda i progetti', en: 'See the work', zh: '查看作品' },
  },
  statement: {
    eyebrow: { it: 'Come lavoriamo', en: 'How we work', zh: '工作方式' },
    heading: {
      it: 'Lavoriamo per sottrazione, perché il vuoto non è ciò che avanza: è parte del contenuto.',
      en: 'We work by subtraction, because empty space is not what is left over: it is part of the content.',
      zh: '我们以减法工作，因为留白不是剩下的部分，它本身就是内容。',
    },
    body: {
      it: [
        'Ogni progetto parte da una domanda sola: che cosa deve restare quando tutto il resto è passato di moda. Di solito è meno di quanto il cliente si aspetti, e regge molto più a lungo.',
        'Non consegniamo manuali di trecento pagine. Consegniamo poche regole che una persona interna può applicare da sola il lunedì mattina.',
      ],
      en: [
        'Every project starts from a single question: what has to remain once everything else has gone out of fashion. It is usually less than the client expects, and it lasts far longer.',
        'We do not deliver three-hundred-page manuals. We deliver a few rules an in-house person can apply alone on a Monday morning.',
      ],
      zh: [
        '每个项目都始于同一个问题：当潮流退去之后，什么应该留下来。答案通常比客户预想的更少，却能持续得更久。',
        '我们不交付三百页的手册，而是交付几条规则——内部的人在周一早上就能独立执行。',
      ],
    },
  },
  projects: {
    heading: { it: 'Progetti recenti', en: 'Recent work', zh: '近期作品' },
  },
  services: {
    heading: { it: 'Cosa facciamo', en: 'What we do', zh: '我们做什么' },
    intro: {
      it: 'Cinque competenze, quasi sempre usate insieme. Raramente ha senso comprarne una sola.',
      en: 'Five disciplines, almost always used together. Buying just one rarely makes sense.',
      zh: '五项能力，几乎总是一起使用。只买其中一项很少说得通。',
    },
  },
  clients: {
    heading: { it: 'Con chi lavoriamo', en: 'Who we work with', zh: '合作伙伴' },
  },
  cta: {
    heading: {
      it: 'Raccontaci il progetto. Rispondiamo entro due giorni lavorativi.',
      en: 'Tell us about the project. We answer within two working days.',
      zh: '把项目告诉我们。我们会在两个工作日内回复。',
    },
    body: {
      it: 'Bastano poche righe: cosa vendete, a chi, e cosa non funziona adesso.',
      en: 'A few lines are enough: what you sell, to whom, and what is not working now.',
      zh: '几行字就够：你们卖什么、卖给谁、现在哪里不顺。',
    },
    label: { it: 'Scrivici', en: 'Get in touch', zh: '联系我们' },
  },
}

export const servicesCopy = {
  title: { it: 'Servizi', en: 'Services', zh: '服务' } satisfies Localized<string>,
  hero: {
    eyebrow: { it: 'Servizi', en: 'Services', zh: '服务' },
    heading: {
      it: 'Cinque competenze, un metodo solo.',
      en: 'Five disciplines, a single method.',
      zh: '五项能力，一套方法。',
    },
    lead: {
      it: 'Non vendiamo pacchetti. Guardiamo cosa serve davvero e diciamo anche quando non serviamo noi.',
      en: 'We do not sell packages. We look at what is actually needed, and we say so when it is not us.',
      zh: '我们不卖套餐。我们看真正需要什么，也会直说什么时候不需要我们。',
    },
  },
  faq: {
    heading: { it: 'Domande che ci fanno sempre', en: 'Questions we always get', zh: '常见问题' },
    items: [
      {
        question: {
          it: 'Quanto dura un progetto di identità?',
          en: 'How long does an identity project take?',
          zh: '一个识别系统项目要多久？',
        },
        answer: {
          it: [
            'Fra dieci e sedici settimane, a seconda di quante persone devono approvare. La parte di progetto è quasi sempre più corta della parte di decisione.',
          ],
          en: [
            'Between ten and sixteen weeks, depending on how many people have to approve. The design part is almost always shorter than the deciding part.',
          ],
          zh: ['十到十六周，取决于需要多少人签字。设计所需的时间几乎总是短于做决定所需的时间。'],
        },
      },
      {
        question: {
          it: 'Lavorate anche solo sul sito?',
          en: 'Do you work on the website alone?',
          zh: '可以只做网站吗？',
        },
        answer: {
          it: [
            'Sì, se l’identità esistente è solida. Se non lo è lo diciamo subito: un sito ben fatto sopra una marca confusa rende la confusione più visibile.',
          ],
          en: [
            'Yes, if the existing identity is solid. If it is not we say so immediately: a well-made site on top of a confused brand only makes the confusion more visible.',
          ],
          zh: [
            '可以，前提是现有识别系统足够扎实。如果不扎实我们会直说：在混乱的品牌之上做一个精致的网站，只会让混乱更显眼。',
          ],
        },
      },
      {
        question: {
          it: 'Come funziona il preventivo?',
          en: 'How does pricing work?',
          zh: '报价怎么算？',
        },
        answer: {
          it: [
            'A progetto, non a ore. Dopo il primo incontro mandiamo una cifra unica con dentro tutto, comprese due tornate di revisione. Le variazioni di perimetro si preventivano a parte, e si vedono.',
          ],
          en: [
            'Per project, not per hour. After the first meeting we send a single figure with everything in it, two rounds of revisions included. Scope changes are quoted separately, and they are visible.',
          ],
          zh: [
            '按项目计价，不按小时。首次会面后我们会给出一个包含一切的总价，含两轮修改。范围变更单独报价，并且看得见。',
          ],
        },
      },
    ],
  },
  cta: {
    heading: {
      it: 'Se non siete sicuri di cosa vi serve, chiedetecelo.',
      en: 'If you are not sure what you need, ask us.',
      zh: '如果不确定需要什么，直接问我们。',
    },
    label: { it: 'Scrivici', en: 'Get in touch', zh: '联系我们' },
  },
}

export const aboutCopy = {
  title: { it: 'Studio', en: 'Studio', zh: '工作室' } satisfies Localized<string>,
  hero: {
    eyebrow: { it: 'Chi siamo', en: 'About', zh: '关于' },
    heading: {
      it: 'Quattro persone, una stanza sola, nessun account manager.',
      en: 'Four people, one room, no account managers.',
      zh: '四个人，一间办公室，没有客户经理。',
    },
    lead: {
      it: 'Chi progetta è la stessa persona che vi risponde al telefono. È il motivo per cui prendiamo pochi progetti all’anno.',
      en: 'The person who designs is the person who answers the phone. It is why we take on few projects a year.',
      zh: '做设计的人就是接电话的人。这也是我们每年只接少量项目的原因。',
    },
  },
  statement: {
    eyebrow: { it: 'Il metodo', en: 'The method', zh: '方法' },
    heading: {
      it: 'Preferiamo essere precisi che essere veloci, e dirlo prima di firmare.',
      en: 'We would rather be precise than fast, and we say so before signing.',
      zh: '我们宁可准确也不求快，并且在签约之前就说清楚。',
    },
    body: {
      it: [
        'Lavoriamo in studio, in presenza, con i clienti che vengono a trovarci almeno due volte durante il progetto. Le videochiamate servono per aggiornarsi, non per decidere.',
        'Ogni progetto ha un solo interlocutore da parte nostra e uno da parte del cliente. Quando questa regola salta, saltano anche i tempi.',
      ],
      en: [
        'We work in the studio, in person, with clients visiting at least twice during a project. Video calls are for updates, not for decisions.',
        'Every project has one contact on our side and one on the client side. When that rule breaks, the schedule breaks with it.',
      ],
      zh: [
        '我们在工作室里当面工作，客户在项目期间至少来访两次。视频会议用于同步进展，而不是用于做决定。',
        '每个项目我们这边只有一个对接人，客户那边也只有一个。这条规则一旦被打破，进度也会随之被打破。',
      ],
    },
  },
  team: {
    heading: { it: 'Le persone', en: 'The people', zh: '团队' },
    intro: {
      it: 'Nessuno di noi fa una cosa sola, ma ognuno ha l’ultima parola su qualcosa.',
      en: 'None of us does one thing only, but each of us has the last word on something.',
      zh: '我们每个人都不只做一件事，但每个人都对某件事有最终决定权。',
    },
  },
  clients: {
    heading: { it: 'Clienti', en: 'Clients', zh: '客户' },
  },
  cta: {
    heading: {
      it: 'Il prossimo progetto lo scegliamo insieme.',
      en: 'We choose the next project together.',
      zh: '下一个项目由我们一起挑选。',
    },
    label: { it: 'Parliamone', en: 'Let’s talk', zh: '聊一聊' },
  },
}

/**
 * Placeholder legal copy. It is written to be structurally realistic — the
 * right sections, the right lengths — and is explicitly not legal advice: the
 * client's counsel replaces the wording, not the layout.
 */
export const legalCopy = {
  privacy: {
    slug: 'privacy',
    title: { it: 'Privacy', en: 'Privacy', zh: '隐私政策' } satisfies Localized<string>,
    heading: {
      it: 'Come trattiamo i dati di chi ci scrive.',
      en: 'How we handle the data of people who write to us.',
      zh: '我们如何处理来信者的数据。',
    },
    lead: {
      it: 'Testo segnaposto, da sostituire con quello del consulente legale del cliente prima della pubblicazione.',
      en: 'Placeholder text, to be replaced by the client’s legal counsel before launch.',
      zh: '占位文本，上线前须由客户的法律顾问替换。',
    },
    body: {
      it: [
        'Raccogliamo solo i dati che ci vengono inviati volontariamente dal modulo di contatto: nome, azienda, indirizzo email, tipo di progetto, budget indicativo, tempistiche e il testo del messaggio. Non usiamo questi dati per profilazione e non li cediamo a terzi.',
        'I messaggi vengono recapitati via email e conservati nella casella dello studio per il tempo necessario a rispondere e a gestire un’eventuale trattativa. Non vengono salvati in nessun database del sito.',
        'Per esercitare i diritti previsti dal GDPR — accesso, rettifica, cancellazione, limitazione, portabilità e opposizione — è sufficiente scrivere all’indirizzo di contatto indicato in fondo alla pagina.',
      ],
      en: [
        'We only collect what is voluntarily sent through the contact form: name, company, email address, project type, indicative budget, timing and the message itself. We do not use this data for profiling and we do not pass it to third parties.',
        'Messages are delivered by email and kept in the studio inbox for as long as answering and handling a possible engagement requires. Nothing is stored in any database of this site.',
        'To exercise the rights the GDPR provides — access, rectification, erasure, restriction, portability and objection — writing to the contact address at the bottom of the page is enough.',
      ],
      zh: [
        '我们只收集通过联系表单自愿提交的信息：姓名、公司、电子邮箱、项目类型、预算范围、时间安排以及留言内容。我们不将这些数据用于用户画像，也不会转交第三方。',
        '留言以邮件形式送达并保存在工作室邮箱中，保留时间以答复及后续洽谈所需为限。本站的任何数据库都不存储这些内容。',
        '如需行使 GDPR 赋予的权利——访问、更正、删除、限制处理、可携带与反对——写信至页面底部的联系地址即可。',
      ],
    },
  },
  cookie: {
    slug: 'cookie',
    title: { it: 'Cookie', en: 'Cookie', zh: 'Cookie' } satisfies Localized<string>,
    heading: {
      it: 'Quali cookie usiamo, e perché sono pochi.',
      en: 'Which cookies we use, and why there are few.',
      zh: '我们使用哪些 Cookie，以及为何数量很少。',
    },
    lead: {
      it: 'Testo segnaposto, da sostituire con quello del consulente legale del cliente prima della pubblicazione.',
      en: 'Placeholder text, to be replaced by the client’s legal counsel before launch.',
      zh: '占位文本，上线前须由客户的法律顾问替换。',
    },
    body: {
      it: [
        'Il sito usa due cookie tecnici, che non richiedono consenso: quello che ricorda la lingua scelta e quello che ricorda se preferisci il tema chiaro o scuro. Entrambi restano sul dispositivo e non vengono letti da nessun servizio esterno.',
        'Non è attivo alcuno strumento di analisi. Se in futuro ne verrà introdotto uno, sarà disattivato per impostazione predefinita e si attiverà soltanto dopo un consenso esplicito espresso dal banner.',
        'I font sono ospitati sul nostro server: aprire una pagina non comporta alcuna richiesta verso servizi di terze parti.',
      ],
      en: [
        'The site uses two technical cookies, which need no consent: one remembers the chosen language, the other whether you prefer the light or the dark theme. Both stay on the device and are read by no external service.',
        'No analytics tool is active. If one is introduced later it will be off by default and will only start after explicit consent given through the banner.',
        'Fonts are hosted on our own server: opening a page makes no request to any third party.',
      ],
      zh: [
        '本站使用两个无需同意的技术性 Cookie：一个记住所选语言，另一个记住你偏好浅色还是深色主题。两者都保存在设备本地，不会被任何外部服务读取。',
        '当前未启用任何分析工具。若日后引入，将默认关闭，并且只有在通过横幅明确同意之后才会启动。',
        '字体托管在我们自己的服务器上：打开页面不会向任何第三方发出请求。',
      ],
    },
  },
} as const

export const globalsCopy = {
  settings: {
    legalName: 'Studio Sartori Srl',
    vatId: 'IT 03219870168',
    email: 'ciao@example.com',
    briefRecipient: 'brief@example.com',
    phone: '+39 02 0000 0000',
    offices: [
      {
        city: { it: 'Milano', en: 'Milan', zh: '米兰' },
        address: {
          it: 'Via Ventura 14\n20134 Milano, Italia',
          en: 'Via Ventura 14\n20134 Milan, Italy',
          zh: 'Via Ventura 14\n20134 米兰，意大利',
        },
        timezone: 'Europe/Rome',
      },
      {
        city: { it: 'Shanghai', en: 'Shanghai', zh: '上海' },
        address: {
          it: 'Anfu Lu 322\n200031 Shanghai, Cina',
          en: 'Anfu Lu 322\n200031 Shanghai, China',
          zh: '安福路 322 号\n200031 上海，中国',
        },
        timezone: 'Asia/Shanghai',
      },
    ],
    social: [
      { platform: 'Instagram', url: 'https://instagram.com/' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/' },
    ],
  },
  navigation: [
    { label: { it: 'Progetti', en: 'Work', zh: '作品' }, path: '/work' },
    { label: { it: 'Servizi', en: 'Services', zh: '服务' }, path: '/services' },
    { label: { it: 'Studio', en: 'Studio', zh: '工作室' }, path: '/about' },
    { label: { it: 'Contatti', en: 'Contact', zh: '联系' }, path: '/contact' },
  ],
  footer: {
    columns: [
      {
        title: { it: 'Studio', en: 'Studio', zh: '工作室' },
        links: [
          { label: { it: 'Chi siamo', en: 'About', zh: '关于' }, url: '/about' },
          { label: { it: 'Servizi', en: 'Services', zh: '服务' }, url: '/services' },
          { label: { it: 'Contatti', en: 'Contact', zh: '联系' }, url: '/contact' },
        ],
      },
      {
        title: { it: 'Legale', en: 'Legal', zh: '法律' },
        links: [
          { label: { it: 'Privacy', en: 'Privacy', zh: '隐私政策' }, url: '/legal/privacy' },
          { label: { it: 'Cookie', en: 'Cookie', zh: 'Cookie' }, url: '/legal/cookie' },
        ],
      },
    ],
    legalText: {
      it: 'Studio Sartori Srl — Via Ventura 14, Milano. Tutti i diritti riservati.',
      en: 'Studio Sartori Srl — Via Ventura 14, Milan. All rights reserved.',
      zh: 'Studio Sartori Srl — 米兰 Via Ventura 14。保留所有权利。',
    },
  },
  seo: {
    siteName: { it: 'Studio', en: 'Studio', zh: '工作室' },
    titleTemplate: '%s — Studio',
    description: {
      it: 'Studio di progettazione a Milano: strategia di marca, identità visiva, direzione artistica e design digitale.',
      en: 'Design studio in Milan: brand strategy, visual identity, art direction and digital design.',
      zh: '米兰设计工作室：品牌策略、视觉识别、艺术指导与数字设计。',
    },
  },
}
