import axios from 'axios'
import type { AgentMessage } from './types'

export class ChatAgent {
  private apiKey: string | undefined
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY
    this.baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  }

  /**
   * 与小旅助手进行多轮旅行对话
   */
  async chat(params: {
    userMessage: string
    history?: AgentMessage[]
    userStats?: { visitedRegionsCount: number; name: string }
  }): Promise<string> {
    const { userMessage, history = [], userStats } = params

    const systemPrompt = `你是「小旅」，Maptale 智能旅行地图系统的 AI 专属伴游向导。
你的性格：温暖、文艺、活泼、充满探索欲，善于发现旅行细节的美好。
你的专业领域：
1. 中国及全球旅行目的地推荐、特色美食、摄影机位、避坑贴士；
2. 帮助用户规划合理的行程、路线与时间节奏（推崇慢旅行）；
3. 鼓励用户用照片点亮人生拼图（当前用户：${userStats?.name || '旅行者'}，已解锁 ${userStats?.visitedRegionsCount || 22}/34 个省份拼图）。

请用亲切细腻、富有画面感的中文回答。适当使用旅行和治愈系 emoji（如 🌸, 🧭, 📷, ☀️, 🍜）。回复条理清晰，字数控制在 150~300 字以内。`

    if (this.apiKey) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: userMessage }
        ]

        const response = await axios.post(
          `${this.baseUrl}/v1/chat/completions`,
          {
            model: 'deepseek-chat',
            messages,
            temperature: 0.7,
            max_tokens: 600
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 25000
          }
        )

        const reply = response.data?.choices?.[0]?.message?.content
        if (reply) return reply
      } catch (err) {
        console.warn('[ChatAgent] DeepSeek 对话调用异常，触发智能回复模板:', (err as Error).message)
      }
    }

    return this.fallbackChat(userMessage)
  }

  private fallbackChat(userMessage: string): string {
    const msg = userMessage.toLowerCase()
    if (msg.includes('美食') || msg.includes('吃')) {
      return `🍜 为你整理了地道美食秘籍！\n• 当地人私藏老店：清晨先来一碗热气腾腾的特色米线/小吃；\n• 必尝非遗招牌：汽锅鸡与鲜花饼是绝配；\n• 贴心提示：避开主街网红餐厅，拐进居民巷子往往有惊喜哦～`
    }
    if (msg.includes('路线') || msg.includes('行程') || msg.includes('天')) {
      return `🗺️ 推荐经典的 3 日慢节奏探索路线：\nDay 1：到达入住古城客栈 → 漫步青石板小巷 → 狮子山看全景落日\nDay 2：早起登玉龙雪山（上午光线绝佳）→ 下午漫游蓝月谷湖畔\nDay 3：租单车沿生态廊道骑行吹风 → 喝一杯手冲咖啡返程。\n需要我为你调整节奏吗？`
    }
    if (msg.includes('天气') || msg.includes('穿衣')) {
      return `🌤️ 当前目的地近期天气舒适宜人：\n白天晴空万里，气温约 22°C~25°C，适合轻便着装与拍照；\n早晚温差较大（约 12°C），建议随身备一件针织开衫或风衣外套防风！`
    }
    return `🧭 很高兴陪你一起探索人生的旅行地图！无论你是想寻找小众秘境摄影机位、规划一段惬意假期，还是想记录刚拍下的精彩照片，小旅随时随地为你服务～`
  }
}

export const chatAgent = new ChatAgent()
