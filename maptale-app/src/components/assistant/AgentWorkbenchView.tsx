import { useState } from 'react'
import { motion } from 'framer-motion'
import { aiApi } from '@/api/client'

interface DailyPlanItem {
  day: number
  theme: string
  morning: string
  afternoon: string
  evening: string
  photoSpot: string
  foodRecommend: string
}

interface GeneratedPlan {
  destination: string
  daysCount: number
  summary: string
  dailyPlan: DailyPlanItem[]
  budgetEstimate: string
  packingTips: string[]
}

export function AgentWorkbenchView() {
  const [destination, setDestination] = useState('云南 · 丽江大理')
  const [days, setDays] = useState(3)
  const [style, setStyle] = useState<'leisure' | 'photo' | 'family' | 'budget'>('photo')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  // 默认生成的示范方案
  const [plan, setPlan] = useState<GeneratedPlan | null>({
    destination: '云南 · 丽江大理',
    daysCount: 3,
    summary: '在苍山洱海与雪山青石板间，放慢快门与呼吸，找回久违的内心平静。',
    dailyPlan: [
      {
        day: 1,
        theme: '大研古镇漫步 · 暮色屋脊摄影',
        morning: '抵达入住白沙古镇庭院客栈，在纳西木雕小院中沏一壶滇红茶。',
        afternoon: '漫游五一街与四方街，探访非遗东巴纸作坊与古水系。',
        evening: '登上狮子山万古楼观景台，捕捉夕阳洒满黛瓦屋顶的暖金光影。',
        photoSpot: '万古楼顶层向东机位（18:00 - 18:45，柔光日落大片）',
        foodRecommend: '阿婆腊排骨火锅 & 鲜烤花米糕'
      },
      {
        day: 2,
        theme: '玉龙雪山云端 · 蓝月谷冰川秘境',
        morning: '清晨早起乘大索道直登 4680 米冰川公园，迎着雪山初阳拍摄震撼大片。',
        afternoon: '下行至蓝月谷白水河畔，漫步在 Tiffany 蓝雪水湖畔。',
        evening: '夜宿束河古镇，在民谣清吧听吉他弹唱《去大理》。',
        photoSpot: '蓝月谷三号瀑布木栈道顺光机位（13:30 水色最蓝）',
        foodRecommend: '纳西铜锅土鸡米线 & 野生菌汽锅鸡'
      },
      {
        day: 3,
        theme: '洱海生态廊道 · S湾海风与海鸥',
        morning: '乘车前往大理磻溪村 S 湾，租复古单车迎风骑行。',
        afternoon: '在水边水杉林咖啡馆窗前发呆，记录水鸟掠过湖面的轻盈。',
        evening: '整理三天拍立得照片，将这段旅程永久点亮在人生拼图上。',
        photoSpot: '磻溪村 S 弯公路转角（低机位迎水面拍摄）',
        foodRecommend: '喜洲现烤破酥粑粑 & 凉鸡米线'
      }
    ],
    budgetEstimate: '人均约 ￥1600 - ￥2600（含门票索道与特色食宿）',
    packingTips: [
      '防风薄羽绒服（雪山顶常年 0°C - 5°C）',
      '墨镜与高倍防晒（高原紫外线极强）',
      '便携拍立得相机与充足相纸',
      '运动防滑鞋（古镇石板路与栈道多）'
    ]
  })

  const handleStartGenerate = async () => {
    setIsGenerating(true)
    setActiveStep(1)

    try {
      // 模拟多智能体协同阶段递进
      const timer1 = setTimeout(() => setActiveStep(2), 600)
      const timer2 = setTimeout(() => setActiveStep(3), 1200)

      const res: any = await aiApi.itinerary(destination, days, style)
      if (res?.data) {
        setPlan(res.data)
      }
      clearTimeout(timer1)
      clearTimeout(timer2)
    } catch (err) {
      console.warn('[AgentWorkbench] 调用后端生成失败，采用本地方案')
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setActiveStep(0)
      }, 1600)
    }
  }

  return (
    <motion.div
      className="relative w-full h-full flex gap-5 p-6 overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── 左侧：多智能体需求控制台 ── */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4 h-full overflow-y-auto pr-1">
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">小旅 · 多智能体规划大厅</h3>
              <p className="text-[10px] text-gray-400">4大智能体协同，定制手绘级慢旅行程</p>
            </div>
          </div>

          {/* 目的地输入 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">📍 想要去哪里？</label>
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full bg-purple-50/60 border border-purple-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none focus:border-purple-400 transition-colors"
              placeholder="如：云南大理、川西稻城、西藏林芝..."
            />
          </div>

          {/* 天数选择 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">🌙 计划游玩天数</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[2, 3, 5, 7].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`py-1.5 rounded-xl text-xs font-medium transition-all ${
                    days === d
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white/80 text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {d} 天
                </button>
              ))}
            </div>
          </div>

          {/* 旅行风格 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">🎨 偏好风格</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'photo', label: '📸 摄影机位', desc: '追逐最佳光线' },
                { id: 'leisure', label: '☕ 慢调度假', desc: '不赶路品咖啡' },
                { id: 'family', label: '👨‍👩‍👧 治愈亲子', desc: '轻松适宜散步' },
                { id: 'budget', label: '🎒 特色探索', desc: '深入地道小巷' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setStyle(item.id as any)}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    style === item.id
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 text-purple-700'
                      : 'bg-white/80 border-transparent text-gray-600 hover:bg-purple-50/50'
                  }`}
                >
                  <p className="font-bold text-xs">{item.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 触发协同按钮 */}
          <button
            onClick={handleStartGenerate}
            disabled={isGenerating}
            className={`pill-btn pill-btn-primary w-full justify-center text-xs py-2.5 ${
              isGenerating ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <span>{isGenerating ? '⚡' : '🚀'}</span>
            <span>{isGenerating ? '4大智能体协同推演中...' : '启动多智能体联合规划'}</span>
          </button>
        </div>

        {/* 协同智能体阵容卡 */}
        <div className="glass-card p-3.5 space-y-2 text-xs">
          <p className="font-bold text-gray-700 text-[11px] mb-1">🧠 当前协同协作的智能体阵容：</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-1.5 bg-white/60 rounded-lg">
              <span className="text-base">📅</span>
              <div>
                <p className="font-semibold text-gray-800 text-[11px]">PlannerAgent (DeepSeek)</p>
                <p className="text-[9px] text-gray-400">负责骨架行程、时间节奏与人流动线规划</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-white/60 rounded-lg">
              <span className="text-base">👁️</span>
              <div>
                <p className="font-semibold text-gray-800 text-[11px]">VisionAgent (Qwen-VL)</p>
                <p className="text-[9px] text-gray-400">负责出片机位推荐与光影时段计算</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-white/60 rounded-lg">
              <span className="text-base">📍</span>
              <div>
                <p className="font-semibold text-gray-800 text-[11px]">LocationAgent</p>
                <p className="text-[9px] text-gray-400">负责经纬网最优连线，避免走冤枉路</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 右侧：生成的精致手帐行程单 ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {plan && (
          <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-4">
            {/* 顶部长图卡 */}
            <div className="glass-card p-5 relative overflow-hidden bg-gradient-to-r from-purple-50/90 via-pink-50/70 to-amber-50/60 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-[11px] font-bold">
                  ✨ {plan.destination} · {plan.daysCount}日慢旅行程单
                </span>
                <span className="text-xs font-semibold text-amber-600">
                  💰 {plan.budgetEstimate}
                </span>
              </div>
              <p className="text-sm font-light italic text-gray-600 leading-relaxed mt-2">
                “{plan.summary}”
              </p>
            </div>

            {/* 逐日行程卡片 */}
            <div className="space-y-3">
              {plan.dailyPlan.map((d) => (
                <motion.div
                  key={d.day}
                  className="glass-card p-4 hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: d.day * 0.1 }}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        D{d.day}
                      </span>
                      <h4 className="font-bold text-gray-800 text-sm">{d.theme}</h4>
                    </div>
                    <span className="text-[11px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-medium">
                      📸 {d.photoSpot.split('（')[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
                    <div className="p-2.5 bg-white/70 rounded-xl">
                      <p className="text-[10px] text-purple-500 font-bold mb-1">🌅 上午 · 清晨采风</p>
                      <p className="text-gray-600 leading-relaxed">{d.morning}</p>
                    </div>
                    <div className="p-2.5 bg-white/70 rounded-xl">
                      <p className="text-[10px] text-pink-500 font-bold mb-1">☀️ 下午 · 核心漫游</p>
                      <p className="text-gray-600 leading-relaxed">{d.afternoon}</p>
                    </div>
                    <div className="p-2.5 bg-white/70 rounded-xl">
                      <p className="text-[10px] text-amber-500 font-bold mb-1">🌙 傍晚 · 暮色与夜市</p>
                      <p className="text-gray-600 leading-relaxed">{d.evening}</p>
                    </div>
                  </div>

                  {/* 机位与美食 */}
                  <div className="p-2.5 bg-purple-50/50 rounded-xl flex items-center justify-between text-xs border border-purple-100/50">
                    <div className="flex items-center gap-2">
                      <span>📷</span>
                      <span className="text-[11px] text-gray-700"><strong>出片建议：</strong>{d.photoSpot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🍜</span>
                      <span className="text-[11px] text-gray-700"><strong>推荐赏味：</strong>{d.foodRecommend}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 行前随身清单 */}
            <div className="glass-card p-4">
              <h5 className="font-bold text-xs text-gray-700 mb-2 flex items-center gap-1.5">
                <span>🎒</span>
                <span>智能体温馨行前清单：</span>
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {plan.packingTips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 p-2 bg-white/60 rounded-xl text-gray-600">
                    <span className="text-emerald-500">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
