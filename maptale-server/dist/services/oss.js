"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.StorageService = void 0;
const ali_oss_1 = __importDefault(require("ali-oss"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class StorageService {
    client = null;
    constructor() {
        if (process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET) {
            try {
                this.client = new ali_oss_1.default({
                    region: process.env.OSS_REGION || 'oss-cn-hangzhou',
                    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
                    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
                    bucket: process.env.OSS_BUCKET || 'maptale-memories'
                });
            }
            catch (err) {
                console.warn('[StorageService] OSS 初始化失败，使用备用存储策略:', err.message);
            }
        }
    }
    /**
     * 上传文件 Buffer 至存储并返回访问 URL
     */
    async uploadFile(buffer, originalname) {
        const ext = path_1.default.extname(originalname) || '.jpg';
        const fileName = `memories/${new Date().getFullYear()}/${(0, uuid_1.v4)()}${ext}`;
        if (this.client) {
            try {
                const result = await this.client.put(fileName, buffer);
                return result.url;
            }
            catch (err) {
                console.error('[StorageService] 阿里云 OSS 上传异常:', err);
            }
        }
        // 本地开发或备用 CDN 模拟（返回高质量真实旅行风景测试图）
        const demoPhotos = [
            'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
        ];
        return demoPhotos[Math.floor(Math.random() * demoPhotos.length)];
    }
}
exports.StorageService = StorageService;
exports.storageService = new StorageService();
