import { motion } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import { CHINA_REGIONS } from '@/data/travelData'

// 省份椭圆位置（归一化坐标 0~1）
const PROVINCE_POSITIONS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  yunnan:    { cx: 0.30, cy: 0.65, rx: 0.08, ry: 0.06 },
  sichuan:   { cx: 0.33, cy: 0.55, rx: 0.07, ry: 0.06 },
  beijing:   { cx: 0.55, cy: 0.28, rx: 0.035, ry: 0.035 },
  tibet:     { cx: 0.18, cy: 0.52, rx: 0.09, ry: 0.08 },
  guangdong: { cx: 0.50, cy: 0.73, rx: 0.06, ry: 0.04 },
  zhejiang:  { cx: 0.61, cy: 0.57, rx: 0.04, ry: 0.035 },
  hunan:     { cx: 0.49, cy: 0.61, rx: 0.05, ry: 0.05 },
  shanxi:    { cx: 0.45, cy: 0.46, rx: 0.05, ry: 0.05 },
  shanghai:  { cx: 0.63, cy: 0.52, rx: 0.028, ry: 0.028 },
  guangxi:   { cx: 0.43, cy: 0.70, rx: 0.06, ry: 0.05 },
  chongqing: { cx: 0.40, cy: 0.60, rx: 0.035, ry: 0.03 },
  jiangsu:   { cx: 0.59, cy: 0.50, rx: 0.04, ry: 0.04 },
  shandong:  { cx: 0.57, cy: 0.42, rx: 0.05, ry: 0.04 },
  anhui:     { cx: 0.55, cy: 0.52, rx: 0.04, ry: 0.04 },
  liaoning:  { cx: 0.60, cy: 0.30, rx: 0.05, ry: 0.04 },
  hainan:    { cx: 0.48, cy: 0.80, rx: 0.025, ry: 0.025 },
  // 未访问省份
  xinjiang:  { cx: 0.14, cy: 0.33, rx: 0.12, ry: 0.10 },
  neimenggu: { cx: 0.42, cy: 0.25, rx: 0.14, ry: 0.08 },
  heilongjiang: { cx: 0.63, cy: 0.15, rx: 0.09, ry: 0.07 },
  jilin:     { cx: 0.64, cy: 0.23, rx: 0.06, ry: 0.04 },
  hebei:     { cx: 0.52, cy: 0.33, rx: 0.05, ry: 0.04 },
  shanxi2:   { cx: 0.47, cy: 0.38, rx: 0.04, ry: 0.04 },
  henan:     { cx: 0.50, cy: 0.47, rx: 0.05, ry: 0.04 },
  hubei:     { cx: 0.49, cy: 0.55, rx: 0.05, ry: 0.04 },
  gansu:     { cx: 0.30, cy: 0.40, rx: 0.08, ry: 0.05 },
  qinghai:   { cx: 0.24, cy: 0.45, rx: 0.08, ry: 0.06 },
  guizhou:   { cx: 0.41, cy: 0.63, rx: 0.05, ry: 0.04 },
  fujian:    { cx: 0.58, cy: 0.64, rx: 0.04, ry: 0.04 },
  jiangxi:   { cx: 0.55, cy: 0.60, rx: 0.04, ry: 0.04 },
  ningxia:   { cx: 0.39, cy: 0.40, rx: 0.03, ry: 0.03 },
  tianjin:   { cx: 0.55, cy: 0.31, rx: 0.025, ry: 0.025 },
}

const UNVISITED = [
  { id: 'xinjiang',     name: '新疆',  emoji: '🐪' },
  { id: 'neimenggu',    name: '内蒙古', emoji: '🐎' },
  { id: 'heilongjiang', name: '黑龙江', emoji: '❄️' },
  { id: 'jilin',        name: '吉林',  emoji: '🎋' },
  { id: 'hebei',        name: '河北',  emoji: '🌾' },
  { id: 'shanxi2',      name: '山西',  emoji: '🏛️' },
  { id: 'henan',        name: '河南',  emoji: '🏺' },
  { id: 'hubei',        name: '湖北',  emoji: '🌉' },
  { id: 'gansu',        name: '甘肃',  emoji: '🐫' },
  { id: 'qinghai',      name: '青海',  emoji: '🦙' },
  { id: 'guizhou',      name: '贵州',  emoji: '🌊' },
  { id: 'fujian',       name: '福建',  emoji: '🍵' },
  { id: 'jiangxi',      name: '江西',  emoji: '🏯' },
  { id: 'ningxia',      name: '宁夏',  emoji: '🌙' },
  { id: 'tianjin',      name: '天津',  emoji: '🚀' },
]

