import type { CountryInfo, RegionInfo, AttractionInfo } from '@/store/mapStore'

// ── 已访问国家数据 ──
export const COUNTRIES_DATA: Record<string, CountryInfo> = {
  CN: { code: 'CN', name: '中国', flag: '🇨🇳', visitedRegions: 22, totalRegions: 34, memoriesCount: 115 },
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
  { id: 'tibet',     name: '西藏', emoji: '🏔️', countryCode: 'CN', visitedCities: 1, memoriesCount: 55,  daysSpent: 8,  coverEmoji: '🏔️' },
  { id: 'guangdong', name: '广东', emoji: '🌆', countryCode: 'CN', visitedCities: 3, memoriesCount: 39,  daysSpent: 6,  coverEmoji: '🌆' },
  { id: 'zhejiang',  name: '浙江', emoji: '🌿', countryCode: 'CN', visitedCities: 2, memoriesCount: 44,  daysSpent: 5,  coverEmoji: '🌿' },
  { id: 'hunan',     name: '湖南', emoji: '🏞️', countryCode: 'CN', visitedCities: 2, memoriesCount: 31,  daysSpent: 4,  coverEmoji: '🏞️' },
  { id: 'shanxi',    name: '陕西', emoji: '⚔️', countryCode: 'CN', visitedCities: 1, memoriesCount: 28,  daysSpent: 4,  coverEmoji: '⚔️' },
  { id: 'shanghai',  name: '上海', emoji: '🌃', countryCode: 'CN', visitedCities: 1, memoriesCount: 55,  daysSpent: 3,  coverEmoji: '🌃' },
  { id: 'guangxi',   name: '广西', emoji: '🌴', countryCode: 'CN', visitedCities: 3, memoriesCount: 76,  daysSpent: 8,  coverEmoji: '🌴' },
  { id: 'chongqing', name: '重庆', emoji: '🌶️', countryCode: 'CN', visitedCities: 1, memoriesCount: 33,  daysSpent: 4,  coverEmoji: '🌶️' },
  { id: 'jiangsu',   name: '江苏', emoji: '🎭', countryCode: 'CN', visitedCities: 3, memoriesCount: 36,  daysSpent: 5,  coverEmoji: '🎭' },
  { id: 'shandong',  name: '山东', emoji: '🥟', countryCode: 'CN', visitedCities: 2, memoriesCount: 18,  daysSpent: 3,  coverEmoji: '🥟' },
  { id: 'anhui',     name: '安徽', emoji: '🌺', countryCode: 'CN', visitedCities: 1, memoriesCount: 14,  daysSpent: 2,  coverEmoji: '🌺' },
  { id: 'liaoning',  name: '辽宁', emoji: '🏭', countryCode: 'CN', visitedCities: 1, memoriesCount: 20,  daysSpent: 3,  coverEmoji: '🏭' },
  { id: 'hainan',    name: '海南', emoji: '🏖️', countryCode: 'CN', visitedCities: 1, memoriesCount: 22,  daysSpent: 5,  coverEmoji: '🏖️' },
]

// ── 云南景点数据（示例） ──
export const YUNNAN_ATTRACTIONS: AttractionInfo[] = [
  { id: 'lijiang',       name: '丽江古城',   regionId: 'yunnan', countryCode: 'CN', emoji: '🏘️', description: '世界文化遗产，茶马古道重镇',  lat: 26.872, lng: 100.233, memoriesCount: 52 },
  { id: 'dali',          name: '大理古城',   regionId: 'yunnan', countryCode: 'CN', emoji: '🌊', description: '苍山洱海之间的历史名城',       lat: 25.606, lng: 100.267, memoriesCount: 38 },
  { id: 'shangri-la',    name: '香格里拉',   regionId: 'yunnan', countryCode: 'CN', emoji: '🛕', description: '最后的香格里拉，藏传文化圣地', lat: 27.829, lng: 99.703,  memoriesCount: 28 },
  { id: 'xishuangbanna', name: '西双版纳',   regionId: 'yunnan', countryCode: 'CN', emoji: '🐘', description: '热带雨林，傣族文化体验地',     lat: 22.009, lng: 100.797, memoriesCount: 24 },
  { id: 'yulong',        name: '玉龙雪山',   regionId: 'yunnan', countryCode: 'CN', emoji: '🏔️', description: '云端上的冰雪世界，4680米',   lat: 27.114, lng: 100.187, memoriesCount: 18 },
  { id: 'erhai',         name: '洱海',       regionId: 'yunnan', countryCode: 'CN', emoji: '💙', description: '高原明珠，最美落日地',         lat: 25.758, lng: 100.194, memoriesCount: 15 },
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
  chinaExplorePercent: 48,
}
