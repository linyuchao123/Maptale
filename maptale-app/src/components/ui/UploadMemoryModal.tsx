import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'

interface UploadMemoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadMemoryModal({ isOpen, onClose }: UploadMemoryModalProps) {
  const { selectedRegion } = useMapStore()
  const [step, setStep] = useState<'upload' | 'ai_generating' | 'success'>('upload')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [locationName, setLocationName] = useState('丽江 · 白沙古镇')
  const [diaryNote, setDiaryNote] = useState('')

  if (!isOpen) return null

  const handleSimulateUpload = () => {
    // 模拟选择照片
    setPreviewUrl('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop')
  }

  const handleStartAiGenerate = () => {
    setStep('ai_generating')
    setTimeout(() => {
      setDiaryNote('晨光熹微的白沙古镇，抬头就是玉龙雪山晶莹的峰峦。老街青石板泛着清亮的光，院子里阿婆正晒着草药。时光在这里走得极慢，慢到只剩微风和心跳。')
      setStep('success')
    }, 1600)
  }

  const handleComplete = () => {
    setStep('upload')
    setPreviewUrl(null)
    setDiaryNote('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 背景毛玻璃 */}
        <motion.div
          className="fixed inset-0 bg-purple-950/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleComplete}
        />

        {/* 弹窗主体 */}
        <motion.div
          className="relative z-10 w-full max-w-lg glass-card p-6 shadow-2xl border border-white/80 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          {/* 装饰胶带 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-purple-200/80 -rotate-1 rounded-b shadow-sm" />

          {/* 标题 */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100/60">
            <div className="flex items-center gap-2">
              <span className="text-xl">📷</span>
              <div>
                <h3 className="font-bold text-gray-800 text-base">点亮新的旅行拼图</h3>
                <p className="text-[11px] text-gray-400">上传旅行相片，AI 自动定位并生成诗意手帐</p>
              </div>
            </div>
            <button onClick={handleComplete} className="text-gray-400 hover:text-gray-600 text-lg">
              ✕
            </button>
          </div>

          {step === 'upload' && (
            <div className="space-y-4">
              {/* 上传区域 */}
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-purple-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition-all group"
              >
                {previewUrl ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-md">
                    <img src={previewUrl} alt="预览" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      ✓ EXIF GPS 已识别
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-2">
                      ✨
                    </div>
                    <p className="text-xs font-semibold text-gray-700">点击选择或拖拽旅行照片</p>
                    <p className="text-[10px] text-gray-400 mt-1">支持 JPG, PNG, HEIC，自动读取拍摄相机与经纬度</p>
                  </>
                )}
              </div>

              {/* 自动定位识别条 */}
              <div className="p-3 bg-purple-50/60 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <div>
                    <p className="text-[10px] text-gray-400">已识别拍摄位置</p>
                    <input
                      value={locationName}
                      onChange={e => setLocationName(e.target.value)}
                      className="font-semibold text-purple-700 bg-transparent outline-none w-48 text-xs"
                    />
                  </div>
                </div>
                <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
                  {selectedRegion?.name || '云南'}拼图 +1
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleComplete}
                  className="pill-btn pill-btn-ghost flex-1 justify-center text-xs"
                >
                  取消
                </button>
                <button
                  disabled={!previewUrl}
                  onClick={handleStartAiGenerate}
                  className={`pill-btn pill-btn-primary flex-1 justify-center text-xs ${
                    !previewUrl ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>🪄</span>
                  AI 智能拼图入册
                </button>
              </div>
            </div>
          )}

          {step === 'ai_generating' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"
                style={{ borderRightColor: '#f9a8d4' }}
              />
              <p className="text-sm font-bold text-gray-700">小旅正在解析照片光影与故事...</p>
              <p className="text-xs text-purple-400">正在生成拍立得日记随笔 · 匹配地图图钉</p>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2 text-xs text-purple-700 font-bold">
                  <span>🧭</span>
                  <span>小旅已为你生成手帐日记：</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  “{diaryNote}”
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <span>🎉</span>
                <span>太棒了！你的中国地图解锁进度已提升至 66%！</span>
              </div>

              <button
                onClick={handleComplete}
                className="pill-btn pill-btn-primary w-full justify-center text-xs mt-2"
              >
                查看我的拼图成果 ✨
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
