"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orchestrator_1 = require("../agents/orchestrator");
const chatAgent_1 = require("../agents/chatAgent");
const plannerAgent_1 = require("../agents/plannerAgent");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * 与小旅旅行助手进行多轮对话
 */
router.post('/chat', auth_1.authMiddleware, async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'message 不能为空' });
        }
        const reply = await chatAgent_1.chatAgent.chat({
            userMessage: message,
            history,
            userStats: {
                visitedRegionsCount: 22,
                name: req.user?.name || '旅行者'
            }
        });
        res.json({
            success: true,
            data: {
                reply,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/**
 * 智能旅行路线规划
 */
router.post('/itinerary', auth_1.authMiddleware, async (req, res) => {
    try {
        const { destination, days, style } = req.body;
        if (!destination) {
            return res.status(400).json({ error: 'destination 不能为空' });
        }
        const plan = await plannerAgent_1.plannerAgent.generateItinerary({
            destination,
            days: Number(days) || 3,
            style
        });
        res.json({
            success: true,
            data: plan
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/**
 * 单独触发多智能体图片分析与游记日记生成流水线
 */
router.post('/process-memory', auth_1.authMiddleware, async (req, res) => {
    try {
        const { imageUrl, lat, lng, hintText, camera } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ error: 'imageUrl 不能为空' });
        }
        const result = await orchestrator_1.orchestrator.processMemoryPipeline({
            imageUrl,
            lat: lat ? Number(lat) : undefined,
            lng: lng ? Number(lng) : undefined,
            hintText,
            camera
        });
        res.json({
            success: true,
            data: result
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
