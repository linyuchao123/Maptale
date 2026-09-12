import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Sidebar } from '@/components/layout/Sidebar'
import { GlobeView } from '@/components/globe/GlobeView'
import { ChinaMapView } from '@/components/map/ChinaMapView'
import { RegionView } from '@/components/map/RegionView'
import { AttractionView } from '@/components/map/AttractionView'
import { CommunityView } from '@/components/community/CommunityView'
import { AgentWorkbenchView } from '@/components/assistant/AgentWorkbenchView'
import { AlbumTimelineView } from '@/components/album/AlbumTimelineView'
import { XiaoluAssistant } from '@/components/assistant/XiaoluAssistant'
import { UploadMemoryModal } from '@/components/ui/UploadMemoryModal'
import { useMapStore } from '@/store/mapStore'

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  globe:      { title: '探索你的人生地图',   sub: '点击地球上的国家，开始旅行时光机' },
  country:    { title: '中国 · 省份地图',    sub: '点击高亮省份，查看你的旅行回忆' },
  region:     { title: '省份 · 景点探索',    sub: '点击景点，查看你拍下的精彩瞬间' },
  attraction: { title: '景点 · 旅行记忆',   sub: '你在这里留下的每一张照片' },
}

export default function App() {
  const { layer, breadcrumb, activeTab, setActiveTab } = useMapStore()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const pageInfo = PAGE_TITLES[layer]

  return (
    <div className="w-screen h-screen overflow-hidden relative flex">

      {/* ── 全局背景光效 ── */}
      <div className="fixed inset-0 pointer-events-none -z-10"
           style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3e8ff 50%, #e8eaf6 100%)' }}>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-100/15 rounded-full blur-[80px]" />
      </div>

      {/* ── 左侧导航栏 ── */}
      <div className="h-full px-3 py-4 flex-shrink-0">
        <Sidebar />
      </div>

      {/* ── 分割线 ── */}
      <div className="w-px h-full bg-gradient-to-b from-transparent via-purple-200/30 to-transparent flex-shrink-0" />

      {/* ── 主内容区 ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-3.5 flex-shrink-0">

          {/* 左侧：面包屑 or 标题 */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab !== 'map' ? (
                <motion.div
                  key="tab-crumb"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  <button
                    onClick={() => setActiveTab('map')}
                    className="glass-card-sm px-3 py-1.5 text-xs text-purple-600 font-medium hover:bg-white transition-all flex items-center gap-1.5"
                  >
                    <span>🌍</span>
                    <span>我的地图</span>
                  </button>
                  <span className="text-gray-300 text-xs">/</span>
                  <span className="text-xs font-bold text-gray-700">
                    {activeTab === 'community' && '👥 发现社区'}
                    {(activeTab === 'assistant' || activeTab === 'plan') && '🤖 AI 规划大厅'}
                    {(activeTab === 'album' || activeTab === 'wishlist') && '📷 旅行相册'}
                  </span>
                </motion.div>
              ) : breadcrumb.length > 1 ? (
                <motion.div
                  key="breadcrumb"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  <Breadcrumb />
                </motion.div>
              ) : (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  <h1 className="text-xl font-bold text-gray-800 leading-tight">
                    {pageInfo.title}
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">{pageInfo.sub}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {breadcrumb.length > 1 && (
              <motion.p
                className="text-[11px] text-gray-400 mt-1 px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {pageInfo.sub}
              </motion.p>
            )}
          </div>

          {/* 右侧操作栏 */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {/* 环境音治愈白噪音开关 */}
            <motion.button
              onClick={() => {
                alert('🎵 正在播放：【自然微风 · 洱海浪花】白噪音')
              }}
              className="glass-card-sm flex items-center gap-1.5 px-3 py-2 text-purple-600 hover:bg-purple-50/60 transition-colors text-xs font-medium"
              whileHover={{ scale: 1.02 }}
              title="沉浸式旅行环境音"
            >
              <span>🌿</span>
              <span>旅途白噪音</span>
            </motion.button>

            {/* 搜索 */}
            <motion.button
              className="glass-card-sm flex items-center gap-2 px-3.5 py-2 text-gray-400
                         hover:text-purple-500 transition-colors duration-200 text-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm">🔍</span>
              <span>搜索记忆</span>
            </motion.button>

            {/* 上传按钮 */}
            <motion.button
              onClick={() => setIsUploadOpen(true)}
              className="pill-btn pill-btn-primary text-xs"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>📷</span>
              <span>上传记忆</span>
            </motion.button>

            {/* 通知 */}
            <motion.button
              className="glass-card-sm w-9 h-9 flex items-center justify-center
                         text-base hover:bg-pink-50/80 transition-colors relative"
              style={{ borderRadius: 12 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              🔔
              {/* 红点 */}
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </motion.button>
          </div>
        </div>

        {/* 顶部分割线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200/30 to-transparent flex-shrink-0 mx-6" />

        {/* 页面内容 — 主视图与层级切换 */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'map' && (
              <motion.div
                key="map-container"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence mode="wait">
                  {layer === 'globe' && (
                    <motion.div
                      key="globe"
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <GlobeView />
                    </motion.div>
                  )}
                  {layer === 'country' && (
                    <motion.div
                      key="country"
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    >
                      <ChinaMapView />
                    </motion.div>
                  )}
                  {layer === 'region' && (
                    <motion.div
                      key="region"
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <RegionView />
                    </motion.div>
                  )}
                  {layer === 'attraction' && (
                    <motion.div
                      key="attraction"
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <AttractionView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div
                key="community"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <CommunityView />
              </motion.div>
            )}

            {(activeTab === 'assistant' || activeTab === 'plan') && (
              <motion.div
                key="assistant"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <AgentWorkbenchView />
              </motion.div>
            )}

            {(activeTab === 'album' || activeTab === 'wishlist') && (
              <motion.div
                key="album"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <AlbumTimelineView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 浮动 AI 助手 ── */}
      <XiaoluAssistant />

      {/* ── 点亮拼图记忆上传弹窗 ── */}
      <UploadMemoryModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  )
}
