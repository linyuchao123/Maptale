import { Router, Response } from 'express'
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

/**
 * 获取当前用户的足迹全局统计数据
 */
router.get('/stats', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      name: req.user?.name || '旅行者小林',
      level: 15,
      levelName: '探索家',
      avatar: '🧑‍🦱',
      visitedCountries: 10,
      visitedRegions: 22,
      totalMemories: 277,
      totalDays: 118,
      chinaExplorePercent: 65,
    }
  })
})

/**
 * 获取用户走过的省份列表
 */
router.get('/visited', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'yunnan', name: '云南', emoji: '🌸', memoriesCount: 142, daysSpent: 28 },
      { id: 'sichuan', name: '四川', emoji: '🐼', memoriesCount: 88, daysSpent: 12 },
      { id: 'beijing', name: '北京', emoji: '🏯', memoriesCount: 67, daysSpent: 5 },
      { id: 'xizang', name: '西藏', emoji: '🏔️', memoriesCount: 55, daysSpent: 8 },
      { id: 'zhejiang', name: '浙江', emoji: '🌿', memoriesCount: 44, daysSpent: 5 },
      { id: 'guangdong', name: '广东', emoji: '🌆', memoriesCount: 39, daysSpent: 6 },
    ]
  })
})

export default router
