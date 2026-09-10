"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'maptale_super_secret_jwt_key_2026';
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = decoded;
            return next();
        }
        catch (err) {
            console.warn('[Auth] Token 验证失败:', err.message);
        }
    }
    // 开发阶段与体验模式：自动注入演示用户，无需强制登录打断体验
    req.user = {
        id: 'user-demo-xiaolin',
        email: 'traveler@maptale.com',
        name: '旅行者小林'
    };
    next();
}
