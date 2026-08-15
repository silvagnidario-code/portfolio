import type { Locale } from '../../i18n/routing'

export type Localized<T> = Record<Locale, T>

export type IndustrySeed = {
  key: string
  title: Localized<string>
}

export const industries: IndustrySeed[] = [
  {
    key: 'food',
    title: { it: 'Food & Beverage', en: 'Food & Beverage', zh: '食品与饮品' },
  },
  {
    key: 'culture',
    title: { it: 'Cultura', en: 'Culture', zh: '文化' },
  },
  {
    key: 'manufacturing',
    title: { it: 'Manifattura', en: 'Manufacturing', zh: '制造业' },
  },
  {
    key: 'fashion',
    title: { it: 'Moda', en: 'Fashion', zh: '时尚' },
  },
  {
    key: 'technology',
    title: { it: 'Tecnologia', en: 'Technology', zh: '科技' },
  },
]

export type ServiceSeed = {
  key: string
  order: number
  title: Localized<string>
  summary: Localized<string>
  description: Localized<string[]>
}

export const services: ServiceSeed[] = [
  {
    key: 'strategy',
    order: 0,
    title: { it: 'Strategia di marca', en: 'Brand strategy', zh: '品牌策略' },
    summary: {
      it: 'Posizionamento, architettura e messaggi che reggono anche dopo il lancio.',
      en: 'Positioning, architecture and messaging that still hold after launch.',
      zh: '定位、架构与讯息体系，在上线之后依然成立。',
    },
    description: {
      it: [
        'Partiamo da conversazioni con chi vende, chi produce e chi compra, non da una ricerca desk. Quello che emerge quasi sempre è che il problema non è la visibilità: è che il racconto cambia da persona a persona.',
        'Consegniamo un posizionamento in una pagina, l’architettura di marca e un sistema di messaggi che i commerciali possano usare senza rileggerlo ogni volta.',
      ],
      en: [
        'We start from conversations with the people who sell, make and buy, not from desk research. What surfaces almost every time is that visibility is not the problem: the story simply changes from person to person.',
        'You get a one-page positioning, the brand architecture, and a messaging system a sales team can actually use without re-reading it every time.',
      ],
      zh: [
        '我们从与销售、生产与购买者的对话开始，而不是从案头调研开始。几乎每一次浮现的问题都不是曝光度不足：而是同一个故事在每个人口中都不一样。',
        '交付物是一页纸的定位、品牌架构，以及一套销售团队无需反复研读就能使用的讯息系统。',
      ],
    },
  },
  {
    key: 'identity',
    order: 1,
    title: { it: 'Identità visiva', en: 'Visual identity', zh: '视觉识别' },
    summary: {
      it: 'Alfabeti, marchi e sistemi tipografici pensati per durare dieci anni.',
      en: 'Alphabets, marks and typographic systems built to last ten years.',
      zh: '为十年而设计的字母表、标志与字体系统。',
    },
    description: {
      it: [
        'Un’identità non è un logo con un manuale intorno. È un insieme di decisioni ripetibili: quanto respiro lasciare, quale grigio usare, quando fermarsi.',
        'Lavoriamo con pochi elementi e molte regole, perché è la coerenza a farsi riconoscere, non la quantità di segni.',
      ],
      en: [
        'An identity is not a logo with a manual wrapped around it. It is a set of repeatable decisions: how much air to leave, which grey to use, when to stop.',
        'We work with few elements and many rules, because recognition comes from consistency, not from the number of marks.',
      ],
      zh: [
        '识别系统不是一个标志加一本手册，而是一组可复用的决策：留多少空白、用哪一种灰、在哪里停下。',
        '我们使用很少的元素和很多的规则，因为让人记住的是一致性，而不是符号的数量。',
      ],
    },
  },
  {
    key: 'art-direction',
    order: 2,
    title: { it: 'Direzione artistica', en: 'Art direction', zh: '艺术指导' },
    summary: {
      it: 'Fotografia, styling e cura del set: la marca come si presenta davvero.',
      en: 'Photography, styling and set: how the brand actually shows up.',
      zh: '摄影、造型与现场：品牌真正呈现出来的样子。',
    },
    description: {
      it: [
        'La direzione artistica è dove un’identità smette di essere una teoria. Scegliamo luce, materiali e inquadrature, e restiamo sul set fino alla fine.',
        'Costruiamo librerie di immagini utilizzabili per anni, non servizi fotografici che invecchiano in una stagione.',
      ],
      en: [
        'Art direction is where an identity stops being a theory. We choose the light, the materials and the framing, and we stay on set until the end.',
        'We build image libraries that last years, not shoots that age within a season.',
      ],
      zh: [
        '艺术指导是识别系统不再停留于理论的地方。我们选择光线、材质与取景，并一直留在现场直到收工。',
        '我们建立能用上数年的图库，而不是一季就过时的拍摄。',
      ],
    },
  },
  {
    key: 'digital',
    order: 3,
    title: { it: 'Design digitale', en: 'Digital design', zh: '数字设计' },
    summary: {
      it: 'Siti e prodotti che si aprono in fretta e si leggono senza sforzo.',
      en: 'Sites and products that open fast and read without effort.',
      zh: '打开迅速、阅读不费力的网站与产品。',
    },
    description: {
      it: [
        'Progettiamo e sviluppiamo internamente, così le decisioni visive e quelle tecniche si prendono nella stessa stanza.',
        'Ogni progetto parte da un budget di performance e da un impegno di accessibilità dichiarati prima del primo pixel.',
      ],
      en: [
        'We design and build in-house, so the visual and the technical decisions get made in the same room.',
        'Every project starts from a performance budget and an accessibility commitment stated before the first pixel.',
      ],
      zh: [
        '设计与开发都在内部完成，视觉决策与技术决策因此在同一个房间里作出。',
        '每个项目在第一个像素之前，就先确定性能预算与无障碍承诺。',
      ],
    },
  },
  {
    key: 'motion',
    order: 4,
    title: { it: 'Motion e contenuti', en: 'Motion and content', zh: '动态影像与内容' },
    summary: {
      it: 'Video brevi, sistemi di animazione e contenuti che un team interno può mantenere.',
      en: 'Short films, motion systems and content an in-house team can keep up with.',
      zh: '短片、动效系统，以及内部团队维护得住的内容。',
    },
    description: {
      it: [
        'Il motion non è decorazione: è il modo in cui un’interfaccia spiega cosa sta succedendo. Definiamo durate, curve e regole, non singole animazioni.',
        'Per i contenuti lavoriamo per format ripetibili, così la produzione continua anche quando noi non ci siamo più.',
      ],
      en: [
        'Motion is not decoration: it is how an interface explains what is happening. We define durations, curves and rules, not individual animations.',
        'For content we work in repeatable formats, so production continues after we are gone.',
      ],
      zh: [
        '动效不是装饰，而是界面解释正在发生什么的方式。我们定义时长、曲线与规则，而不是逐条动画。',
        '内容方面我们以可复用的格式工作，这样在我们离开之后制作仍能继续。',
      ],
    },
  },
]
