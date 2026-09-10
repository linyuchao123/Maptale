import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { TravelMemory } from '@/data/travelData'

interface MemoryModalProps {
  memory: TravelMemory | null
  onClose: () => void
}

export function MemoryModal({ memory, onClose }: MemoryModalProps) {
  const [likes, setLikes] = useState<number>(memory ? memory.likes : 0)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  if (!memory) return null

  const handleLike = () => {
    if (isLiked) {
      setLikes(l => l - 1)
      setIsLiked(false)
    } else {
      setLikes(l => l + 1)
      setIsLiked(true)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* 背景毛玻璃遮罩 */}
        <motion.div
          className="fixed inset-0 bg-purple-950/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* 拍立得手帐卡片主体 */}
        <motion.div
          className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/80 flex flex-col md:flex-row max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          {/* 和纸胶带装饰 (Washi Tape) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-200/70 -rotate-1 shadow-sm backdrop-blur-xs z-20 pointer-events-none rounded-sm border-l-2 border-r-2 border-dashed border-pink-300/60" />

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-gray-700 flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>

          {/* ── 左侧：拍立得大照片 ── */}
          <div className="md:w-1/2 p-5 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-amber-50/40 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-purple-100/60">
            <div className="w-full relative rounded-2xl overflow-hidden shadow-lg border-4 border-white group">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-mono">{memory.camera}</span>
              </div>
            </div>

            {/* 拍立得手写签名栏 */}
            <div className="w-full flex items-center justify-between mt-3 px-1 text-gray-500 text-xs">
              <span className="font-medium tracking-wide">📍 {memory.location}</span>
              <span className="font-mono text-gray-400">{memory.date.split(' ')[0]}</span>
            </div>
          </div>

          {/* ── 右侧：AI 旅行手帐日记 ── */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {/* 心情与标题 */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100/80 text-pink-600 text-xs font-medium">
                    {memory.mood}
                  </span>
                  <span className="text-xs text-gray-400">· 旅行印记</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 leading-snug">{memory.title}</h3>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1.5">
                {memory.tags.map(t => (
                  <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 font-medium">
                    #{t}
                  </span>
                ))}
              </div>

              {/* 小旅 AI 游记感悟 */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-white border border-purple-100/80 text-gray-700 leading-relaxed text-sm">
                <div className="flex items-center gap-1.5 text-purple-600 font-semibold text-xs mb-2">
                  <span>🧭</span>
                  <span>小旅 · 伴游时光随笔</span>
                </div>
                <p className="italic text-gray-600 text-xs md:text-sm font-light leading-relaxed">
                  “{memory.aiStory}”
                </p>
              </div>

              {/* 器材与参数小卡片 */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                <span className="text-xl">📷</span>
                <div>
                  <p className="font-medium text-gray-700">拍摄参数</p>
                  <p className="text-[11px] text-gray-400 font-mono">{memory.camera}</p>
                </div>
              </div>

              {/* 白噪音 / 声音胶囊 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50/50 border border-pink-100/60">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎵</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">当时环境音 · 丽江晚风</p>
                    <p className="text-[10px] text-gray-400">微风穿过古城风铃的声音</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isPlayingAudio
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {isPlayingAudio ? '⏸ 播放中' : '▶ 试听'}
                </button>
              </div>
            </div>

            {/* 底部操作条 */}
            <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isLiked
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                }`}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span>
                <span>{likes}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('已将该拍立得卡片保存到你的旅行画册！✨')}
                  className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium transition-colors"
                >
                  📥 保存手帐
                </button>
                <button
                  onClick={() => alert('旅行链接已复制，快去小红书/朋友圈分享吧！')}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium shadow-md shadow-purple-200 hover:opacity-95 transition-all"
                >
                  🔗 分享回忆
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
