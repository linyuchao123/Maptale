import { motion } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import { YUNNAN_ATTRACTIONS } from '@/data/travelData'

// 省份记忆照片（模拟数据）
const MEMORY_EMOJIS = [
  { emoji: '🏘️', label: '古城老街', date: '2023.05.14', likes: 142, bg: 'from-purple-200 to-indigo-200' },
  { emoji: '🌊', label: '洱海日落', date: '2023.05.18', likes: 98,  bg: 'from-sky-200 to-blue-200' },
  { emoji: '🏔️', label: '玉龙雪山', date: '2023.10.22', likes: 211, bg: 'from-cyan-100 to-sky-200' },
  { emoji: '🐘', label: '雨林奇遇', date: '2024.08.20', likes: 76,  bg: 'from-green-100 to-emerald-200' },
  { emoji: '🛕', label: '香格里拉', date: '2023.10.25', likes: 134, bg: 'from-amber-100 to-orange-200' },
  { emoji: '💙', label: '洱海清晨', date: '2024.08.28', likes: 89,  bg: 'from-blue-100 to-indigo-200' },
]

export function RegionView() {
  const { selectedRegion, drillDown } = useMapStore()
  if (!selectedRegion) return null

  const attractions = YUNNAN_ATTRACTIONS // 后续按 regionId 过滤

  return (
    <motion.div
      className="relative w-full h-full flex gap-6 p-6 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.45 }}
    >
      {/* ── 左侧：省份信息 + 景点地图 ── */}
      <div className="flex flex-col gap-4 w-80 flex-shrink-0">
        {/* 省份标题卡 */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedRegion.coverEmoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-700">{selectedRegion.emoji} {selectedRegion.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">中国 · {selectedRegion.name}省</p>
            </div>
          </div>
          {/* 统计 */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: selectedRegion.memoriesCount, label: '📷 照片', color: 'text-pink-500' },
              { num: selectedRegion.daysSpent,     label: '🌙 天数', color: 'text-amber-500' },
              { num: selectedRegion.visitedCities, label: '🏙️ 城市', color: 'text-purple-500' },
            ].map(s => (
              <div key={s.label} className="bg-white/60 rounded-2xl p-3 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.num}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 时间线 */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22 }}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">旅行时间线</p>
          <div className="flex flex-col gap-3">
            {[
              { date: '2023年5月', places: '大理 · 丽江', color: 'bg-pink-400' },
              { date: '2023年10月', places: '香格里拉', color: 'bg-purple-400' },
              { date: '2024年8月', places: '西双版纳', color: 'bg-sky-400' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${t.color} flex-shrink-0 shadow-sm`} />
                <div>
                  <p className="text-xs font-semibold text-gray-600">{t.date}</p>
                  <p className="text-[10px] text-gray-400">{t.places}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI 摘要卡 */}
        <motion.div
          className="glass-card p-4 border border-purple-200/50"
          style={{ background: 'linear-gradient(135deg, rgba(196,181,253,0.15), rgba(249,168,212,0.1))' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-2 items-start">
            <span className="text-xl flex-shrink-0">✨</span>
            <div>
              <p className="text-xs font-semibold text-purple-600 mb-1">小旅 AI 摘要</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                你已探索{selectedRegion.name} <strong className="text-purple-500">{selectedRegion.visitedCities} 座城市</strong>，
                共记录了 <strong className="text-pink-500">{selectedRegion.daysSpent} 天</strong>旅行，
                拍摄了 <strong className="text-sky-500">{selectedRegion.memoriesCount} 张</strong>照片。
                AI 推荐你下次去<strong className="text-amber-500">元阳梯田</strong>哦～
              </p>
            </div>
          </div>
        </motion.div>

        {/* 景点列表 */}
        <motion.div
          className="glass-card p-4 flex-1 overflow-y-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">📍 景点</p>
          <div className="flex flex-col gap-2">
            {attractions.map((attr) => (
              <button
                key={attr.id}
                onClick={() => drillDown('attraction', attr)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 transition-all duration-200 text-left group"
              >
                <span className="text-xl w-8">{attr.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">{attr.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{attr.description}</p>
                </div>
                <span className="text-[10px] text-pink-400 flex-shrink-0">❤️ {attr.memoriesCount}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── 右侧：照片瀑布流 ── */}
      <div className="flex-1 overflow-y-auto">
        <motion.p
          className="text-sm font-semibold text-gray-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          📸 {selectedRegion.name} 的旅行记忆
        </motion.p>
        <div className="grid grid-cols-3 gap-3">
          {MEMORY_EMOJIS.map((mem, i) => (
            <motion.div
              key={i}
              className={`glass-card overflow-hidden cursor-pointer group
                          ${i === 0 ? 'col-span-2' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              {/* 照片区域 */}
              <div
                className={`bg-gradient-to-br ${mem.bg} flex items-center justify-center
                            ${i === 0 ? 'h-36' : 'h-24'} text-5xl
                            group-hover:scale-105 transition-transform duration-300`}
              >
                {mem.emoji}
              </div>
              {/* 元数据 */}
              <div className="p-2.5">
                <p className="text-xs font-semibold text-gray-700">{mem.label}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-gray-400">{mem.date}</p>
                  <p className="text-[10px] text-pink-400">❤️ {mem.likes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 上传按钮 */}
        <motion.button
          className="pill-btn pill-btn-primary mt-4 mx-auto flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>📷</span>
          上传新记忆
        </motion.button>
      </div>
    </motion.div>
  )
}
