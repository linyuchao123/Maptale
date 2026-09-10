"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exifService = exports.ExifService = void 0;
const exif_parser_1 = __importDefault(require("exif-parser"));
class ExifService {
    /**
     * 从图片 Buffer 中解析真实的 GPS 经纬度、拍摄时间与相机型号
     */
    parse(buffer) {
        try {
            const parser = exif_parser_1.default.create(buffer);
            const result = parser.parse();
            const tags = result.tags || {};
            let lat = tags.GPSLatitude;
            let lng = tags.GPSLongitude;
            const takenAt = tags.DateTimeOriginal ? new Date(tags.DateTimeOriginal * 1000) : undefined;
            const make = tags.Make || '';
            const model = tags.Model || '';
            const cameraModel = (make || model) ? `${make} ${model}`.trim() : undefined;
            return {
                lat,
                lng,
                takenAt,
                cameraModel
            };
        }
        catch (err) {
            console.warn('[ExifService] EXIF 解析跳过或未包含元数据:', err.message);
            return {};
        }
    }
}
exports.ExifService = ExifService;
exports.exifService = new ExifService();
