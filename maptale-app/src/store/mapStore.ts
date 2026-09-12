import { create } from 'zustand'

// ── 层级类型定义 ──
export type MapLayer = 'globe' | 'country' | 'region' | 'attraction'

export interface CountryInfo {
  code: string       // ISO 2字母代码，如 'CN'
  name: string       // 显示名，如 '中国'
  flag: string       // emoji国旗
  visitedRegions: number
  totalRegions: number
  memoriesCount: number
}

export interface RegionInfo {
  id: string         // 如 'yunnan'
  name: string       // 如 '云南'
  emoji: string
  countryCode: string
  visitedCities: number
  memoriesCount: number
  daysSpent: number
  coverEmoji: string
}

export interface AttractionInfo {
  id: string
  name: string
  regionId: string
  countryCode: string
  emoji: string
  description: string
  lat: number
  lng: number
  memoriesCount: number
}

export type MainTab = 'map' | 'community' | 'assistant' | 'album' | 'plan' | 'wishlist'

// ── 应用全局状态 ──
interface MapState {
  // 当前顶层主导航
  activeTab: MainTab
  // 当前层级（地图主视图内）
  layer: MapLayer
  // 导航历史（面包屑用）
  breadcrumb: Array<{ label: string; emoji: string; layer: MapLayer; id?: string }>
  // 当前选中内容
  selectedCountry: CountryInfo | null
  selectedRegion: RegionInfo | null
  selectedAttraction: AttractionInfo | null
  // 用户数据
  visitedCountries: Set<string>
  visitedRegions: Set<string>
  // 加载状态
  isTransitioning: boolean

  // Actions
  setActiveTab: (tab: MainTab) => void
  drillDown: (layer: MapLayer, data: CountryInfo | RegionInfo | AttractionInfo) => void
  drillUp: (targetLayer: MapLayer) => void
  setTransitioning: (v: boolean) => void
}

export const useMapStore = create<MapState>((set, get) => ({
  activeTab: 'map',
  layer: 'globe',
  breadcrumb: [{ label: '地球', emoji: '🌍', layer: 'globe' }],
  selectedCountry: null,
  selectedRegion: null,
  selectedAttraction: null,
  visitedCountries: new Set(['CN', 'JP', 'TH', 'FR', 'IT', 'US', 'SG', 'MY', 'KR', 'AU']),
  visitedRegions: new Set(['yunnan', 'sichuan', 'beijing', 'shanghai', 'guangdong', 'zhejiang', 'hunan', 'shanxi', 'guangxi', 'chongqing', 'jiangsu', 'shandong', 'anhui', 'liaoning', 'hainan']),
  isTransitioning: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  drillDown: (layer, data) => {
    const state = get()
    let newCrumb: { label: string; emoji: string; layer: MapLayer; id?: string }

    if (layer === 'country') {
      const c = data as CountryInfo
      newCrumb = { label: c.name, emoji: c.flag, layer: 'country', id: c.code }
      set({
        layer: 'country',
        selectedCountry: c,
        breadcrumb: [state.breadcrumb[0], newCrumb],
        isTransitioning: true,
      })
    } else if (layer === 'region') {
      const r = data as RegionInfo
      newCrumb = { label: r.name, emoji: r.emoji, layer: 'region', id: r.id }
      set({
        layer: 'region',
        selectedRegion: r,
        breadcrumb: [...state.breadcrumb.slice(0, 2), newCrumb],
        isTransitioning: true,
      })
    } else if (layer === 'attraction') {
      const a = data as AttractionInfo
      newCrumb = { label: a.name, emoji: a.emoji, layer: 'attraction', id: a.id }
      set({
        layer: 'attraction',
        selectedAttraction: a,
        breadcrumb: [...state.breadcrumb.slice(0, 3), newCrumb],
        isTransitioning: true,
      })
    }

    setTimeout(() => set({ isTransitioning: false }), 600)
  },

  drillUp: (targetLayer) => {
    const layerOrder: MapLayer[] = ['globe', 'country', 'region', 'attraction']
    const targetIdx = layerOrder.indexOf(targetLayer)
    const state = get()

    set({
      layer: targetLayer,
      breadcrumb: state.breadcrumb.slice(0, targetIdx + 1),
      selectedCountry: targetIdx >= 1 ? state.selectedCountry : null,
      selectedRegion: targetIdx >= 2 ? state.selectedRegion : null,
      selectedAttraction: null,
      isTransitioning: true,
    })
    setTimeout(() => set({ isTransitioning: false }), 600)
  },

  setTransitioning: (v) => set({ isTransitioning: v }),
}))
