import { Router, Response } from 'express'
import { orchestrator } from '../agents/orchestrator'
import { chatAgent } from '../agents/chatAgent'
import { plannerAgent } from '../agents/plannerAgent'
import { storyAgent } from '../agents/storyAgent'
import { visionAgent } from '../agents/visionAgent'
import { locationAgent } from '../agents/locationAgent'
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

/**
 * 与小旅旅行助手进行多轮对话
 */
router.post('/chat', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, history } = req.body
    if (!message) {
      return res.status(400).json({ error: 'message 不能为空' })
    }

    const reply = await chatAgent.chat({
      userMessage: message,
      history,
      userStats: {
        visitedRegionsCount: 22,
        name: req.user?.name || '旅行者'
      }
    })

    res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString()
      }
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * 智能旅行路线规划
 */
router.post('/itinerary', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { destination, days, style } = req.body
    if (!destination) {
      return res.status(400).json({ error: 'destination 不能为空' })
    }

    const plan = await plannerAgent.generateItinerary({
      destination,
      days: Number(days) || 3,
      style
    })

    res.json({
      success: true,
      data: plan
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * 单独触发多智能体图片分析与游记日记生成流水线
 */
router.post('/process-memory', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageUrl, lat, lng, hintText, camera } = req.body
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl 不能为空' })
    }

    const result = await orchestrator.processMemoryPipeline({
      imageUrl,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      hintText,
      camera
    })

    res.json({
      success: true,
      data: result
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
