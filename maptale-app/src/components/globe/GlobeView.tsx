import { useCallback, useEffect, useRef } from 'react'
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

export function GlobeView() {
  const canvasRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const { drillDown, visitedCountries } = useMapStore()

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
    // 使用 GeoJSON 数据（从 CDN 加载）
    const geoRes = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    if (geoRes.ok) {
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

      {/* Globe 容器 */}
      <div ref={canvasRef} className="w-full h-full" />

      {/* 浮动国家信息提示（右侧） */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {Object.values(COUNTRIES_DATA).slice(0, 5).map((country, i) => (
          <motion.button
            key={country.code}
            className="glass-card p-3 flex items-center gap-2 text-left hover:shadow-mt-card-hover transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            onClick={() => drillDown('country', country)}
            whileHover={{ scale: 1.03, x: -4 }}
          >
            <span className="text-2xl">{country.flag}</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">{country.name}</p>
              <p className="text-[10px] text-gray-400">{country.memoriesCount} 个记忆</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 底部提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-card px-5 py-2.5 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-gray-500">
          🌍 点击地球上的国家，进入你的旅行记忆
        </p>
      </motion.div>

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
