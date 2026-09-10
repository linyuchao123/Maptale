import type { CountryInfo, RegionInfo, AttractionInfo } from '@/store/mapStore'

export interface TravelMemory {
  id: string
  title: string
  location: string
  date: string
  imageUrl: string
  likes: number
  camera: string
  mood: string
  aiStory: string
  tags: string[]
  rotation: number
  aspect?: 'wide' | 'tall' | 'square'
}

// ── 已访问国家数据 ──
export const COUNTRIES_DATA: Record<string, CountryInfo> = {
  CN: { code: 'CN', name: '中国', flag: '🇨🇳', visitedRegions: 22, totalRegions: 34, memoriesCount: 142 },
  JP: { code: 'JP', name: '日本', flag: '🇯🇵', visitedRegions: 4, totalRegions: 47, memoriesCount: 32 },
  TH: { code: 'TH', name: '泰国', flag: '🇹🇭', visitedRegions: 3, totalRegions: 77, memoriesCount: 18 },
  FR: { code: 'FR', name: '法国', flag: '🇫🇷', visitedRegions: 2, totalRegions: 13, memoriesCount: 24 },
  IT: { code: 'IT', name: '意大利', flag: '🇮🇹', visitedRegions: 3, totalRegions: 20, memoriesCount: 19 },
  SG: { code: 'SG', name: '新加坡', flag: '🇸🇬', visitedRegions: 1, totalRegions: 5, memoriesCount: 11 },
  KR: { code: 'KR', name: '韩国', flag: '🇰🇷', visitedRegions: 2, totalRegions: 17, memoriesCount: 14 },
  US: { code: 'US', name: '美国', flag: '🇺🇸', visitedRegions: 3, totalRegions: 50, memoriesCount: 28 },
  AU: { code: 'AU', name: '澳大利亚', flag: '🇦🇺', visitedRegions: 2, totalRegions: 8, memoriesCount: 16 },
  MY: { code: 'MY', name: '马来西亚', flag: '🇲🇾', visitedRegions: 2, totalRegions: 16, memoriesCount: 9 },
}

// ── 中国省份数据 ──
export const CHINA_REGIONS: RegionInfo[] = [
  { id: 'yunnan',    name: '云南', emoji: '🌸', countryCode: 'CN', visitedCities: 3, memoriesCount: 142, daysSpent: 28, coverEmoji: '🏔️' },
  { id: 'sichuan',   name: '四川', emoji: '🐼', countryCode: 'CN', visitedCities: 2, memoriesCount: 88,  daysSpent: 12, coverEmoji: '🐼' },
  { id: 'beijing',   name: '北京', emoji: '🏯', countryCode: 'CN', visitedCities: 1, memoriesCount: 67,  daysSpent: 5,  coverEmoji: '🏯' },
  { id: 'xizang',    name: '西藏', emoji: '🏔️', countryCode: 'CN', visitedCities: 1, memoriesCount: 55,  daysSpent: 8,  coverEmoji: '🏔️' },
  { id: 'guangdong', name: '广东', emoji: '🌆', countryCode: 'CN', visitedCities: 3, memoriesCount: 39,  daysSpent: 6,  coverEmoji: '🌆' },
  { id: 'zhejiang',  name: '浙江', emoji: '🌿', countryCode: 'CN', visitedCities: 2, memoriesCount: 44,  daysSpent: 5,  coverEmoji: '🌿' },
  { id: 'hunan',     name: '湖南', emoji: '🏞️', countryCode: 'CN', visitedCities: 2, memoriesCount: 31,  daysSpent: 4,  coverEmoji: '🏞️' },
  { id: 'shaanxi',   name: '陕西', emoji: '⚔️', countryCode: 'CN', visitedCities: 1, memoriesCount: 28,  daysSpent: 4,  coverEmoji: '⚔️' },
  { id: 'shanghai',  name: '上海', emoji: '🌃', countryCode: 'CN', visitedCities: 1, memoriesCount: 55,  daysSpent: 3,  coverEmoji: '🌃' },
  { id: 'guangxi',   name: '广西', emoji: '🌴', countryCode: 'CN', visitedCities: 3, memoriesCount: 76,  daysSpent: 8,  coverEmoji: '🌴' },
  { id: 'chongqing', name: '重庆', emoji: '🌶️', countryCode: 'CN', visitedCities: 1, memoriesCount: 33,  daysSpent: 4,  coverEmoji: '🌶️' },
  { id: 'jiangsu',   name: '江苏', emoji: '🎭', countryCode: 'CN', visitedCities: 3, memoriesCount: 36,  daysSpent: 5,  coverEmoji: '🎭' },
  { id: 'shandong',  name: '山东', emoji: '🥟', countryCode: 'CN', visitedCities: 2, memoriesCount: 18,  daysSpent: 3,  coverEmoji: '🥟' },
  { id: 'anhui',     name: '安徽', emoji: '🌺', countryCode: 'CN', visitedCities: 1, memoriesCount: 14,  daysSpent: 2,  coverEmoji: '🌺' },
  { id: 'liaoning',  name: '辽宁', emoji: '🏭', countryCode: 'CN', visitedCities: 1, memoriesCount: 20,  daysSpent: 3,  coverEmoji: '🏭' },
  { id: 'hainan',    name: '海南', emoji: '🏖️', countryCode: 'CN', visitedCities: 1, memoriesCount: 22,  daysSpent: 5,  coverEmoji: '🏖️' },
]

