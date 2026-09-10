import { Router, Response } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth'
import { storageService } from '../services/oss'
import { exifService } from '../services/exif'
import { orchestrator } from '../agents/orchestrator'

const router = Router()
const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } }) // 20MB

// 内存中的初始记忆缓存（当未连接 Postgres 数据库时的热启动存储）
let inMemoryMemories: Array<any> = [
  {
    id: 'mem-1',
    userId: 'user-demo-xiaolin',
    title: '丽江古城屋檐与晚霞',
    location: '丽江 · 大研古镇木府旁',
    regionId: 'yunnan',
    countryCode: 'CN',
    date: '2023.05.14 18:45',
    imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=1000&auto=format&fit=crop',
    likes: 189,
    camera: 'Sony A7M4 · 35mm f/1.4 · ISO 200',
    mood: '🌸 温暖惬意',
    aiStory: '暮色轻染古镇灰瓦，小溪旁民谣吉他弹唱悠扬，灯笼一盏盏点亮，仿佛掉进了旧时光的梦境。',
    tags: ['古镇微风', '夕阳滤镜', '慢生活'],
    rotation: -1.8,
  },
  {
    id: 'mem-2',
    userId: 'user-demo-xiaolin',
    title: '洱海S湾晨雾日出',
    location: '大理 · 磻溪村S湾',
    regionId: 'yunnan',
    countryCode: 'CN',
    date: '2023.05.18 06:20',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
    likes: 245,
    camera: 'Fujifilm X-T5 · 23mm f/2.0 · ISO 160',
    mood: '✨ 宁静致远',
    aiStory: '清晨六点的洱海还没醒，薄雾笼罩在水面上，海鸥贴着波浪掠过，连呼吸都变得无比纯净。',
    tags: ['洱海日出', '富士胶片', '治愈系'],
    rotation: 1.5,
  },
  {
    id: 'mem-3',
    userId: 'user-demo-xiaolin',
    title: '玉龙雪山冰川公园 4680m',
    location: '丽江 · 玉龙雪山索道顶峰',
    regionId: 'yunnan',
    countryCode: 'CN',
    date: '2023.10.22 11:30',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    likes: 312,
    camera: 'iPhone 15 Pro Max · 24mm f/1.78',
    mood: '🏔️ 震撼神圣',
    aiStory: '踏上4680米观景台那一秒，寒风吹拂经幡猎猎作响，万年冰川就在眼前沉睡，敬畏天地造化。',
    tags: ['巅峰打卡', '神圣雪山', '挑战自我'],
    rotation: -0.8,
  }
]

/**
 * 上传旅行照片，自动触发 EXIF 解析与多智能体联合协作流
 */
router.post('/upload', authMiddleware, upload.single('photo'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file
    const { hintLocation, manualCamera } = req.body

    let fileBuffer: Buffer
    let originalname = 'travel.jpg'

    if (file) {
      fileBuffer = file.buffer
      originalname = file.originalname
    } else {
      // 允许模拟上传（直接传入测试 URL）
      fileBuffer = Buffer.from('')
    }

    // 1. EXIF 硬件级元数据解析
    const exif = fileBuffer.length > 0 ? exifService.parse(fileBuffer) : {}

    // 2. 上传至对象存储
    const uploadedUrl = await storageService.uploadFile(fileBuffer, originalname)

    // 3. 触发多智能体流水线 (VisionAgent + LocationAgent + StoryAgent)
    const pipelineResult = await orchestrator.processMemoryPipeline({
      imageUrl: uploadedUrl,
      lat: exif.lat,
      lng: exif.lng,
      hintText: hintLocation || '云南 · 丽江',
      camera: exif.cameraModel || manualCamera,
      takenAt: exif.takenAt
    })

    // 4. 组装新记忆实体
    const newMemory = {
      id: uuidv4(),
      userId: req.user?.id || 'user-demo-xiaolin',
      title: pipelineResult.story.title,
      location: pipelineResult.location.formattedAddress,
      regionId: pipelineResult.location.regionId,
      countryCode: pipelineResult.location.countryCode,
      date: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
      imageUrl: pipelineResult.imageUrl,
      likes: 1,
      camera: pipelineResult.camera,
      mood: pipelineResult.story.mood,
      aiStory: pipelineResult.story.story,
      tags: pipelineResult.story.tags,
      rotation: pipelineResult.rotation
    }

    inMemoryMemories.unshift(newMemory)

    res.status(201).json({
      success: true,
      data: {
        memory: newMemory,
        agentDetails: pipelineResult
      }
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

/**
 * 获取记忆列表（支持按 regionId 过滤）
 */
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { regionId } = req.query
  if (regionId) {
    const filtered = inMemoryMemories.filter(m => m.regionId === regionId)
    return res.json({ success: true, data: filtered })
  }
  res.json({ success: true, data: inMemoryMemories })
})

/**
 * 点赞记忆卡片
 */
router.post('/:id/like', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params
  const target = inMemoryMemories.find(m => m.id === id)
  if (target) {
    target.likes += 1
    return res.json({ success: true, data: { likes: target.likes } })
  }
  res.status(404).json({ error: '记忆不存在' })
})

export default router