export function ChinaMapView() {
  const { drillDown, selectedCountry } = useMapStore()

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* 背景光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl" />
      </div>

      {/* 国家信息卡（左下） */}
      <motion.div
        className="glass-card absolute bottom-8 left-8 p-5 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{selectedCountry?.flag}</span>
          <div>
            <h3 className="font-bold text-gray-700 text-lg">{selectedCountry?.name}</h3>
            <p className="text-xs text-gray-400">China Stats</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-pink-50 rounded-xl p-2.5 text-center">
            <p className="text-xl font-bold text-pink-500">{selectedCountry?.visitedRegions}</p>
            <p className="text-[10px] text-gray-400">已访问省份</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-2.5 text-center">
            <p className="text-xl font-bold text-purple-500">{selectedCountry?.totalRegions}</p>
            <p className="text-[10px] text-gray-400">总省份数</p>
          </div>
          <div className="bg-sky-50 rounded-xl p-2.5 text-center col-span-2">
            <p className="text-xl font-bold text-sky-500">{selectedCountry?.memoriesCount}</p>
            <p className="text-[10px] text-gray-400">旅行记忆总数</p>
          </div>
        </div>
      </motion.div>

      {/* 右侧 Top 省份排行 */}
      <motion.div
        className="glass-card absolute top-8 right-8 p-4 w-52"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">✨ 最多记忆</p>
        <div className="flex flex-col gap-2">
          {CHINA_REGIONS.slice(0, 5).map((r, i) => (
            <button
              key={r.id}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 transition-all duration-200 text-left"
              onClick={() => drillDown('region', r)}
            >
              <span className="text-sm font-bold text-purple-300 w-4">{i + 1}</span>
              <span className="text-lg">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{r.name}</p>
                <p className="text-[10px] text-gray-400">{r.memoriesCount} 个记忆</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* SVG 地图主体 */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full max-w-4xl max-h-[70vh]"
        style={{ filter: 'drop-shadow(0 20px 60px rgba(196,181,253,0.3))' }}
      >
        {/* 已访问省份 */}
        {CHINA_REGIONS.map((region, i) => {
          const pos = PROVINCE_POSITIONS[region.id]
          if (!pos) return null
          const cx = pos.cx * 800
          const cy = pos.cy * 600
          const rx = pos.rx * 800
          const ry = pos.ry * 600

          return (
            <g key={region.id}>
              {/* 发光底圆 */}
              <ellipse
                cx={cx} cy={cy} rx={rx * 1.8} ry={ry * 1.8}
                fill="url(#coralGlow)"
                opacity={0.4}
              />
              {/* 主体 */}
              <ellipse
                cx={cx} cy={cy} rx={rx} ry={ry}
                fill="url(#coralFill)"
                stroke="#f9a8d4"
                strokeWidth={1.5}
                className="cursor-pointer transition-all duration-300"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(249,168,212,0.5))' }}
                onClick={() => drillDown('region', region)}
              >
                <animate
                  attributeName="ry"
                  values={`${ry};${ry * 1.04};${ry}`}
                  dur={`${3 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </ellipse>
              {/* 省份名称 */}
              <text
                x={cx} y={cy + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={Math.max(9, rx * 0.18)}
                fontWeight="600"
                fill="#7c3aed"
                className="pointer-events-none select-none"
              >
                {region.name}
              </text>
              {/* 发光点 */}
              <circle cx={cx} cy={cy - ry - 5} r={3} fill="#f9a8d4">
                <animate
                  attributeName="r"
                  values="2;4;2"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )
        })}

        {/* 未访问省份 */}
        {UNVISITED.map((province) => {
          const pos = PROVINCE_POSITIONS[province.id]
          if (!pos) return null
          const cx = pos.cx * 800
          const cy = pos.cy * 600
          const rx = pos.rx * 800
          const ry = pos.ry * 600

          return (
            <g key={province.id} opacity={0.5}>
              <ellipse
                cx={cx} cy={cy} rx={rx} ry={ry}
                fill="rgba(200,200,220,0.15)"
                stroke="rgba(196,181,253,0.25)"
                strokeWidth={1}
              />
              <text
                x={cx} y={cy}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={Math.max(8, rx * 0.14)}
                fill="rgba(150,150,180,0.7)"
                className="pointer-events-none select-none"
              >
                {province.name}
              </text>
            </g>
          )
        })}

        {/* SVG 渐变定义 */}
        <defs>
          <radialGradient id="coralGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#f9a8d4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f9a8d4" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="coralFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce7f3" />
            <stop offset="100%" stopColor="#ede9fe" />
          </linearGradient>
        </defs>
      </svg>

      {/* 底部提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-card px-5 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-gray-400">🌸 点击发光省份，查看你的旅行回忆</p>
      </motion.div>
    </motion.div>
  )
}