// ── 云南景点数据 ──
export const YUNNAN_ATTRACTIONS: AttractionInfo[] = [
  { 
    id: 'lijiang',       
    name: '丽江古城',   
    regionId: 'yunnan', 
    countryCode: 'CN', 
    emoji: '🏘️', 
    description: '世界文化遗产茶马古道重镇，流水与青石板交织的诗意小城',  
    lat: 26.872, 
    lng: 100.233, 
    memoriesCount: 52 
  },
  { 
    id: 'dali',          
    name: '大理古城',   
    regionId: 'yunnan', 
    countryCode: 'CN', 
    emoji: '🌊', 
    description: '苍山积雪，洱海映月，体验风花雪月的慢节奏时光',       
    lat: 25.606, 
    lng: 100.267, 
    memoriesCount: 38 
  },
  { 
    id: 'yulong',        
    name: '玉龙雪山',   
    regionId: 'yunnan', 
    countryCode: 'CN', 
    emoji: '🏔️', 
    description: '纳西族神山，海拔4680米蓝月谷的蓝绿色奇迹',   
    lat: 27.114, 
    lng: 100.187, 
    memoriesCount: 26 
  },
  { 
    id: 'shangri-la',    
    name: '香格里拉',   
    regionId: 'yunnan', 
    countryCode: 'CN', 
    emoji: '🛕', 
    description: '日光之城与松赞林寺的金色钟声，离天堂最近的地方', 
    lat: 27.829, 
    lng: 99.703,  
    memoriesCount: 28 
  },
  { 
    id: 'erhai',         
    name: '洱海生态廊道', 
    regionId: 'yunnan', 
    countryCode: 'CN', 
    emoji: '💙', 
    description: '骑单车吹海风，红杉与水鸟相伴的治愈长廊',         
    lat: 25.758, 
    lng: 100.194, 
    memoriesCount: 15 
  },
  { 
    id: 'xishuangbanna', 
    name: '西双版纳',   
    regionId: 'yunnan', 
    countryCode: 'CN', 
    emoji: '🐘', 
    description: '热带雨林秘境，星光夜市与傣味烧烤的热烈人间烟火',     
    lat: 22.009, 
    lng: 100.797, 
    memoriesCount: 24 
  },
]

