import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.warn('[API Client Error]', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * AI 智能体相关接口
 */
export const aiApi = {
  // 与小旅对话
  chat: (message: string, history: Array<{ role: string; content: string }> = []) => {
    return apiClient.post('/ai/chat', { message, history })
  },
  // 规划路线
  itinerary: (destination: string, days = 3, style = 'leisure') => {
    return apiClient.post('/ai/itinerary', { destination, days, style })
  },
  // 多智能体图片联合处理流水线
  processMemory: (data: {
    imageUrl: string
    lat?: number
    lng?: number
    hintText?: string
    camera?: string
  }) => {
    return apiClient.post('/ai/process-memory', data)
  }
}

/**
 * 旅行记忆相关接口
 */
export const memoryApi = {
  getAll: (regionId?: string) => {
    return apiClient.get('/memories', { params: { regionId } })
  },
  upload: (formData: FormData) => {
    return apiClient.post('/memories/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  like: (id: string) => {
    return apiClient.post(`/memories/${id}/like`)
  }
}

/**
 * 省份与统计接口
 */
export const regionApi = {
  getStats: () => {
    return apiClient.get('/regions/stats')
  },
  getVisited: () => {
    return apiClient.get('/regions/visited')
  }
}
