import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

/**
 * 登录 / 快速演示认证
 */
router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body
  const secret = process.env.JWT_SECRET || 'maptale_super_secret_jwt_key_2026'

  const user = {
    id: 'user-demo-xiaolin',
    email: email || 'traveler@maptale.com',
    name: '旅行者小林'
  }

  const token = jwt.sign(user, secret, { expiresIn: '30d' })

  res.json({
    success: true,
    data: {
      user,
      token
    }
  })
})

/**
 * 获取当前登录用户信息
 */
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: req.user
  })
})

export default router
