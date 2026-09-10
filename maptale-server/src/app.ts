import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import aiRoutes from './routes/ai'
import memoriesRoutes from './routes/memories'
import regionsRoutes from './routes/regions'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: true, credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ extended: true, limit: '30mb' }))

// API 路由挂载
app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/memories', memoriesRoutes)
app.use('/api/regions', regionsRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Maptale Multi-Agent Backend',
    time: new Date().toISOString(),
    agents: ['orchestrator', 'vision', 'location', 'story', 'chat', 'planner']
  })
})

app.listen(PORT, () => {
  console.log(`\n✨ ===================================================`)
  console.log(`🧭 Maptale 多智能体后端服务已成功启动！`)
  console.log(`🚀 服务端口: http://localhost:${PORT}`)
  console.log(`🧠 7大协同智能体就绪: Orchestrator, Vision, Location, Story, Chat, Planner`)
  console.log(`====================================================\n`)
})

export default app
