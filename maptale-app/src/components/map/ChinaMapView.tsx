import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import { CHINA_REGIONS } from '@/data/travelData'
import type { RegionInfo } from '@/store/mapStore'

// 用真实省份 SVG 路径数据（简化版，保留轮廓特征）
// 坐标系：600×500 视口
const PROVINCE_PATHS: Record<string, { path: string; cx: number; cy: number }> = {
  xinjiang:     { cx: 150, cy: 155, path: 'M60,80 L80,60 L130,55 L180,70 L210,90 L230,130 L240,180 L220,220 L190,240 L150,250 L110,240 L80,210 L60,170 L50,130 Z' },
  xizang:       { cx: 175, cy: 290, path: 'M100,250 L150,240 L200,250 L240,260 L260,290 L250,330 L230,350 L180,360 L140,350 L110,330 L90,300 Z' },
  qinghai:      { cx: 238, cy: 235, path: 'M190,200 L240,195 L280,205 L300,225 L295,255 L265,270 L230,270 L200,255 L185,230 Z' },
  gansu:        { cx: 280, cy: 185, path: 'M240,150 L270,140 L310,145 L330,160 L340,185 L325,210 L295,220 L265,215 L245,195 L235,170 Z' },
  sichuan:      { cx: 298, cy: 302, path: 'M255,270 L295,265 L330,275 L345,300 L340,330 L315,345 L280,345 L255,330 L245,305 Z' },
  yunnan:       { cx: 290, cy: 375, path: 'M250,345 L290,340 L325,350 L335,375 L325,405 L295,415 L265,408 L248,385 Z' },
  guizhou:      { cx: 338, cy: 355, path: 'M315,335 L345,330 L365,342 L368,365 L350,378 L325,375 L310,360 Z' },
  guangxi:      { cx: 355, cy: 398, path: 'M325,375 L360,370 L390,380 L400,405 L388,428 L358,432 L330,420 L320,400 Z' },
  guangdong:    { cx: 400, cy: 398, path: 'M375,375 L415,372 L440,383 L448,405 L435,425 L405,430 L380,420 L370,400 Z' },
  hainan:       { cx: 392, cy: 448, path: 'M378,438 L400,435 L415,445 L413,460 L395,465 L378,458 Z' },
  hunan:        { cx: 375, cy: 335, path: 'M350,312 L385,308 L408,320 L412,345 L398,368 L368,372 L348,358 L340,335 Z' },
  jiangxi:      { cx: 415, cy: 340, path: 'M393,318 L425,315 L445,328 L447,352 L432,370 L408,372 L390,357 L385,335 Z' },
  fujian:       { cx: 450, cy: 345, path: 'M430,322 L458,320 L475,333 L474,358 L458,370 L438,367 L425,350 Z' },
  zhejiang:     { cx: 455, cy: 310, path: 'M432,293 L462,290 L480,302 L480,322 L462,332 L438,328 L425,312 Z' },
  jiangsu:      { cx: 447, cy: 272, path: 'M422,258 L458,255 L475,268 L473,288 L452,295 L428,290 L415,275 Z' },
  shanghai:     { cx: 477, cy: 290, path: 'M470,283 L482,282 L487,290 L484,298 L472,299 L468,291 Z' },
  anhui:        { cx: 430, cy: 290, path: 'M408,270 L438,268 L455,280 L453,305 L434,313 L410,308 L398,292 Z' },
  hubei:        { cx: 385, cy: 295, path: 'M358,275 L393,272 L412,285 L410,310 L390,318 L362,315 L345,298 Z' },
  henan:        { cx: 395, cy: 258, path: 'M368,240 L405,237 L425,250 L422,272 L400,280 L372,276 L355,260 Z' },
  shanxi:       { cx: 385, cy: 215, path: 'M365,195 L398,192 L414,208 L410,233 L387,240 L363,235 L350,217 Z' },
  shaanxi:      { cx: 352, cy: 233, path: 'M330,210 L360,207 L377,222 L373,248 L350,256 L328,250 L315,232 Z' },
  ningxia:      { cx: 348, cy: 193, path: 'M334,181 L355,180 L363,192 L358,208 L341,211 L330,200 Z' },
  neimenggu:    { cx: 370, cy: 130, path: 'M210,90 L280,78 L350,82 L420,95 L465,115 L475,145 L445,165 L395,170 L340,162 L285,155 L240,150 L210,130 Z' },
  beijing:      { cx: 432, cy: 175, path: 'M420,167 L438,165 L445,175 L442,187 L427,189 L418,179 Z' },
  tianjin:      { cx: 443, cy: 188, path: 'M436,182 L447,182 L451,192 L445,199 L436,197 L431,188 Z' },
  hebei:        { cx: 420, cy: 200, path: 'M393,178 L428,172 L450,182 L458,205 L445,225 L415,230 L390,220 L378,200 Z' },
  shandong:     { cx: 443, cy: 235, path: 'M415,220 L455,218 L475,230 L472,255 L448,262 L420,257 L406,240 Z' },
  liaoning:     { cx: 452, cy: 148, path: 'M422,133 L460,128 L483,140 L482,162 L460,170 L430,168 L415,152 Z' },
  jilin:        { cx: 483, cy: 122, path: 'M458,110 L493,107 L512,120 L508,140 L484,147 L458,143 L445,128 Z' },
  heilongjiang: { cx: 502, cy: 85,  path: 'M462,58 L508,50 L545,65 L550,95 L530,115 L498,122 L466,115 L448,90 Z' },
  chongqing:    { cx: 330, cy: 315, path: 'M315,300 L338,297 L350,310 L345,328 L326,333 L312,322 Z' },
}

