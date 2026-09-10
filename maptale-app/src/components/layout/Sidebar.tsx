import { USER_STATS } from '@/data/travelData'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`flex flex-col gap-4 w-52 flex-shrink-0 ${className}`}>
      {/* 用户信息卡 */}
      <div className="glass-card p-5 flex flex-col items-center gap-3">
        {/* 头像 */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl
                       bg-gradient-to-br from-pink-200 to-purple-200
                       shadow-mt-glow-coral cursor-pointer
                       transition-transform duration-300 hover:scale-110"
          >
            {USER_STATS.avatar}
          </div>
          {/* 等级徽章 */}
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Lv.{USER_STATS.level}
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700 text-sm">{USER_STATS.name}</p>
          <p className="text-xs text-purple-400 mt-0.5">✨ {USER_STATS.levelName}</p>
        </div>
      </div>

      {/* 统计数字 */}
      <div className="glass-card p-4">
        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">我的足迹</p>
        <div className="grid grid-cols-2 gap-2">
          <StatBadge num={USER_STATS.visitedCountries} label="走过国家" color="text-purple-500" />
          <StatBadge num={USER_STATS.visitedRegions} label="走过省份" color="text-pink-500" />
          <StatBadge num={USER_STATS.totalMemories} label="旅行记忆" color="text-sky-500" />
          <StatBadge num={USER_STATS.totalDays} label="旅行天数" color="text-amber-500" />
        </div>
      </div>

      {/* 中国探索进度 */}
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-500 font-medium">🇨🇳 中国探索进度</p>
          <p className="text-lg font-bold text-amber-500">{USER_STATS.chinaExplorePercent}%</p>
        </div>
        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-1000"
            style={{ width: `${USER_STATS.chinaExplorePercent}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">已拼凑 {USER_STATS.visitedRegions}/34 块省份拼图</p>
      </div>

      {/* 导航菜单 */}
      <div className="glass-card p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600
                       hover:bg-purple-50 hover:text-purple-600 transition-all duration-200
                       text-left font-medium"
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  )
}

function StatBadge({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <div className="bg-white/60 rounded-2xl p-2.5 text-center">
      <p className={`text-xl font-bold ${color}`}>{num}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

const NAV_ITEMS = [
  { icon: '🌍', label: '我的地图' },
  { icon: '👥', label: '发现社区' },
  { icon: '🤖', label: 'AI 旅行助手' },
  { icon: '📷', label: '旅行相册' },
  { icon: '📅', label: '旅行计划' },
  { icon: '⭐', label: '愿望清单' },
]