// ── 高清真实旅行记忆照片集合（真实自然风光拍摄） ──
export const YUNNAN_MEMORIES: TravelMemory[] = [
  {
    id: 'mem-1',
    title: '丽江古城屋檐与晚霞',
    location: '丽江 · 大研古镇木府旁',
    date: '2023.05.14 18:45',
    imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=1000&auto=format&fit=crop',
    likes: 189,
    camera: 'Sony A7M4 · 35mm f/1.4 · ISO 200',
    mood: '🌸 温暖惬意',
    aiStory: '暮色轻染古镇灰瓦，小溪旁民谣吉他弹唱悠扬，灯笼一盏盏点亮，仿佛掉进了旧时光的梦境。',
    tags: ['古镇微风', '夕阳滤镜', '慢生活'],
    rotation: -1.8,
    aspect: 'wide'
  },
  {
    id: 'mem-2',
    title: '洱海S湾晨雾日出',
    location: '大理 · 磻溪村S湾',
    date: '2023.05.18 06:20',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
    likes: 245,
    camera: 'Fujifilm X-T5 · 23mm f/2.0 · ISO 160',
    mood: '✨ 宁静致远',
    aiStory: '清晨六点的洱海还没醒，薄雾笼罩在水面上，海鸥贴着波浪掠过，连呼吸都变得无比纯净。',
    tags: ['洱海日出', '富士胶片', '治愈系'],
    rotation: 1.5,
    aspect: 'tall'
  },
  {
    id: 'mem-3',
    title: '玉龙雪山冰川公园 4680m',
    location: '丽江 · 玉龙雪山索道顶峰',
    date: '2023.10.22 11:30',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    likes: 312,
    camera: 'iPhone 15 Pro Max · 24mm f/1.78',
    mood: '🏔️ 震撼神圣',
    aiStory: '踏上4680米观景台那一秒，寒风吹拂经幡猎猎作响，万年冰川就在眼前沉睡，敬畏天地造化。',
    tags: ['巅峰打卡', '神圣雪山', '挑战自我'],
    rotation: -0.8,
    aspect: 'square'
  },
  {
    id: 'mem-4',
    title: '香格里拉松赞林寺晨光',
    location: '迪庆 · 噶丹·松赞林寺',
    date: '2023.10.25 08:15',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    likes: 278,
    camera: 'Canon EOS R6 · 70-200mm f/2.8',
    mood: '🛕 纯净虔诚',
    aiStory: '第一缕晨曦照在金顶之上，拉姆央措湖倒映着金色宫殿，转经筒轻轻转动，心里一片清明安详。',
    tags: ['小布达拉宫', '信仰之光', '香格里拉'],
    rotation: 2.2,
    aspect: 'wide'
  },
  {
    id: 'mem-5',
    title: '西双版纳星光夜市烟火气',
    location: '景洪 · 告庄西双景星光夜市',
    date: '2024.08.20 20:30',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    likes: 198,
    camera: 'Sony A7M4 · 50mm f/1.2 · ISO 800',
    mood: '🏮 热烈欢腾',
    aiStory: '澜沧江畔万千油纸伞流光溢彩，柠檬烤鱼的香气扑鼻而来，穿上傣族服饰留下属于盛夏的记忆。',
    tags: ['版纳夜市', '人间烟火', '美食探店'],
    rotation: -1.2,
    aspect: 'tall'
  },
  {
    id: 'mem-6',
    title: '蓝月谷的一抹Tiffany蓝',
    location: '丽江 · 白水河蓝月谷',
    date: '2023.10.22 14:10',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    likes: 260,
    camera: 'DJI Mavic 3 Pro · 24mm',
    mood: '💙 如梦如幻',
    aiStory: '如果人间有月牙落入山谷，那一定是这里。雪水融化成的蓝湖清澈如玉，每一帧都美得不真实。',
    tags: ['蓝月谷', '自然滤镜', '绝美湖水'],
    rotation: 1.0,
    aspect: 'square'
  },
]

// ── 景点特定记忆（丽江古城为例） ──
export const LIJIANG_MEMORIES: TravelMemory[] = [
  {
    id: 'lj-1',
    title: '大研古镇石板小径',
    location: '五一街老巷子',
    date: '2023.05.14 09:30',
    imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=1000&auto=format&fit=crop',
    likes: 142,
    camera: 'Sony A7M4 · 35mm f/1.8',
    mood: '☀️ 清晨宁静',
    aiStory: '清晨的古城没有游人喧嚣，只有水流潺潺与阳光照过雕花木窗的光影，格外安宁。',
    tags: ['青石板路', '纳西民居', '晨游古镇'],
    rotation: -1.5,
  },
  {
    id: 'lj-2',
    title: '狮子山俯瞰古城全景',
    location: '万古楼观景台',
    date: '2023.05.15 17:50',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
    likes: 215,
    camera: 'Fujifilm X-T5 · 50mm f/2.0',
    mood: '🌇 霞光满天',
    aiStory: '站在古城最高点，成片黛瓦屋脊在夕阳下泛着金光，远处的玉龙雪山隐约在云霞中露出雪顶。',
    tags: ['俯瞰全景', '夕阳古镇', '摄影机位'],
    rotation: 1.2,
  },
  {
    id: 'lj-3',
    title: '水车旁的鲜花小巷',
    location: '玉河广场大水车',
    date: '2023.05.16 14:00',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    likes: 168,
    camera: 'iPhone 15 Pro · 3x',
    mood: '💐 繁花似锦',
    aiStory: '大水车嘎吱嘎吱转动着岁月，两旁三角梅开得热烈如火，许愿风铃叮咚作响。',
    tags: ['标志打卡', '三角梅花瀑', '许愿风铃'],
    rotation: -0.9,
  },
  {
    id: 'lj-4',
    title: '民谣小酒馆里的夜晚',
    location: '新华街酒吧街',
    date: '2023.05.16 21:30',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    likes: 185,
    camera: 'Sony A7M4 · 50mm f/1.4',
    mood: '🍷 微醺微风',
    aiStory: '木吉他清脆的琴弦声伴着手鼓，驻唱歌手唱着《去大理》，手中的风花雪月啤酒泛起微沫。',
    tags: ['民谣酒馆', '夜生活', '治愈民谣'],
    rotation: 1.8,
  },
]

// ── 用户统计数据 ──
export const USER_STATS = {
  name: '旅行者小林',
  level: 15,
  levelName: '探索家',
  avatar: '🧑‍🦱',
  visitedCountries: 10,
  visitedRegions: 22,
  totalMemories: 277,
  totalDays: 118,
  sharedMaps: 3,
  chinaExplorePercent: 65,
}
