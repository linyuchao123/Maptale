import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMapStore, type MainTab } from '@/store/mapStore'
import { USER_STATS } from '@/data/travelData'

const NAV_ITEMS: Array<{ icon: string; label: string; tab: MainTab }> = [
  { icon: '🌍', label: '我的地图',   tab: 'map' },
  { icon: '👥', label: '发现社区',  tab: 'community' },
  { icon: '🤖', label: 'AI 规划大厅', tab: 'assistant' },
  { icon: '📷', label: '旅行相册',  tab: 'album' },
  { icon: '📅', label: '旅行计划',  tab: 'plan' },
  { icon: '⭐', label: '愿望清单',  tab: 'wishlist' },
]

export function Sidebar() {
  const { layer, activeTab, setActiveTab } = useMapStore()

  return (
    <aside className="flex flex-col gap-3 w-[200px] flex-shrink-0 h-full overflow-y-auto pr-0.5">

      {/* ── Logo ── */}
      <motion.div
        className="flex items-center gap-2 px-2 pt-1 pb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400
                        flex items-center justify-center text-base shadow-md">
          🗺️
        </div>
        <span className="font-bold text-gray-700 text-base tracking-tight">Maptale</span>
      </motion.div>

      {/* ── 用户信息卡 ── */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          {/* 头像 */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200
                            flex items-center justify-center text-xl
                            ring-2 ring-white shadow-md">
              {USER_STATS.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-400 to-pink-400
                            text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              {USER_STATS.level}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-700 text-sm leading-tight truncate">
              {USER_STATS.name}
            </p>
            <p className="text-[11px] text-purple-400 mt-0.5">✨ {USER_STATS.levelName}</p>
          </div>
        </div>
      </motion.div>

      {/* ── 足迹统计 ── */}
      <motion.div
        className="glass-card p-3.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2.5">
          🌏 我的足迹
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { num: USER_STATS.visitedCountries, label: '国家', color: 'from-violet-400 to-purple-400', icon: '🗺️' },
            { num: USER_STATS.visitedRegions,   label: '省份', color: 'from-pink-400 to-rose-400',    icon: '📍' },
            { num: USER_STATS.totalMemories,    label: '记忆', color: 'from-sky-400 to-blue-400',     icon: '📷' },
            { num: USER_STATS.totalDays,        label: '天数', color: 'from-amber-400 to-orange-400', icon: '☀️' },
          ].map((s) => (
            <div key={s.label}
              className="relative overflow-hidden bg-white/50 rounded-xl p-2.5 text-center group hover:bg-white/70 transition-colors cursor-default">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <p className={`text-lg font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.num}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.icon} {s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 中国拼图进度 ── */}
      <motion.div
        className="glass-card p-3.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-gray-500 font-medium">🇨🇳 中国拼图</span>
          <span className="text-sm font-bold text-amber-500">{USER_STATS.chinaExplorePercent}%</span>
        </div>
        <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${USER_STATS.chinaExplorePercent}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          {USER_STATS.visitedRegions} / 34 个省份已解锁
        </p>
      </motion.div>

      {/* ── 导航菜单 ── */}
      <motion.div
        className="glass-card p-2 flex flex-col gap-0.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {NAV_ITEMS.map((item, i) => {
          const isActive = activeTab === item.tab
          return (
            <motion.button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200 text-left w-full overflow-hidden
                          ${isActive
                            ? 'text-purple-700'
                            : 'text-gray-500 hover:text-purple-500 hover:bg-purple-50/60'
                          }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              whileHover={{ x: 2 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-gradient-to-r from-purple-100/80 to-pink-50/60 rounded-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5
                                bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
              )}
              <span className="relative text-base">{item.icon}</span>
              <span className="relative text-[13px]">{item.label}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* ── 层级状态提示 ── */}
      {layer !== 'globe' && (
        <motion.div
          className="glass-card p-3 border border-purple-200/40"
          style={{ background: 'linear-gradient(135deg, rgba(196,181,253,0.12), rgba(249,168,212,0.08))' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-[10px] text-purple-400 font-medium mb-1">当前探索</p>
          <p className="text-xs text-gray-600 font-semibold">
            {layer === 'country' && '🇨🇳 中国 · 省份地图'}
            {layer === 'region' && '🌸 云南省 · 景点详情'}
            {layer === 'attraction' && '📍 景点 · 旅行回忆'}
          </p>
        </motion.div>
      )}
    </aside>
  )
}
