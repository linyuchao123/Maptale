import { motion } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'

const ATTRACTION_MEMORIES = [
  { emoji: '🏘️', bg: 'from-purple-100 to-indigo-200', label: '古城夜景', date: '05.14', likes: 78 },
  { emoji: '🌙', bg: 'from-indigo-100 to-purple-200', label: '星空下',   date: '05.15', likes: 134 },
  { emoji: '🌸', bg: 'from-pink-100 to-rose-200',     label: '桃花巷',   date: '05.16', likes: 56 },
  { emoji: '🍵', bg: 'from-green-100 to-emerald-200', label: '纳西茶馆', date: '05.17', likes: 43 },
  { emoji: '🎵', bg: 'from-amber-100 to-orange-200',  label: '酒吧街',   date: '05.18', likes: 91 },
  { emoji: '🌅', bg: 'from-orange-100 to-pink-200',   label: '日出玉龙', date: '05.19', likes: 167 },
]

const AI_TIPS = [
  { icon: '📷', text: '玉龙雪山索道旁的观景台是最佳拍照点，上午9点光线最美' },
  { icon: '🌤️', text: '今天晴转多云，25°C，下午适合游览古城步行街' },
  { icon: '🍜', text: '推荐「阿婆纳西火锅」，人均￥68，本地人最爱' },
]

export function AttractionView() {
  const { selectedAttraction, selectedRegion } = useMapStore()
  if (!selectedAttraction) return null

  return (
    <motion.div
      className="relative w-full h-full flex gap-5 p-6 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.45 }}
    >
      {/* ── 左侧：景点地图插画 + 信息 ── */}
      <div className="flex flex-col gap-4 w-80 flex-shrink-0">
        {/* 插画地图 */}
        <motion.div
          className="glass-card overflow-hidden flex-1 flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* 景点插画区 */}
          <div
            className="flex-1 min-h-48 flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 50%, #dbeafe 100%)' }}
          >
            {/* 浮动樱花 */}
            {['🌸', '🌸', '⭐', '✨'].map((p, i) => (
              <motion.span
                key={i}
                className="absolute text-lg pointer-events-none"
                style={{ top: `${10 + i * 20}%`, left: `${5 + i * 22}%` }}
                animate={{ y: [0, -8, 0], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
              >
                {p}
              </motion.span>
            ))}
            {/* 主体插画 emoji */}
            <motion.span
              className="text-8xl filter drop-shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {selectedAttraction.emoji}
            </motion.span>
            {/* 景点名标牌 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-card px-4 py-1.5">
              <p className="text-sm font-bold text-gray-700">{selectedAttraction.name}</p>
            </div>
          </div>

          {/* 景点信息 */}
          <div className="p-4">
            <p className="text-xs text-gray-500 leading-relaxed">{selectedAttraction.description}</p>
            <div className="flex gap-2 mt-3">
              <span className="bg-pink-50 text-pink-500 text-[10px] px-2 py-1 rounded-full font-medium">
                📍 {selectedRegion?.name}
              </span>
              <span className="bg-purple-50 text-purple-500 text-[10px] px-2 py-1 rounded-full font-medium">
                ❤️ {selectedAttraction.memoriesCount} 个记忆
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI 小旅推荐 */}
        <motion.div
          className="glass-card p-4"
          style={{ background: 'linear-gradient(135deg, rgba(196,181,253,0.15), rgba(167,243,208,0.1))' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🧭</span>
            <p className="text-sm font-semibold text-purple-600">小旅推荐</p>
          </div>
          <div className="flex flex-col gap-2">
            {AI_TIPS.map((tip, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-base flex-shrink-0">{tip.icon}</span>
                <p className="text-[11px] text-gray-600 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <button className="pill-btn pill-btn-primary flex-1 text-sm">
            <span>📅</span> 规划行程
          </button>
          <button className="pill-btn pill-btn-ghost flex-1 text-sm">
            <span>📷</span> 上传记忆
          </button>
        </motion.div>
      </div>

      {/* ── 右侧：INS 照片网格 ── */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <motion.p
          className="text-sm font-semibold text-gray-500 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          📸 {selectedAttraction.name} 的旅行回忆
        </motion.p>

        {/* 3 列 INS 网格 */}
        <div className="grid grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
          {ATTRACTION_MEMORIES.map((mem, i) => (
            <motion.div
              key={i}
              className="glass-card overflow-hidden cursor-pointer group rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(196,181,253,0.35)' }}
            >
              {/* 日期角标 */}
              <div className="relative">
                <div
                  className={`h-28 bg-gradient-to-br ${mem.bg} flex items-center
                              justify-center text-5xl
                              group-hover:scale-105 transition-transform duration-300`}
                >
                  {mem.emoji}
                </div>
                <div className="absolute top-2 left-2 bg-white/70 backdrop-blur-sm
                                rounded-lg px-1.5 py-0.5 text-[9px] font-bold text-gray-600">
                  {mem.date}
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-gray-700">{mem.label}</p>
                <p className="text-[10px] text-pink-400 mt-1">❤️ {mem.likes}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 天气 + 附近 */}
        <motion.div
          className="glass-card p-4 flex-shrink-0 flex items-center gap-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {/* 天气 */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">☀️</span>
            <div>
              <p className="text-xl font-bold text-amber-500">25°C</p>
              <p className="text-[10px] text-gray-400">{selectedAttraction.name} · 晴</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          {/* 附近餐厅 */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1.5">附近餐厅</p>
            <div className="flex gap-1.5 flex-wrap">
              {['纳西火锅', '古城米线', '藏式餐厅'].map(r => (
                <span key={r} className="bg-pink-50 text-pink-500 text-[10px] px-2.5 py-1 rounded-full font-medium cursor-pointer hover:bg-pink-100 transition-colors">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          {/* 最佳游览时间 */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1.5">最佳游览</p>
            <p className="text-xs font-semibold text-purple-500">🕘 9:00 – 11:00</p>
            <p className="text-[10px] text-gray-400">光线最美时段</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
