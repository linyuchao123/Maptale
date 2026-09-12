import { motion } from 'framer-motion'
import { useState } from 'react'

interface TravelerProfile {
  id: string
  name: string
  avatar: string
  level: string
  unlockedProvinces: number
  totalMemories: number
  motto: string
  featuredPhoto: string
  featuredTitle: string
  location: string
  likes: number
  isLiked?: boolean
  tags: string[]
}

const COMMUNITY_TRAVELERS: TravelerProfile[] = [
  {
    id: 't-1',
    name: '林深见鹿',
    avatar: '👩‍🌾',
    level: 'Lv.22 环球探索家',
    unlockedProvinces: 29,
    totalMemories: 432,
    motto: '把日子过成诗，把足迹走成画。',
    featuredPhoto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    featuredTitle: '香格里拉日照金山 · 愿所求皆如愿',
    location: '云南 · 迪庆藏族自治州',
    likes: 521,
    tags: ['雪山日落', '藏地秘境', '心灵归宿']
  },
  {
    id: 't-2',
    name: '阿泽的单反日记',
    avatar: '📷',
    level: 'Lv.18 视觉创作者',
    unlockedProvinces: 24,
    totalMemories: 310,
    motto: '用快门定格时间，用色彩收藏温度。',
    featuredPhoto: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
    featuredTitle: '清晨六点的洱海S湾晨雾与海鸥',
    location: '云南 · 大理白族自治州',
    likes: 438,
    tags: ['富士胶片', '洱海晨雾', '摄影机位']
  },
  {
    id: 't-3',
    name: '山野风信子',
    avatar: '🌿',
    level: 'Lv.16 徒步背包客',
    unlockedProvinces: 21,
    totalMemories: 265,
    motto: '山不见我，我自去看山。',
    featuredPhoto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    featuredTitle: '玉龙雪山 4680m 冰川下的微风与经幡',
    location: '云南 · 丽江市',
    likes: 389,
    tags: ['徒步西行', '高原反应治愈', '雪山之巅']
  }
]

export function CommunityView() {
  const [travelers, setTravelers] = useState<TravelerProfile[]>(COMMUNITY_TRAVELERS)

  const handleLike = (id: string) => {
    setTravelers(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          likes: t.isLiked ? t.likes - 1 : t.likes + 1,
          isLiked: !t.isLiked
        }
      }
      return t
    }))
  }

  return (
    <motion.div
      className="relative w-full h-full flex flex-col p-6 overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      {/* 顶部介绍 */}
      <div className="flex items-center justify-between pb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>👥</span>
            <span>发现社区 · 旅行者的人生地图</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            看看同行者们正在点亮哪一块拼图，发现独家宝藏路线与摄影灵感
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
            🔥 实时活跃：3,820 位拼图家
          </span>
        </div>
      </div>

      {/* 旅行家人生拼图卡片流 */}
      <div className="flex-1 overflow-y-auto pr-1 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {travelers.map((traveler, i) => (
          <motion.div
            key={traveler.id}
            className="glass-card p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            {/* 用户头卡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-xl shadow-xs">
                    {traveler.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{traveler.name}</h4>
                    <p className="text-[10px] text-purple-500 font-medium">{traveler.level}</p>
                  </div>
                </div>

                {/* 拼图徽章 */}
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-500">{traveler.unlockedProvinces}/34</span>
                  <p className="text-[9px] text-gray-400">省份拼图</p>
                </div>
              </div>

              {/* 格言 */}
              <p className="text-xs text-gray-500 italic font-light mb-3 line-clamp-1">
                “{traveler.motto}”
              </p>

              {/* 精选照片画报 */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-gray-100 mb-3 group-hover:shadow-md transition-all">
                <img
                  src={traveler.featuredPhoto}
                  alt={traveler.featuredTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <p className="text-xs font-bold leading-snug drop-shadow-xs">{traveler.featuredTitle}</p>
                  <p className="text-[10px] text-gray-200 mt-0.5">📍 {traveler.location}</p>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {traveler.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* 底部互动 */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleLike(traveler.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                  traveler.isLiked ? 'bg-pink-50 text-pink-500 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>{traveler.isLiked ? '❤️' : '🤍'}</span>
                <span>{traveler.likes}</span>
              </button>

              <button
                onClick={() => alert(`已收藏【${traveler.name}】的旅行地图与灵感机位！`)}
                className="px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium transition-colors"
              >
                🗺️ 借阅路线
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
