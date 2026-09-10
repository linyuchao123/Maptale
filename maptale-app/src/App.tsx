import { AnimatePresence, motion } from 'framer-motion'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Sidebar } from '@/components/layout/Sidebar'
import { GlobeView } from '@/components/globe/GlobeView'
import { ChinaMapView } from '@/components/map/ChinaMapView'
import { RegionView } from '@/components/map/RegionView'
import { AttractionView } from '@/components/map/AttractionView'
import { XiaoluAssistant } from '@/components/assistant/XiaoluAssistant'
import { useMapStore } from '@/store/mapStore'

export default function App() {
  const { layer, breadcrumb } = useMapStore()

  return (
    <div className="w-screen h-screen overflow-hidden bg-mt-gradient relative flex">

      {/* ── 左侧导航栏 ── */}
      <div className="h-full p-4 flex-shrink-0">
        <Sidebar />
      </div>

      {/* ── 主内容区 ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          {/* 面包屑导航 */}
          <div className="flex-1">
            {breadcrumb.length > 1
              ? <Breadcrumb />
              : (
                <motion.div
                  className="glass-card px-5 py-2 inline-flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-lg">🌍</span>
                  <span className="text-sm font-semibold text-gray-600">探索你的人生地图</span>
                </motion.div>
              )
            }
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center gap-2 ml-4">
            <button className="glass-card px-4 py-2 text-sm text-gray-500 hover:text-purple-500 transition-colors flex items-center gap-1.5">
              🔍 <span>搜索</span>
            </button>
            <button className="pill-btn pill-btn-primary text-sm">
              <span>📷</span> 上传记忆
            </button>
            <button className="glass-card w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-pink-50 transition-colors">
              🔔
            </button>
          </div>
        </div>

        {/* 页面内容 — 层级切换 */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {layer === 'globe' && (
              <motion.div key="globe" className="absolute inset-0">
                <GlobeView />
              </motion.div>
            )}
            {layer === 'country' && (
              <motion.div key="country" className="absolute inset-0">
                <ChinaMapView />
              </motion.div>
            )}
            {layer === 'region' && (
              <motion.div key="region" className="absolute inset-0">
                <RegionView />
              </motion.div>
            )}
            {layer === 'attraction' && (
              <motion.div key="attraction" className="absolute inset-0">
                <AttractionView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 浮动 AI 助手 ── */}
      <XiaoluAssistant />
    </div>
  )
}
