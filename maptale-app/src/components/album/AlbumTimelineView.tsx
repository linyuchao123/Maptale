import { useState } from 'react'
import { motion } from 'framer-motion'
import { YUNNAN_MEMORIES, type TravelMemory } from '@/data/travelData'
import { MemoryModal } from '@/components/ui/MemoryModal'

export function AlbumTimelineView() {
  const [activeMemory, setActiveMemory] = useState<TravelMemory | null>(null)
  const [selectedYear, setSelectedYear] = useState<'all' | '2024' | '2023'>('all')

  const memories = YUNNAN_MEMORIES.filter(m => {
    if (selectedYear === 'all') return true
    return m.date.startsWith(selectedYear)
  })

  return (
    <motion.div
      className="relative w-full h-full flex flex-col p-6 overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      {/* 顶部标题与年份过滤器 */}
      <div className="flex items-center justify-between pb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📷</span>
            <span>旅行相册 · 光影时光轴</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            翻开属于你的人生手帐，每一帧都是拼图上不可或缺的生动片段
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/70 p-1 rounded-full border border-purple-100 shadow-xs">
          {(['all', '2024', '2023'] as const).map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedYear === yr
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              {yr === 'all' ? '全部年份' : `${yr} 年`}
            </button>
          ))}
        </div>
      </div>

      {/* 照片瀑布流与拍立得画廊 */}
      <div className="flex-1 overflow-y-auto pr-1 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {memories.map((mem, i) => (
          <motion.div
            key={mem.id}
            onClick={() => setActiveMemory(mem)}
            className="bg-white p-3.5 pb-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col"
            style={{ transform: `rotate(${mem.rotation}deg)` }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
          >
            {/* 和纸胶带贴纸 */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-purple-100/80 rounded-xs shadow-xs border-l border-r border-dashed border-purple-300/40 pointer-events-none" />

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-3 shadow-inner">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white">
                {mem.mood}
              </div>
              <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-pink-500">
                ❤️ {mem.likes}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-purple-600 transition-colors">
                  {mem.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {mem.aiStory}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-100 text-[10px] text-gray-400">
                <span>📍 {mem.location}</span>
                <span className="font-mono">{mem.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <MemoryModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />
    </motion.div>
  )
}
