export type WorkmojiCategory =
  | 'goodfeel'
  | 'code'
  | 'design'
  | 'ai'
  | 'cyber'
  | 'freelance'
  | 'operations'
  | 'community';

export type WorkmojiId =
  | 'gf-spark'
  | 'gf-proof'
  | 'gf-flow'
  | 'gf-brainhit'
  | 'gf-stackling'
  | 'gf-bugbite'
  | 'gf-mergey'
  | 'gf-greenbuild'
  | 'gf-pixelbloom'
  | 'gf-perfectcurve'
  | 'gf-gridsoul'
  | 'gf-thinkloop'
  | 'gf-agentawake'
  | 'gf-contextfull'
  | 'gf-ghostwall'
  | 'gf-zerotrace'
  | 'gf-huntmark'
  | 'gf-clientglow'
  | 'gf-scopeclear'
  | 'gf-delivered'
  | 'gf-flowlock'
  | 'gf-routepulse'
  | 'gf-zerobacklog'
  | 'gf-respectpulse'
  | 'gf-goodvibe'
  | 'gf-supportlink';

export interface WorkmojiDefinition {
  id: WorkmojiId;
  token: string;
  label: string;
  category: WorkmojiCategory;
  description: string;
}

export const workmojiCategories: ReadonlyArray<{
  id: 'all' | WorkmojiCategory;
  label: string;
}> = [
  { id: 'all', label: 'Pro tebe' },
  { id: 'goodfeel', label: 'Goodfeel' },
  { id: 'code', label: 'Code' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI' },
  { id: 'cyber', label: 'Cyber' },
  { id: 'freelance', label: 'Freelance' },
  { id: 'operations', label: 'Ops' },
  { id: 'community', label: 'Komunita' }
];

export const workmojiCatalog: ReadonlyArray<WorkmojiDefinition> = [
  {
    id: 'gf-spark',
    token: ':gf-spark:',
    label: 'Good Spark',
    category: 'goodfeel',
    description: 'Tohle má dobrý feeling.'
  },
  {
    id: 'gf-proof',
    token: ':gf-proof:',
    label: 'Proof',
    category: 'goodfeel',
    description: 'Výsledek, kterému věřím.'
  },
  {
    id: 'gf-flow',
    token: ':gf-flow:',
    label: 'Flow',
    category: 'goodfeel',
    description: 'Tohle krásně plyne.'
  },
  {
    id: 'gf-brainhit',
    token: ':gf-brainhit:',
    label: 'Brainhit',
    category: 'goodfeel',
    description: 'Tohle mi právě seplo.'
  },
  {
    id: 'gf-stackling',
    token: ':gf-stackling:',
    label: 'Stackling',
    category: 'code',
    description: 'Čistě poskládaný stack.'
  },
  {
    id: 'gf-bugbite',
    token: ':gf-bugbite:',
    label: 'Bugbite',
    category: 'code',
    description: 'Bug dostal zásah.'
  },
  {
    id: 'gf-mergey',
    token: ':gf-mergey:',
    label: 'Mergey',
    category: 'code',
    description: 'Dvě větve, jeden směr.'
  },
  {
    id: 'gf-greenbuild',
    token: ':gf-greenbuild:',
    label: 'Green Build',
    category: 'code',
    description: 'Build drží a může ven.'
  },
  {
    id: 'gf-pixelbloom',
    token: ':gf-pixelbloom:',
    label: 'Pixel Bloom',
    category: 'design',
    description: 'Detail, který rozkvetl.'
  },
  {
    id: 'gf-perfectcurve',
    token: ':gf-perfectcurve:',
    label: 'Perfect Curve',
    category: 'design',
    description: 'Křivka sedí přesně.'
  },
  {
    id: 'gf-gridsoul',
    token: ':gf-gridsoul:',
    label: 'Grid Soul',
    category: 'design',
    description: 'Layout má konečně duši.'
  },
  {
    id: 'gf-thinkloop',
    token: ':gf-thinkloop:',
    label: 'Thinkloop',
    category: 'ai',
    description: 'Model přemýšlí správným směrem.'
  },
  {
    id: 'gf-agentawake',
    token: ':gf-agentawake:',
    label: 'Agent Awake',
    category: 'ai',
    description: 'Agent je vzhůru a pracuje.'
  },
  {
    id: 'gf-contextfull',
    token: ':gf-contextfull:',
    label: 'Context Full',
    category: 'ai',
    description: 'Kontext drží pohromadě.'
  },
  {
    id: 'gf-ghostwall',
    token: ':gf-ghostwall:',
    label: 'Ghostwall',
    category: 'cyber',
    description: 'Hrozba narazila do zdi.'
  },
  {
    id: 'gf-zerotrace',
    token: ':gf-zerotrace:',
    label: 'Zero Trace',
    category: 'cyber',
    description: 'Stopa končí tady.'
  },
  {
    id: 'gf-huntmark',
    token: ':gf-huntmark:',
    label: 'Hunt Mark',
    category: 'cyber',
    description: 'Threat hunting trefil cíl.'
  },
  {
    id: 'gf-clientglow',
    token: ':gf-clientglow:',
    label: 'Client Glow',
    category: 'freelance',
    description: 'Klient a práce si sedli.'
  },
  {
    id: 'gf-scopeclear',
    token: ':gf-scopeclear:',
    label: 'Scope Clear',
    category: 'freelance',
    description: 'Zadání je čisté a jasné.'
  },
  {
    id: 'gf-delivered',
    token: ':gf-delivered:',
    label: 'Delivered',
    category: 'freelance',
    description: 'Hotovo a předáno.'
  },
  {
    id: 'gf-flowlock',
    token: ':gf-flowlock:',
    label: 'Flowlock',
    category: 'operations',
    description: 'Proces se srovnal do toku.'
  },
  {
    id: 'gf-routepulse',
    token: ':gf-routepulse:',
    label: 'Route Pulse',
    category: 'operations',
    description: 'Trasa žije a drží rytmus.'
  },
  {
    id: 'gf-zerobacklog',
    token: ':gf-zerobacklog:',
    label: 'Zero Backlog',
    category: 'operations',
    description: 'Fronta je čistá.'
  },
  {
    id: 'gf-respectpulse',
    token: ':gf-respectpulse:',
    label: 'Respect Pulse',
    category: 'community',
    description: 'Respekt bez obyčejného palce.'
  },
  {
    id: 'gf-goodvibe',
    token: ':gf-goodvibe:',
    label: 'Good Vibe',
    category: 'community',
    description: 'Tady to má správnou energii.'
  },
  {
    id: 'gf-supportlink',
    token: ':gf-supportlink:',
    label: 'Support Link',
    category: 'community',
    description: 'Jsem v tom s tebou.'
  }
];

export const workmojiByToken = new Map(
  workmojiCatalog.map((workmoji) => [workmoji.token, workmoji] as const)
);

export const workmojiById = new Map(
  workmojiCatalog.map((workmoji) => [workmoji.id, workmoji] as const)
);

export const workmojiTokenPattern = /(:gf-[a-z0-9-]+:)/g;
