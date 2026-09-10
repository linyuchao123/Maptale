"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const ai_1 = __importDefault(require("./routes/ai"));
const memories_1 = __importDefault(require("./routes/memories"));
const regions_1 = __importDefault(require("./routes/regions"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 中间件
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '30mb' }));
// API 路由挂载
app.use('/api/auth', auth_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/memories', memories_1.default);
app.use('/api/regions', regions_1.default);
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        system: 'Maptale Multi-Agent Backend',
        time: new Date().toISOString(),
        agents: ['orchestrator', 'vision', 'location', 'story', 'chat', 'planner']
    });
});
app.listen(PORT, () => {
    console.log(`\n✨ ===================================================`);
    console.log(`🧭 Maptale 多智能体后端服务已成功启动！`);
    console.log(`🚀 服务端口: http://localhost:${PORT}`);
    console.log(`🧠 7大协同智能体就绪: Orchestrator, Vision, Location, Story, Chat, Planner`);
    console.log(`====================================================\n`);
});
exports.default = app;
