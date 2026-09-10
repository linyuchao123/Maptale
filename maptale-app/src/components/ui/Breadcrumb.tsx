import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import type { MapLayer } from '@/store/mapStore'

export function Breadcrumb() {
  const { breadcrumb, drillUp } = useMapStore()

  if (breadcrumb.length <= 1) return null

  return (
    <motion.div
      className="breadcrumb"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {breadcrumb.map((item, idx) => (
          <motion.div
            key={item.layer + (item.id || '')}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: idx * 0.05 }}
          >
            {idx > 0 && <span className="breadcrumb-sep">›</span>}
            <button
              className={`breadcrumb-item ${idx === breadcrumb.length - 1 ? 'active' : ''}`}
              onClick={() => {
                if (idx < breadcrumb.length - 1) {
                  drillUp(item.layer as MapLayer)
                }
              }}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
