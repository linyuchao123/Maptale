import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMapStore } from '@/store/mapStore'
import { COUNTRIES_DATA } from '@/data/travelData'

// 飞行的小飞机轨迹数据
const FLIGHT_PATHS = [
  { startLat: 39.9, startLng: 116.4, endLat: 35.7, endLng: 139.7 }, // 北京→东京
  { startLat: 31.2, startLng: 121.5, endLat: 48.9, endLng:   2.3 }, // 上海→巴黎
  { startLat: 22.3, startLng: 114.2, endLat: 33.9, endLng: -118.4 }, // 香港→洛杉矶
  { startLat: 39.9, startLng: 116.4, endLat: -33.9, endLng: 151.2 }, // 北京→悉尼
  { startLat: 31.2, startLng: 121.5, endLat:  1.4, endLng: 103.8 }, // 上海→新加坡
]

// 已访问国家的记忆点（爱心标注）
const MEMORY_POINTS = [
  { lat: 35.6, lng: 139.7, label: '东京', emoji: '🗼', color: '#f9a8d4' },
  { lat: 13.8, lng: 100.5, label: '曼谷', emoji: '🛕', color: '#a7f3d0' },
  { lat: 48.9, lng:   2.3, label: '巴黎', emoji: '🗼', color: '#fde68a' },
  { lat: 41.9, lng:  12.5, label: '罗马', emoji: '🏛️', color: '#c4b5fd' },
  { lat: 37.6, lng: 127.0, label: '首尔', emoji: '🇰🇷', color: '#f9a8d4' },
  { lat:  1.4, lng: 103.8, label: '新加坡', emoji: '🦁', color: '#a7f3d0' },
]

// 国家卡片彩色竖条颜色
const CARD_ACCENT_COLORS = [
  'linear-gradient(180deg, #f9a8d4, #f472b6)',
  'linear-gradient(180deg, #c4b5fd, #a78bfa)',
  'linear-gradient(180deg, #6ee7b7, #34d399)',
  'linear-gradient(180deg, #fde68a, #fbbf24)',
  'linear-gradient(180deg, #93c5fd, #60a5fa)',
]

// 6 个绕轨光点配置
const ORBIT_DOTS = [
  { radius: 240, angle: 0,   size: 8,  color: '#f9a8d4', blur: 6,  duration: 7 },
  { radius: 260, angle: 60,  size: 6,  color: '#c4b5fd', blur: 5,  duration: 9 },
  { radius: 250, angle: 120, size: 10, color: '#fde68a', blur: 8,  duration: 11 },
  { radius: 245, angle: 180, size: 7,  color: '#a7f3d0', blur: 6,  duration: 8 },
  { radius: 255, angle: 240, size: 5,  color: '#93c5fd', blur: 4,  duration: 10 },
  { radius: 248, angle: 300, size: 9,  color: '#f9a8d4', blur: 7,  duration: 6 },
]

