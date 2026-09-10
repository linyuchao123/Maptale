"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestrator = exports.OrchestratorAgent = void 0;
const visionAgent_1 = require("./visionAgent");
const locationAgent_1 = require("./locationAgent");
const storyAgent_1 = require("./storyAgent");
class OrchestratorAgent {
    /**
     * 编排多智能体联合协作流：
     * 1. 启动 VisionAgent 视觉解析
     * 2. 启动 LocationAgent 定位反查与省份拼图匹配
     * 3. 汇总上下文触发 StoryAgent 游记日记创作
     * 4. 产出最终全维度手帐记忆实体
     */
    async processMemoryPipeline(params) {
        const { imageUrl, lat, lng, hintText, camera, takenAt } = params;
        console.log(`[Orchestrator] 🚀 启动多智能体协作流水线，处理图片: ${imageUrl.slice(0, 40)}...`);
        // 第一阶段：并行执行视觉分析与位置解析
        const [visionResult, locationResult] = await Promise.all([
            visionAgent_1.visionAgent.analyze(imageUrl).catch(err => {
                console.error('[Orchestrator] VisionAgent 失败，使用基础解析:', err);
                return {
                    sceneType: '旅行风景',
                    lighting: '自然光',
                    mood: '🌸 温暖惬意',
                    elements: ['风景', '街道'],
                    colorPalette: ['#f9a8d4'],
                    weatherGuess: '晴',
                    description: '美丽的旅行瞬间'
                };
            }),
            locationAgent_1.locationAgent.resolve({ lat, lng, hintText }).catch(err => {
                console.error('[Orchestrator] LocationAgent 失败，使用备用定位:', err);
                return {
                    countryCode: 'CN',
                    countryName: '中国',
                    regionId: 'yunnan',
                    regionName: '云南',
                    city: '大理市',
                    formattedAddress: '云南 · 大理',
                    confidence: 0.7
                };
            })
        ]);
        console.log(`[Orchestrator] ✓ 视觉与地理定位解析完毕: ${locationResult.regionName} · ${locationResult.city}`);
        // 第二阶段：将前序智能体成果注入 StoryAgent 进行文学创作
        const storyResult = await storyAgent_1.storyAgent.createStory({
            vision: visionResult,
            location: locationResult,
            takenAt
        });
        console.log(`[Orchestrator] ✓ StoryAgent 游记手帐生成完成: 「${storyResult.title}」`);
        // 计算拍立得微旋转角度 (-2deg 到 2deg)
        const rotation = Number((Math.random() * 3.6 - 1.8).toFixed(1));
        return {
            imageUrl,
            location: locationResult,
            vision: visionResult,
            story: storyResult,
            camera: camera || 'Sony A7M4 · 35mm f/1.4',
            takenAt: takenAt || new Date(),
            rotation
        };
    }
}
exports.OrchestratorAgent = OrchestratorAgent;
exports.orchestrator = new OrchestratorAgent();
