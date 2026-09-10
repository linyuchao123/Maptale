export type AgentRole = 
  | 'orchestrator' 
  | 'vision' 
  | 'location' 
  | 'story' 
  | 'chat' 
  | 'planner'

export interface AgentMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  agentName?: string
  timestamp?: string
}

export interface VisionAnalysisResult {
  sceneType: string       // 如："自然风光 / 古镇建筑 / 夜市烟火"
  lighting: string        // 如："黄昏霞光 / 清晨晨曦 / 正午暖阳"
  mood: string            // 如："🌸 温暖惬意"
  elements: string[]      // 如：["青石板路", "灰瓦屋顶", "溪流", "红灯笼"]
  colorPalette: string[]  // 如：["#e06d53", "#3a3845", "#f7d070"]
  weatherGuess: string    // 如："晴朗微风"
  description: string     // 画面内容客观概括
}

export interface LocationResolutionResult {
  countryCode: string     // "CN"
  countryName: string     // "中国"
  regionId: string        // "yunnan", "sichuan", "beijing"
  regionName: string      // "云南"
  city: string            // "大理市"
  attractionName?: string // "洱海生态廊道"
  formattedAddress: string
  lat?: number
  lng?: number
  confidence: number
}

export interface StoryCreationResult {
  title: string
  story: string           // 100-150 字诗意手帐随笔
  mood: string
  tags: string[]
  recommendedMusic?: string
}

export interface ProcessedMemoryResult {
  imageUrl: string
  location: LocationResolutionResult
  vision: VisionAnalysisResult
  story: StoryCreationResult
  camera?: string
  takenAt?: Date
  rotation: number
}
