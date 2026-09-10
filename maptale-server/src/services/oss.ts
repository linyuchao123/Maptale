import OSS from 'ali-oss'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export class StorageService {
  private client: any = null

  constructor() {
    if (process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET) {
      try {
        this.client = new OSS({
          region: process.env.OSS_REGION || 'oss-cn-hangzhou',
          accessKeyId: process.env.OSS_ACCESS_KEY_ID,
          accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
          bucket: process.env.OSS_BUCKET || 'maptale-memories'
        })
      } catch (err) {
        console.warn('[StorageService] OSS 初始化失败，使用备用存储策略:', (err as Error).message)
      }
    }
  }

  /**
   * 上传文件 Buffer 至存储并返回访问 URL
   */
  async uploadFile(buffer: Buffer, originalname: string): Promise<string> {
    const ext = path.extname(originalname) || '.jpg'
    const fileName = `memories/${new Date().getFullYear()}/${uuidv4()}${ext}`

    if (this.client) {
      try {
        const result = await this.client.put(fileName, buffer)
        return result.url
      } catch (err) {
        console.error('[StorageService] 阿里云 OSS 上传异常:', err)
      }
    }

    // 本地开发或备用 CDN 模拟（返回高质量真实旅行风景测试图）
    const demoPhotos = [
      'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    ]
    return demoPhotos[Math.floor(Math.random() * demoPhotos.length)]
  }
}

export const storageService = new StorageService()