export function GlobeView() {
  const canvasRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const { drillDown, visitedCountries } = useMapStore()
  const [isLoading, setIsLoading] = useState(true)

  const initGlobe = useCallback(async () => {
    if (!canvasRef.current || globeRef.current) return

    // 动态导入 globe.gl
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const GlobeGL = (await import('globe.gl')) as any
    const GlobeFn = GlobeGL.default || GlobeGL

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe: any = GlobeFn()(canvasRef.current)

    // ── 基础外观配置 ──
    globe
      .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
      .atmosphereColor('#c4b5fd')       // 薰衣草紫大气层
      .atmosphereAltitude(0.18)
      .backgroundColor('rgba(0,0,0,0)') // 透明背景，用CSS控制
      .width(canvasRef.current.clientWidth)
      .height(canvasRef.current.clientHeight)

    // ── 已访问国家高亮（多边形层） ──
    const geoRes = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    if (geoRes.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const topoData = await geoRes.json()
      // 简化：用 label 层代替多边形层显示访问状态
    }

    // ── 记忆点标注（爱心图标） ──
    globe
      .labelsData(MEMORY_POINTS)
      .labelLat('lat')
      .labelLng('lng')
      .labelText('emoji')
      .labelSize(1.8)
      .labelColor(() => '#ffffff')
      .labelResolution(2)
      .labelAltitude(0.015)

    // ── 飞行轨迹（弧线） ──
    globe
      .arcsData(FLIGHT_PATHS)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['rgba(249,168,212,0.6)', 'rgba(196,181,253,0.6)'])
      .arcAltitude(0.25)
      .arcStroke(0.5)
      .arcDashLength(0.5)
      .arcDashGap(0.3)
      .arcDashAnimateTime(3000)

    // ── 点光源（记忆发光点） ──
    globe
      .pointsData(MEMORY_POINTS)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointRadius(0.5)
      .pointAltitude(0.01)

    // ── 自动慢速旋转 ──
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableZoom = true
    globe.controls().minDistance = 200
    globe.controls().maxDistance = 400

    // ── 初始视角（聚焦中国） ──
    globe.pointOfView({ lat: 30, lng: 105, altitude: 2.5 }, 0)

    // ── 点击事件 ──
    globe.onGlobeClick(({ lat, lng }: { lat: number; lng: number }) => {
      // 根据点击位置判断国家（简化逻辑，后续可接入 topojson 精确判断）
      const nearest = getNearestCountry(lat, lng)
      if (nearest && visitedCountries.has(nearest)) {
        const countryData = COUNTRIES_DATA[nearest]
        if (countryData) {
          drillDown('country', countryData)
        }
      }
    })

    globeRef.current = globe

    // Globe 初始化完成，关闭 loading
    setIsLoading(false)
  }, [drillDown, visitedCountries])

  useEffect(() => {
    initGlobe()

    const handleResize = () => {
      if (globeRef.current && canvasRef.current) {
        globeRef.current
          .width(canvasRef.current.clientWidth)
          .height(canvasRef.current.clientHeight)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      // 销毁 globe 实例
      if (globeRef.current) {
        globeRef.current._destructor?.()
        globeRef.current = null
      }
    }
  }, [initGlobe])

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 背景粒子光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/20 rounded-full blur-3xl" />
      </div>

      {/* ── Loading 画面 ── */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 50%, #ede9fe 100%)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 大圆形 loading 容器 */}
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            {/* 外层旋转圆圈 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '4px solid transparent',
                borderTopColor: '#f9a8d4',
                borderRightColor: '#c4b5fd',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            {/* 中间旋转圆圈（反向，略小） */}
            <motion.div
              className="absolute rounded-full"
              style={{
                inset: 14,
                border: '3px solid transparent',
                borderTopColor: '#c4b5fd',
                borderLeftColor: '#f9a8d4',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
            {/* 内圆背景 */}
            <div
              className="absolute rounded-full flex flex-col items-center justify-center"
              style={{
                inset: 28,
                background: 'linear-gradient(135deg, #fff0f8, #f3e8ff)',
                boxShadow: '0 0 30px rgba(196,181,253,0.4), 0 0 60px rgba(249,168,212,0.2)',
              }}
            >
              <span style={{ fontSize: 36 }}>🌍</span>
            </div>
          </div>
          {/* 文字 */}
          <motion.p
            className="mt-6 text-base font-semibold"
            style={{ color: '#a78bfa', letterSpacing: '0.05em' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            加载你的旅行地图...
          </motion.p>
          {/* 进度点 */}
          <div className="flex gap-2 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: 'linear-gradient(135deg, #f9a8d4, #c4b5fd)' }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Globe 容器 */}
      <div ref={canvasRef} className="w-full h-full" />

      {/* ── 6 个绕轨旋转光点 ── */}
      {!isLoading && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {ORBIT_DOTS.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: dot.size,
                height: dot.size,
                borderRadius: '50%',
                background: dot.color,
                boxShadow: `0 0 ${dot.blur * 2}px ${dot.blur}px ${dot.color}`,
                x: dot.radius * Math.cos((dot.angle * Math.PI) / 180),
                y: dot.radius * Math.sin((dot.angle * Math.PI) / 180),
                originX: `${-dot.radius * Math.cos((dot.angle * Math.PI) / 180) + dot.size / 2}px`,
                originY: `${-dot.radius * Math.sin((dot.angle * Math.PI) / 180) + dot.size / 2}px`,
              }}
              animate={{ rotateZ: [0, 360] }}
              transition={{
                duration: dot.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* ── 右侧国家卡片（升级版） ── */}
      {!isLoading && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {Object.values(COUNTRIES_DATA).slice(0, 5).map((country, i) => {
            const visited = country.memoriesCount ?? 0
            const total = 10
            const progress = Math.min((visited / total) * 100, 100)
            const accentColor = CARD_ACCENT_COLORS[i % CARD_ACCENT_COLORS.length]

            return (
              <motion.button
                key={country.code}
                className="glass-card flex items-stretch text-left cursor-pointer overflow-hidden"
                style={{ padding: 0 }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => drillDown('country', country)}
                whileHover={{
                  scale: 1.04,
                  x: -4,
                  boxShadow: '0 8px 32px rgba(196,181,253,0.45), 0 2px 12px rgba(249,168,212,0.35)',
                }}
              >
                {/* 彩色竖条 */}
                <div
                  style={{
                    width: 5,
                    flexShrink: 0,
                    background: accentColor,
                    borderRadius: '6px 0 0 6px',
                  }}
                />
                {/* 内容区 */}
                <div className="flex items-center gap-2 p-3 flex-1">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{country.name}</p>
                    <p className="text-[10px] text-gray-400 mb-1">{visited} 个记忆</p>
                    {/* 迷你进度条 */}
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: 4, background: 'rgba(196,181,253,0.2)' }}
                    >
                      <motion.div
                        style={{
                          height: '100%',
                          background: accentColor,
                          borderRadius: 9999,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* ── 视角快捷切换与自动旋转控制器 ── */}
      {!isLoading && (
        <motion.div
          className="absolute bottom-8 left-8 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* 视角预设胶囊 */}
          <div className="glass-card p-1.5 flex items-center gap-1">
            {[
              { label: '🇨🇳 聚焦中国', lat: 32, lng: 105, altitude: 2.0 },
              { label: '🌸 亚洲足迹', lat: 25, lng: 115, altitude: 2.6 },
              { label: '🗼 欧洲漫游', lat: 48, lng: 10,  altitude: 2.2 },
              { label: '🌐 全球宏观', lat: 20, lng: 0,   altitude: 3.2 },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  if (globeRef.current) {
                    globeRef.current.pointOfView(
                      { lat: preset.lat, lng: preset.lng, altitude: preset.altitude },
                      1400
                    )
                  }
                }}
                className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 hover:text-purple-600 hover:bg-white/80 transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* 自动旋转切换 */}
          <button
            onClick={() => {
              if (globeRef.current) {
                const current = globeRef.current.controls().autoRotate
                globeRef.current.controls().autoRotate = !current
              }
            }}
            className="glass-card w-8 h-8 rounded-full flex items-center justify-center text-xs text-purple-600 hover:bg-purple-50 transition-colors shadow-sm"
            title="切换地球自动旋转"
          >
            🔄
          </button>
        </motion.div>
      )}

      {/* ── 底部 hint 文字 ── */}
      {!isLoading && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-card px-5 py-2 text-center shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.p
            className="text-xs text-gray-500 font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌍 点击地球上的发光航迹与坐标点，开启你的专属时光机
          </motion.p>
        </motion.div>
      )}

      {/* 浮动花瓣装饰 */}
      {['🌸', '⭐', '✨', '🌟', '💫'].map((petal, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none text-lg select-none"
          style={{
            top: `${15 + i * 15}%`,
            left: `${5 + i * 4}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        >
          {petal}
        </motion.span>
      ))}
    </motion.div>
  )
}

// 简化的国家判断（根据经纬度范围）
function getNearestCountry(lat: number, lng: number): string | null {
  const countryBounds: Array<[string, number, number, number, number]> = [
    ['CN',  18, 135, 54,  73],   // 中国
    ['JP',  24, 146, 46, 122],   // 日本
    ['TH',   5, 105, 21,  97],   // 泰国
    ['FR',  42,  10, 51,  -5],   // 法国
    ['IT',  36,  18, 47,   6],   // 意大利
    ['KR',  33, 130, 38, 125],   // 韩国
    ['SG',   1, 104,  2, 103],   // 新加坡
    ['US',  24, -66, 50, -125],  // 美国
    ['AU', -44, 154, -10, 113],  // 澳大利亚
    ['MY',   1, 119,  7, 100],   // 马来西亚
  ]

  for (const [code, maxLat, maxLng, minLat, minLng] of countryBounds) {
    if (lat <= maxLat && lat >= minLat && lng <= maxLng && lng >= minLng) {
      return code
    }
  }
  return null
}
