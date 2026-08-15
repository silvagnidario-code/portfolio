import type { Localized } from './taxonomy'

export type TeamSeed = {
  key: string
  name: string
  order: number
  role: Localized<string>
  bio: Localized<string>
  links: Array<{ label: string; url: string }>
}

export const team: TeamSeed[] = [
  {
    key: 'dario',
    name: 'Dario Sartori',
    order: 0,
    role: { it: 'Direzione creativa', en: 'Creative direction', zh: '创意总监' },
    bio: {
      it: 'Ha aperto lo studio nel 2016 dopo dieci anni fra Milano e Rotterdam. Si occupa di identità e di tutto ciò che finisce stampato.',
      en: 'Opened the studio in 2016 after ten years between Milan and Rotterdam. Looks after identity and everything that ends up printed.',
      zh: '在米兰与鹿特丹工作十年后，于 2016 年创立工作室。负责识别系统以及一切最终会被印刷出来的东西。',
    },
    links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  },
  {
    key: 'elena',
    name: 'Elena Marchetti',
    order: 1,
    role: { it: 'Strategia', en: 'Strategy', zh: '策略' },
    bio: {
      it: 'Viene dalla ricerca etnografica. Passa più tempo nei magazzini dei clienti che nelle sale riunioni, e si vede.',
      en: 'Came from ethnographic research. Spends more time in clients’ warehouses than in meeting rooms, and it shows.',
      zh: '出身民族志研究。待在客户仓库里的时间比会议室里更多，这一点看得出来。',
    },
    links: [],
  },
  {
    key: 'tobia',
    name: 'Tobia Ferrari',
    order: 2,
    role: { it: 'Design digitale', en: 'Digital design', zh: '数字设计' },
    bio: {
      it: 'Progetta e sviluppa. Sostiene che un sito lento sia un problema di direzione artistica prima che di codice.',
      en: 'Designs and builds. Argues that a slow site is an art direction problem before it is a code problem.',
      zh: '既做设计也做开发。他认为网站慢首先是艺术指导的问题，其次才是代码的问题。',
    },
    links: [{ label: 'GitHub', url: 'https://github.com/' }],
  },
  {
    key: 'meilin',
    name: 'Mei Lin Zhou',
    order: 3,
    role: { it: 'Direzione artistica', en: 'Art direction', zh: '艺术指导' },
    bio: {
      it: 'Fotografa e art director. Lavora fra Milano e Shanghai, e cura i progetti che devono funzionare in due alfabeti.',
      en: 'Photographer and art director. Works between Milan and Shanghai, and takes the projects that have to work in two alphabets.',
      zh: '摄影师与艺术指导。往返于米兰与上海之间，负责那些必须在两套文字系统中都成立的项目。',
    },
    links: [],
  },
]

export type ClientSeed = {
  key: string
  name: string
  order: number
  url?: string
}

export const clients: ClientSeed[] = [
  { key: 'kaisu', name: 'Kaisu Coffee', order: 0, url: 'https://example.com/kaisu' },
  { key: 'nebbia', name: 'Fondazione Nebbia', order: 1 },
  { key: 'ferrovivo', name: 'Ferro Vivo', order: 2 },
  { key: 'ortica', name: 'Ortica', order: 3 },
  { key: 'sarti', name: 'Bottega Sarti', order: 4 },
  { key: 'nordwind', name: 'Nordwind', order: 5 },
  { key: 'lume', name: 'Casa Lume', order: 6 },
  { key: 'verso', name: 'Verso', order: 7 },
]

export type TestimonialSeed = {
  key: string
  author: string
  company: string
  clientKey: string
  projectKey: string
  role: Localized<string>
  quote: Localized<string>
}

export const testimonials: TestimonialSeed[] = [
  {
    key: 'kaisu',
    author: 'Silvia Ranieri',
    company: 'Kaisu Coffee',
    clientKey: 'kaisu',
    projectKey: 'kaisu',
    role: { it: 'Fondatrice', en: 'Founder', zh: '创始人' },
    quote: {
      it: 'Ci hanno tolto metà delle parole che usavamo e il fatturato è salito. Non me lo aspettavo in quest’ordine.',
      en: 'They took away half the words we used and revenue went up. I did not expect it in that order.',
      zh: '他们拿掉了我们一半的用词，营收却上升了。我没想到顺序会是这样。',
    },
  },
  {
    key: 'nebbia',
    author: 'Marco Bellandi',
    company: 'Fondazione Nebbia',
    clientKey: 'nebbia',
    projectKey: 'nebbia',
    role: { it: 'Direttore', en: 'Director', zh: '馆长' },
    quote: {
      it: 'Per la prima volta l’archivio viene consultato da persone che non sono ricercatori. È il risultato che cercavamo da anni.',
      en: 'For the first time the archive is being read by people who are not researchers. That is the result we had been after for years.',
      zh: '档案第一次被研究者之外的人翻阅。这正是我们多年来想要的结果。',
    },
  },
  {
    key: 'ferrovivo',
    author: 'Anna Pozzi',
    company: 'Ferro Vivo',
    clientKey: 'ferrovivo',
    projectKey: 'ferrovivo',
    role: { it: 'Direzione commerciale', en: 'Commercial director', zh: '商务总监' },
    quote: {
      it: 'Volevamo un sito che vendesse senza raccontare la favola dell’artigiano. Hanno capito la differenza al primo incontro.',
      en: 'We wanted a site that sells without telling the artisan fairy tale. They understood the difference in the first meeting.',
      zh: '我们想要一个能卖货、又不贩卖手艺人童话的网站。他们在第一次会面就明白了其中的差别。',
    },
  },
]
