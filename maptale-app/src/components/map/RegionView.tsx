import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import { YUNNAN_ATTRACTIONS, YUNNAN_MEMORIES, type TravelMemory } from '@/data/travelData'
import { MemoryModal } from '@/components/ui/MemoryModal'

export function RegionView() {
  const { selectedRegion, drillDown } = useMapStore()
  const [activeMemory, setActiveMemory] = useState<TravelMemory | null>(null)
  const [filterTag, setFilterTag] = useState<string>('all')

  if (!selectedRegion) return null

  const attractions = YUNNAN_ATTRACTIONS

  const filteredMemories = filterTag === 'all'
    ? YUNNAN_MEMORIES
    : YUNNAN_MEMORIES.filter(m => m.tags.includes(filterTag))

  const allTags = Array.from(new Set(YUNNAN_MEMORIES.flatMap(m => m.tags)))

  return (
    <motion.div
      className="relative w-full h-full flex gap-5 p-5 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── 左侧：省份手帐档案 ── */}
      <div className="flex flex-col gap-3.5 w-80 flex-shrink-0 h-full overflow-y-auto pr-1">

        {/* 省份封面卡片 */}
        <motion.div
          className="glass-card overflow-hidden relative shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* 背景风景插画横幅 */}
          <div className="h-28 relative overflow-hidden bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
            <img
              src="https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=800&auto=format&fit=crop"
              alt="云南风景"
              className="w-full h-full object-cover opacity-80 mix-blend-overlay scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-purple-700 shadow-sm">
              ✨ 云南省 · 漫游手帐
            </div>
          </div>

          <div className="p-4 pt-0 relative -mt-6">
            <div className="flex items-end gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl border-2 border-white flex-shrink-0">
                {selectedRegion.coverEmoji}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                  {selectedRegion.emoji} {selectedRegion.name}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">彩云之南 · 心灵归宿</p>
              </div>
            </div>

            {/* 核心数据网格 */}
            <div className="grid grid-cols-3 gap-1.5 bg-purple-50/50 p-2 rounded-2xl border border-purple-100/60">
              <div className="text-center p-1.5 bg-white/70 rounded-xl">
                <p className="text-base font-bold text-purple-600">{selectedRegion.memoriesCount}</p>
                <p className="text-[10px] text-gray-400">旅行相片</p>
              </div>
              <div className="text-center p-1.5 bg-white/70 rounded-xl">
                <p className="text-base font-bold text-pink-500">{selectedRegion.daysSpent}</p>
                <p className="text-[10px] text-gray-400">漫游天数</p>
              </div>
              <div className="text-center p-1.5 bg-white/70 rounded-xl">
                <p className="text-base font-bold text-amber-500">{selectedRegion.visitedCities}</p>
                <p className="text-[10px] text-gray-400">已达城市</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 景点打卡导览 */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-gray-700">📍 精选打卡点</span>
            <span className="text-[10px] font-medium text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
              已打卡 6 个
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {attractions.map((attr) => (
              <button
                key={attr.id}
                onClick={() => drillDown('attraction', attr)}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200 text-left group w-full border border-transparent hover:border-purple-100"
              >
                <span className="text-xl w-7 text-center">{attr.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                    {attr.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{attr.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-pink-500 font-semibold block">❤️ {attr.memoriesCount}</span>
                  <span className="text-[9px] text-gray-300 group-hover:text-purple-400">进入 ›</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI 旅行回忆胶囊 */}
        <motion.div
          className="glass-card p-4 relative overflow-hidden border border-pink-200/60"
          style={{ background: 'linear-gradient(135deg, rgba(254,242,242,0.8), rgba(245,243,255,0.8))' }}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🧭</span>
            <span className="text-xs font-bold text-purple-700">小旅 · AI 伴游手记</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            你在云南留下的足迹像一首漫长的诗，从清晨苍山洱海边的单车轻拂，到玉龙雪山索道凌冽的云端风铃。
          </p>
          <div className="mt-3 flex items-center justify-between text-[10px]">
            <span className="text-gray-400">💡 推荐下一站：元阳哈尼梯田</span>
            <span className="text-purple-600 font-semibold cursor-pointer hover:underline">去规划 ↗</span>
          </div>
        </motion.div>
      </div>

      {/* ── 右侧：拍立得照片墙 (Polaroid Scrapbook Wall) ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 顶部标签过滤条 */}
        <div className="flex items-center justify-between pb-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterTag === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              全部记忆 ({YUNNAN_MEMORIES.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  filterTag === tag
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400">
            💡 点击相片翻阅手帐日记
          </span>
        </div>

        {/* 照片卡片网格 */}
        <div className="flex-1 overflow-y-auto pr-1 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMemories.map((memory, i) => (
            <motion.div
              key={memory.id}
              onClick={() => setActiveMemory(memory)}
              className="bg-white p-3.5 pb-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col"
              style={{
                transform: `rotate(${memory.rotation}deg)`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{
                scale: 1.03,
                rotate: 0,
                zIndex: 20,
                transition: { duration: 0.25 }
              }}
            >
              {/* 和纸胶带小贴纸 */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-pink-100/80 rounded-xs shadow-xs border-l border-r border-dashed border-pink-300/40 pointer-events-none" />

              {/* 照片本体 */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-3 shadow-inner">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white">
                  {memory.mood}
                </div>
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-pink-500">
                  ❤️ {memory.likes}
                </div>
              </div>

              {/* 拍立得手写日记文字区域 */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-purple-600 transition-colors">
                    {memory.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {memory.aiStory}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-100 text-[10px] text-gray-400">
                  <span>📍 {memory.location.split('·')[0]}</span>
                  <span className="font-mono">{memory.date.split(' ')[0]}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 拍立得手帐详情弹窗 ── */}
      <MemoryModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />
    </motion.div>
  )
}
