import ExifParser from 'exif-parser'

export interface ParsedExifData {
  lat?: number
  lng?: number
  takenAt?: Date
  cameraModel?: string
}

export class ExifService {
  /**
   * 从图片 Buffer 中解析真实的 GPS 经纬度、拍摄时间与相机型号
   */
  parse(buffer: Buffer): ParsedExifData {
    try {
      const parser = ExifParser.create(buffer)
      const result = parser.parse()

      const tags = result.tags || {}

      let lat = tags.GPSLatitude
      let lng = tags.GPSLongitude
      const takenAt = tags.DateTimeOriginal ? new Date(tags.DateTimeOriginal * 1000) : undefined

      const make = tags.Make || ''
      const model = tags.Model || ''
      const cameraModel = (make || model) ? `${make} ${model}`.trim() : undefined

      return {
        lat,
        lng,
        takenAt,
        cameraModel
      }
    } catch (err) {
      console.warn('[ExifService] EXIF 解析跳过或未包含元数据:', (err as Error).message)
      return {}
    }
  }
}

export const exifService = new ExifService()
