import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET || 'maptale_super_secret_jwt_key_2026'

    try {
      const decoded = jwt.verify(token, secret) as { id: string; email: string; name: string }
      req.user = decoded
      return next()
    } catch (err) {
      console.warn('[Auth] Token 验证失败:', (err as Error).message)
    }
  }

  // 开发阶段与体验模式：自动注入演示用户，无需强制登录打断体验
  req.user = {
    id: 'user-demo-xiaolin',
    email: 'traveler@maptale.com',
    name: '旅行者小林'
  }
  next()
}
