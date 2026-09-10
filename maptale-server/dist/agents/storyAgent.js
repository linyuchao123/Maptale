"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyAgent = exports.StoryAgent = void 0;
const axios_1 = __importDefault(require("axios"));
class StoryAgent {
    apiKey;
    baseUrl;
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY;
        this.baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    }
    /**
     * 结合视觉分析与位置信息，创作独一无二的旅行手帐日记
     */
    async createStory(params) {
        const { vision, location } = params;
        if (this.apiKey) {
            try {
                const prompt = `你是一位文学功底深厚、情感细腻的旅行手帐作家智能体（StoryAgent）。
现有以下真实的旅行拍摄线索：
- 地点信息：${location.countryName} · ${location.regionName} · ${location.city} ${location.attractionName || ''}
- 场景画面：${vision.sceneType}，画面包含：${vision.elements.join('、')}
- 光影与天气：${vision.lighting}，${vision.weatherGuess}
- 视觉情绪：${vision.mood}

请为这张照片创作一篇手帐日记，严格输出如下 JSON 格式：
{
  "title": "精炼且文艺的标题（不超过12个字，如：古镇余晖与时光的慢舞）",
  "story": "以第一人称撰写一段优美动人的手帐随笔（80~130字），语言灵动温暖，写出那一刻的心境与旅行的治愈感。",
  "mood": "符合情境的心情标签（如：🌸 温暖惬意 / 🌙 静谧浪漫 / 🏔️ 震撼神圣）",
  "tags": ["3-4个精选标签，不带#号，如：慢生活, 古城夕阳, 治愈旅行"],
  "recommendedMusic": "一首贴合此情此景的环境白噪音或民谣曲目名称"
}
请注意：只返回纯 JSON，严禁包裹 markdown 代码块或附带其他文字。`;
                const response = await axios_1.default.post(`${this.baseUrl}/v1/chat/completions`, {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的旅行文学创作助手，严格只输出合法的 JSON 字符串。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.8,
                    max_tokens: 500
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000
                });
                const content = response.data?.choices?.[0]?.message?.content;
                if (content) {
                    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
                    return JSON.parse(cleaned);
                }
            }
            catch (err) {
                console.warn('[StoryAgent] DeepSeek API 调用异常，使用高水准文案引擎生成:', err.message);
            }
        }
        return this.generateFallbackStory(location, vision);
    }
    generateFallbackStory(location, vision) {
        const templates = [
            {
                title: `${location.regionName}晚霞 · 慢下来的时光`,
                story: `暮色将近，天边泛起柔和的粉紫。走在${location.regionName}的古巷里，微风穿过屋檐带起清脆的风铃声。那些在城市里积攒的焦虑与疲惫，都在这一刻随着晚风悄然散开。`,
                mood: '🌸 温暖惬意',
                tags: ['慢调时光', `${location.regionName}旅记`, '治愈黄昏'],
                recommendedMusic: '民谣吉他 · 晚风轻拂'
            },
            {
                title: `山海相逢在${location.regionName}`,
                story: `远山苍茫，云雾舒卷。站在这片土地上深呼吸，空气里带着泥土与松木的清香。每一个旅行中驻足的瞬间，都是拼凑人生完整地图最闪亮的拼图碎片。`,
                mood: '✨ 宁静致远',
                tags: ['自然旷野', '人生拼图', '心灵治愈'],
                recommendedMusic: '空灵手碟 · 空山清流'
            }
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }
}
exports.StoryAgent = StoryAgent;
exports.storyAgent = new StoryAgent();
