import axios from 'axios'

export interface ItineraryDay {
  day: number
  theme: string
  morning: string
  afternoon: string
  evening: string
  photoSpot: string
  foodRecommend: string
}

export interface ItineraryResult {
  destination: string
  daysCount: number
  summary: string
  dailyPlan: ItineraryDay[]
  budgetEstimate: string
  packingTips: string[]
}

export class PlannerAgent {
  private apiKey: string | undefined
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY
    this.baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  }

  /**
   * 生成深度慢旅行程规划方案
   */
  async generateItinerary(params: {
    destination: string
    days?: number
    style?: 'leisure' | 'photo' | 'family' | 'budget'
  }): Promise<ItineraryResult> {
    const { destination, days = 3, style = 'leisure' } = params

    if (this.apiKey) {
      try {
        const prompt = `你是一位顶级独立旅行规划师智能体（PlannerAgent）。
请为旅行者设计一份【${destination}】的【${days}天】旅行方案，风格偏向【${style}】。
严格输出如下 JSON 格式：
{
  "destination": "${destination}",
  "daysCount": ${days},
  "summary": "一句优美的行程寄语",
  "dailyPlan": [
    {
      "day": 1,
      "theme": "第一天主题",
      "morning": "上午安排",
      "afternoon": "下午安排",
      "evening": "傍晚和夜间安排",
      "photoSpot": "今日最佳出片机位",
      "foodRecommend": "特色美食"
    }
  ],
  "budgetEstimate": "人均预估费用区间",
  "packingTips": ["携带物品建议1", "建议2", "建议3"]
}
必须返回合法 JSON，不带任何额外字符。`

        const response = await axios.post(
          `${this.baseUrl}/v1/chat/completions`,
          {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 25000
          }
        )

        const content = response.data?.choices?.[0]?.message?.content
        if (content) {
          const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim()
          return JSON.parse(cleaned) as ItineraryResult
        }
      } catch (err) {
        console.warn('[PlannerAgent] 行程生成调用异常，使用内置精编模板:', (err as Error).message)
      }
    }

    return this.fallbackPlan(destination, days)
  }

  private fallbackPlan(destination: string, days: number): ItineraryResult {
    return {
      destination,
      daysCount: days,
      summary: `在${destination}的微风与阳光里，放慢脚步，找回生活的诗意。`,
      dailyPlan: [
        {
          day: 1,
          theme: '老街漫步与暮色初遇',
          morning: '抵达入住特色庭院客栈，喝茶小憩整理行装',
          afternoon: '漫游核心古老街区，探访手作非遗小铺与古建水系',
          evening: '登上全景高处俯瞰城市屋脊晚霞，享受地道烛光晚餐',
          photoSpot: '老建筑雕花长廊逆光剪影',
          foodRecommend: '特色私房锅物与鲜烤时蔬'
        },
        {
          day: 2,
          theme: '山水秘境与摄影探索',
          morning: '清晨早起迎着晨曦拍摄自然风光，此时光线最干净通透',
          afternoon: '探访标志性地标景点，顺水而行记录蓝天倒影',
          evening: '民谣小酒馆微醺，听当地驻唱歌手的温暖旋律',
          photoSpot: '湖畔/山林视角的纵深感大片',
          foodRecommend: '现烤风味小吃与手作米酒'
        },
        {
          day: 3,
          theme: '慢调采风与时光打包',
          morning: '当地早市感受生鲜与人间烟火气，选购特色伴手礼',
          afternoon: '在风景极佳的咖啡馆整理这趟旅行拍下的拍立得相片',
          evening: '踏上归途，将这段旅程完整点亮在人生拼图上',
          photoSpot: '咖啡馆窗边旅行手帐特写',
          foodRecommend: '手工烘焙与花果茶'
        }
      ],
      budgetEstimate: '人均约 ￥1500 - ￥2800（不含往返大交通）',
      packingTips: ['舒适轻便防滑的徒步运动鞋', '防晒霜与墨镜', '随身便携相机与备用电池', '薄外套应对早晚温差']
    }
  }
}

export const plannerAgent = new PlannerAgent()