// 已访问省份的颜色方案
const VISITED_COLORS = [
  '#f9a8d4', '#c4b5fd', '#a7f3d0', '#fde68a', '#bae6fd',
  '#fca5a5', '#d8b4fe', '#6ee7b7', '#fcd34d', '#93c5fd',
]

interface HoveredProvince { id: string; name: string; x: number; y: number }

export function ChinaMapView() {
  const { drillDown, selectedCountry, visitedRegions } = useMapStore()
  const [hovered, setHovered] = useState<HoveredProvince | null>(null)

  const visitedIds = new Set(visitedRegions)
  const visitedList = CHINA_REGIONS.filter(r => visitedIds.has(r.id))

  return (
    <motion.div
      className="relative w-full h-full flex gap-4 p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ── 左侧信息面板 ── */}
      <div className="flex flex-col gap-3 w-52 flex-shrink-0">

        {/* 国家统计 */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedCountry?.flag}</span>
            <div>
              <h3 className="font-bold text-gray-700 text-base">{selectedCountry?.name}</h3>
              <p className="text-[10px] text-gray-400">China · 34 个省级行政区</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: '已访问省份', value: `${selectedCountry?.visitedRegions} / ${selectedCountry?.totalRegions}`, color: 'text-pink-500', pct: ((selectedCountry?.visitedRegions || 0) / (selectedCountry?.totalRegions || 34)) },
              { label: '旅行记忆总数', value: `${selectedCountry?.memoriesCount} 张`, color: 'text-purple-500', pct: null },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-gray-400">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
                {s.pct !== null && (
                  <div className="h-1 bg-pink-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct * 100}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 已访问省份列表 */}
        <motion.div
          className="glass-card p-3 flex-1 overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
            ✨ 走过的省份
          </p>
          <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5">
            {visitedList.sort((a, b) => b.memoriesCount - a.memoriesCount).map((r, i) => (
              <motion.button
                key={r.id}
                onClick={() => drillDown('region', r)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50/70
                           transition-all duration-200 text-left group w-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                whileHover={{ x: 3 }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: VISITED_COLORS[i % VISITED_COLORS.length] }}
                />
                <span className="text-base">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate group-hover:text-purple-600 transition-colors">
                    {r.name}
                  </p>
                  <p className="text-[9px] text-gray-400">{r.memoriesCount} 个记忆</p>
                </div>
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors text-xs">›</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── 中央 SVG 地图 ── */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">

        {/* 背景光晕 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-100/25 rounded-full blur-3xl" />
        </div>

        <svg
          viewBox="0 0 600 500"
          className="w-full h-full"
          style={{ maxHeight: '92%', filter: 'drop-shadow(0 20px 60px rgba(196,181,253,0.25))' }}
        >
          <defs>
            {/* 渐变定义 */}
            <linearGradient id="visitedGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#ede9fe" />
            </linearGradient>
            <linearGradient id="visitedGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#c4b5fd" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 未访问省份（先渲染，在底层） */}
          {Object.entries(PROVINCE_PATHS).map(([id, data]) => {
            if (visitedIds.has(id)) return null
            return (
              <path
                key={id}
                d={data.path}
                fill="rgba(220,215,235,0.2)"
                stroke="rgba(196,181,253,0.25)"
                strokeWidth={0.8}
              />
            )
          })}

          {/* 已访问省份（上层，有交互） */}
          {CHINA_REGIONS.map((region, i) => {
            const pos = PROVINCE_PATHS[region.id]
            if (!pos) return null
            const color = VISITED_COLORS[i % VISITED_COLORS.length]
            const isHovered = hovered?.id === region.id

            return (
              <g key={region.id}>
                {/* 发光底色 */}
                <path
                  d={pos.path}
                  fill={color}
                  opacity={0.15}
                  transform={`scale(${isHovered ? 1.03 : 1.0})`}
                  style={{ transformOrigin: `${pos.cx}px ${pos.cy}px`, transition: 'all 0.2s' }}
                />
                {/* 主体 */}
                <path
                  d={pos.path}
                  fill={`url(#visitedGrad${(i % 2) + 1})`}
                  stroke={color}
                  strokeWidth={isHovered ? 2 : 1.5}
                  filter={isHovered ? 'url(#glow)' : 'url(#softShadow)'}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    transform: isHovered ? `scale(1.04)` : 'scale(1)',
                    transformOrigin: `${pos.cx}px ${pos.cy}px`,
                  }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect()
                    setHovered({ id: region.id, name: region.name, x: e.clientX - rect.left, y: e.clientY - rect.top })
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => drillDown('region', region)}
                />
                {/* 省份名 */}
                <text
                  x={pos.cx} y={pos.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#7c3aed"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {region.name}
                </text>
                {/* 记忆数脉冲点 */}
                <circle cx={pos.cx} cy={pos.cy - 14} r="3.5" fill={color} opacity="0.9">
                  <animate attributeName="r" values="2.5;4;2.5" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
              </g>
            )
          })}

          {/* Hover 提示气泡 */}
          {hovered && (() => {
            const region = CHINA_REGIONS.find(r => r.id === hovered.id)
            if (!region) return null
            const pos = PROVINCE_PATHS[hovered.id]
            return (
              <g>
                <rect
                  x={pos.cx - 38} y={pos.cy - 48}
                  width="76" height="30"
                  rx="8" fill="rgba(255,255,255,0.92)"
                  stroke="rgba(196,181,253,0.5)" strokeWidth="1"
                  filter="url(#softShadow)"
                />
                <text x={pos.cx} y={pos.cy - 38} textAnchor="middle" fontSize="8" fontWeight="600" fill="#7c3aed">
                  {region.emoji} {region.name}
                </text>
                <text x={pos.cx} y={pos.cy - 27} textAnchor="middle" fontSize="7" fill="#a78bfa">
                  {region.memoriesCount} 个记忆 · 点击进入
                </text>
              </g>
            )
          })()}
        </svg>

        {/* 底部提示 */}
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-card-sm px-4 py-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-gray-400">🌸 点击高亮省份，查看你的旅行回忆</p>
        </motion.div>
      </div>

      {/* ── 右侧 Top 省份 ── */}
      <motion.div
        className="glass-card p-3 w-44 flex-shrink-0 flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
          🏆 最多记忆
        </p>
        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          {visitedList.sort((a, b) => b.memoriesCount - a.memoriesCount).slice(0, 8).map((r, i) => (
            <motion.button
              key={r.id}
              className="flex items-center gap-2 text-left group hover:bg-purple-50/60 rounded-xl p-1.5 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              onClick={() => drillDown('region', r)}
            >
              <span className="text-[11px] font-bold text-purple-300 w-4 text-center">{i + 1}</span>
              <span className="text-base">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-gray-700 truncate group-hover:text-purple-600 transition-colors">
                  {r.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex-1 h-0.5 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"
                      style={{ width: `${Math.min(100, r.memoriesCount / 1.5)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 flex-shrink-0">{r.memoriesCount}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
