"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * 登录 / 快速演示认证
 */
router.post('/login', (req, res) => {
    const { email } = req.body;
    const secret = process.env.JWT_SECRET || 'maptale_super_secret_jwt_key_2026';
    const user = {
        id: 'user-demo-xiaolin',
        email: email || 'traveler@maptale.com',
        name: '旅行者小林'
    };
    const token = jsonwebtoken_1.default.sign(user, secret, { expiresIn: '30d' });
    res.json({
        success: true,
        data: {
            user,
            token
        }
    });
});
/**
 * 获取当前登录用户信息
 */
router.get('/me', auth_1.authMiddleware, (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
});
exports.default = router;
