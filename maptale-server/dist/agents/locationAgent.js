"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationAgent = exports.LocationAgent = void 0;
const axios_1 = __importDefault(require("axios"));
// 中国各省份别名与地标关键词字典映射
const PROVINCE_MAPPING = {
    yunnan: {
        id: 'yunnan',
        name: '云南',
        keywords: ['云南', '丽江', '大理', '洱海', '玉龙雪山', '昆明', '香格里拉', '西双版纳', '泸沽湖', '腾冲', '元阳']
    },
    sichuan: {
        id: 'sichuan',
        name: '四川',
        keywords: ['四川', '成都', '九寨沟', '稻城', '亚丁', '峨眉山', '乐山', '四姑娘山', '都江堰', '阿坝']
    },
    beijing: {
        id: 'beijing',
        name: '北京',
        keywords: ['北京', '故宫', '长城', '颐和园', '天坛', '南锣鼓巷', '什刹海', '胡同', '鸟巢']
    },
    xizang: {
        id: 'xizang',
        name: '西藏',
        keywords: ['西藏', '拉萨', '布达拉宫', '纳木错', '日喀则', '林芝', '羊卓雍措', '珠峰']
    },
    zhejiang: {
        id: 'zhejiang',
        name: '浙江',
        keywords: ['浙江', '杭州', '西湖', '乌镇', '西塘', '普陀山', '千岛湖', '舟山', '莫干山', '宁波']
    },
    guangdong: {
        id: 'guangdong',
        name: '广东',
        keywords: ['广东', '广州', '深圳', '珠海', '潮州', '汕头', '顺德', '白云山', '小蛮腰']
    },
    guangxi: {
        id: 'guangxi',
        name: '广西',
        keywords: ['广西', '桂林', '阳朔', '漓江', '北海', '涠洲岛', '黄姚古镇', '龙脊梯田']
    },
    shaanxi: {
        id: 'shaanxi',
        name: '陕西',
        keywords: ['陕西', '西安', '兵马俑', '华山', '大雁塔', '大唐不夜城', '古城墙']
    },
    shanghai: {
        id: 'shanghai',
        name: '上海',
        keywords: ['上海', '外滩', '陆家嘴', '武康路', '东方明珠', '迪士尼', '城隍庙']
    },
    chongqing: {
        id: 'chongqing',
        name: '重庆',
        keywords: ['重庆', '洪崖洞', '解放碑', '李子坝', '武隆', '磁器口', '朝天门']
    },
    hunan: {
        id: 'hunan',
        name: '湖南',
        keywords: ['湖南', '长沙', '张家界', '天门山', '凤凰古城', '橘子洲', '岳麓山']
    },
    hainan: {
        id: 'hainan',
        name: '海南',
        keywords: ['海南', '三亚', '海口', '万宁', '亚龙湾', '后海', '蜈支洲岛']
    },
};
class LocationAgent {
    amapKey;
    constructor() {
        this.amapKey = process.env.AMAP_WEB_KEY;
    }
    /**
     * 解析经纬度或地点文本，确定国家与省份拼图归属
     */
    async resolve(params) {
        const { lat, lng, hintText } = params;
        // 1. 若有经纬度且配置了高德逆地理编码
        if (lat && lng && this.amapKey) {
            try {
                const res = await axios_1.default.get('https://restapi.amap.com/v3/geocode/regeo', {
                    params: {
                        key: this.amapKey,
                        location: `${lng},${lat}`,
                        extensions: 'base'
                    },
                    timeout: 5000
                });
                const addressComponent = res.data?.regeocode?.addressComponent;
                if (addressComponent) {
                    const provinceName = addressComponent.province || '';
                    const city = addressComponent.city || addressComponent.district || '';
                    const matched = this.matchProvince(provinceName + ' ' + (hintText || ''));
                    return {
                        countryCode: 'CN',
                        countryName: '中国',
                        regionId: matched.id,
                        regionName: matched.name,
                        city: typeof city === 'string' ? city : matched.name,
                        attractionName: hintText,
                        formattedAddress: res.data?.regeocode?.formatted_address || `${matched.name} · ${city}`,
                        lat,
                        lng,
                        confidence: 0.95
                    };
                }
            }
            catch (err) {
                console.warn('[LocationAgent] 高德逆地理编码出错，切换到文本规则匹配:', err.message);
            }
        }
        // 2. 基于经纬度粗略反查（中国常用旅游经纬度网格匹配）
        if (lat && lng) {
            const geoMatched = this.matchCoordinates(lat, lng);
            if (geoMatched) {
                return {
                    countryCode: 'CN',
                    countryName: '中国',
                    regionId: geoMatched.id,
                    regionName: geoMatched.name,
                    city: geoMatched.name,
                    formattedAddress: `中国 · ${geoMatched.name}`,
                    lat,
                    lng,
                    confidence: 0.85
                };
            }
        }
        // 3. 文本与地标关键词智能分析
        const matched = this.matchProvince(hintText || '云南');
        return {
            countryCode: 'CN',
            countryName: '中国',
            regionId: matched.id,
            regionName: matched.name,
            city: hintText?.split('·')?.[1]?.trim() || matched.name,
            attractionName: hintText?.split('·')?.[2]?.trim() || hintText,
            formattedAddress: hintText || `中国 · ${matched.name}`,
            lat: lat || 26.872,
            lng: lng || 100.233,
            confidence: 0.8
        };
    }
    matchProvince(text) {
        for (const [key, val] of Object.entries(PROVINCE_MAPPING)) {
            for (const kw of val.keywords) {
                if (text.includes(kw)) {
                    return { id: val.id, name: val.name };
                }
            }
        }
        // 默认云南（最具代表性的旅行圣地）
        return { id: 'yunnan', name: '云南' };
    }
    matchCoordinates(lat, lng) {
        if (lat >= 21.0 && lat <= 29.5 && lng >= 97.0 && lng <= 106.5)
            return { id: 'yunnan', name: '云南' };
        if (lat >= 26.0 && lat <= 34.5 && lng >= 97.0 && lng <= 108.5)
            return { id: 'sichuan', name: '四川' };
        if (lat >= 39.4 && lat <= 41.1 && lng >= 115.4 && lng <= 117.5)
            return { id: 'beijing', name: '北京' };
        if (lat >= 26.8 && lat <= 36.5 && lng >= 78.4 && lng <= 99.1)
            return { id: 'xizang', name: '西藏' };
        if (lat >= 27.0 && lat <= 31.5 && lng >= 118.0 && lng <= 123.0)
            return { id: 'zhejiang', name: '浙江' };
        if (lat >= 20.0 && lat <= 25.5 && lng >= 109.5 && lng <= 117.5)
            return { id: 'guangdong', name: '广东' };
        return null;
    }
}
exports.LocationAgent = LocationAgent;
exports.locationAgent = new LocationAgent();
