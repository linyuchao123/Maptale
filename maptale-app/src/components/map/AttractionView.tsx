import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import { LIJIANG_MEMORIES, type TravelMemory } from '@/data/travelData'
import { MemoryModal } from '@/components/ui/MemoryModal'

const SPOT_HIGHLIGHTS = [
  { name: '万古楼日落', type: '最佳摄影机位', time: '17:30 - 18:30', tip: '需爬上狮子山，可俯瞰整个大研古镇灰色屋顶与远山。' },
  { name: '大水车三角梅', type: '标志性打卡点', time: '09:00 - 11:00', tip: '晨光柔和时三角梅花瀑顺光，避开正午烈日人流。' },
  { name: '五一街手作坊', type: '纳西非遗文化', time: '14:00 - 16:00', tip: '亲手体验东巴造纸与象形文字木雕拓印。' },
]

export function AttractionView() {
  const { selectedAttraction, selectedRegion } = useMapStore()
  const [activeMemory, setActiveMemory] = useState<TravelMemory | null>(null)
  const [isPlayingGuide, setIsPlayingGuide] = useState(false)

  if (!selectedAttraction) return null

  return (
    <motion.div
      className="relative w-full h-full flex gap-5 p-5 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── 左侧：景点深度档案与 AI 导览 ── */}
      <div className="flex flex-col gap-3.5 w-84 flex-shrink-0 h-full overflow-y-auto pr-1">

        {/* 景点画报卡片 */}
        <motion.div
          className="glass-card overflow-hidden relative shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="h-44 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=1000&auto=format&fit=crop"
              alt={selectedAttraction.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-purple-700 flex items-center gap-1 shadow-sm">
              <span>{selectedAttraction.emoji}</span>
              <span>{selectedRegion?.name} · 5A 景区</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h2 className="text-xl font-bold tracking-tight leading-tight drop-shadow-sm">
                {selectedAttraction.name}
              </h2>
              <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-1 opacity-90">
                {selectedAttraction.description}
              </p>
            </div>
          </div>

          {/* AI 伴游讲解胶囊 (带波形动画) */}
          <div className="p-3.5 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-t border-purple-100/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs shadow-md flex-shrink-0">
                  🧭
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">小旅 · 智能语音画报</p>
                  <p className="text-[10px] text-gray-400">已为你收录纳西历史与古巷秘语</p>
                </div>
              </div>

              <button
                onClick={() => setIsPlayingGuide(!isPlayingGuide)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isPlayingGuide
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {isPlayingGuide ? (
                  <>
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-0.5 h-3 bg-white animate-pulse" />
                      <span className="w-0.5 h-2 bg-white animate-pulse delay-75" />
                      <span className="w-0.5 h-2.5 bg-white animate-pulse delay-150" />
                    </span>
                    <span>播放中</span>
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    <span>听讲解</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 实用出行小组件 */}
        <motion.div
          className="glass-card p-3.5 space-y-3"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <div>
                <p className="font-bold text-gray-700">24°C · 晴朗微风</p>
                <p className="text-[10px] text-gray-400">日落约 19:15 · 适合晚霞拍摄</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
              适宜出行
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-50/60 p-2.5 rounded-xl">
              <p className="text-[10px] text-gray-400">建议游玩</p>
              <p className="font-bold text-purple-700 mt-0.5">1-2 天</p>
            </div>
            <div className="bg-pink-50/60 p-2.5 rounded-xl">
              <p className="text-[10px] text-gray-400">门票状态</p>
              <p className="font-bold text-pink-600 mt-0.5">免费开放</p>
            </div>
          </div>
        </motion.div>

        {/* 经典机位推荐 */}
        <motion.div
          className="glass-card p-3.5"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24 }}
        >
          <p className="text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span>📸 摄影师精选机位</span>
            <span className="text-[10px] text-purple-500 font-normal">机位地图</span>
          </p>
          <div className="space-y-2">
            {SPOT_HIGHLIGHTS.map(spot => (
              <div key={spot.name} className="p-2 bg-white/70 rounded-xl hover:bg-purple-50/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-800">{spot.name}</span>
                  <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium">
                    {spot.time}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-light">{spot.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 操作区 */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => alert('已生成【丽江2日慢节奏行程单】，已添加至你的旅行计划！')}
            className="pill-btn pill-btn-primary flex-1 text-xs justify-center"
          >
            <span>📅</span> 一键生成攻略
          </button>
          <button
            onClick={() => alert('记忆上传器已就绪，可直接拖入手机拍摄的风景照！')}
            className="pill-btn pill-btn-ghost flex-1 text-xs justify-center"
          >
            <span>📷</span> 补签新照片
          </button>
        </div>
      </div>

      {/* ── 右侧：景点专属相册与回忆网格 ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between pb-3 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-800">
              {selectedAttraction.name} · 我的摄影画廊
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">记录下这里的晴天、老街与晚霞时光</p>
          </div>

          <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
            共收录 {LIJIANG_MEMORIES.length} 张回忆卡片
          </span>
        </div>

        {/* 记忆网格 */}
        <div className="flex-1 overflow-y-auto pr-1 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {LIJIANG_MEMORIES.map((memory, i) => (
            <motion.div
              key={memory.id}
              onClick={() => setActiveMemory(memory)}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col relative"
              style={{ transform: `rotate(${memory.rotation}deg)` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{
                scale: 1.02,
                rotate: 0,
                zIndex: 20,
              }}
            >
              {/* 贴纸 */}
              <div className="absolute -top-2 right-6 w-12 h-4 bg-purple-100/80 rounded-xs shadow-xs border-l border-r border-dashed border-purple-300/40 pointer-events-none" />

              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-gray-100 mb-3">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white">
                  {memory.mood}
                </div>
                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-pink-500">
                  ❤️ {memory.likes}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-purple-600 transition-colors">
                    {memory.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {memory.aiStory}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-[10px] text-gray-400">
                  <span className="font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                    {memory.camera.split('·')[0]}
                  </span>
                  <span>{memory.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 拍立得弹窗 */}
      <MemoryModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />
    </motion.div>
  )
}
