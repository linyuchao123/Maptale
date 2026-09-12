# Maptale 自托管服务器部署指南 🚀

本文档专为在自己的云服务器（如阿里云 ECS、腾讯云 CVM 或个人 VPS）上部署 Maptale 全栈系统而编写。

---

## 🛠️ 前置条件

1. **操作系统**：Ubuntu 20.04 / 22.04 LTS 或 Debian 11+（CentOS 7+ 亦可）
2. **硬件配置建议**：
   - 最低：1 核 CPU / 2GB 内存（开启 Swap）
   - 推荐：2 核 CPU / 4GB 内存
3. **环境依赖**：
   - Docker (24.0+)
   - Docker Compose (v2.20+)
   - Git

---

## 📦 步骤一：在服务器安装 Docker & Docker Compose

若服务器尚未安装 Docker，可使用官方快速脚本安装：

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | bash -s docker

# 2. 启动并设置开机自启
sudo systemctl enable --now docker

# 3. 验证版本
docker --version
docker compose version
```

---

## 📥 步骤二：拉取项目代码

```bash
cd /opt
git clone https://github.com/linyuchao123/Maptale.git
cd Maptale
```

---

## 🔑 步骤三：配置生产环境变量

复制环境变量模板并填入你的 API Key：

```bash
cp maptale-server/.env.example maptale-server/.env
nano maptale-server/.env
```

**重点填写的项**：
- `DEEPSEEK_API_KEY`：你的 DeepSeek Key（用于 StoryAgent 创作游记与小旅对话）
- `QWEN_API_KEY`：阿里云百炼 DashScope Key（用于 VisionAgent 照片多模态识别）
- `DATABASE_URL`：你的 Supabase PostgreSQL 数据库连接串
- `OSS_ACCESS_KEY_ID` & `OSS_ACCESS_KEY_SECRET`：阿里云 OSS 凭据（若暂未开通可先留空，系统自动优雅降级）

---

## 🚀 步骤四：一键启动全栈服务

在项目根目录下执行：

```bash
docker compose up -d --build
```

Docker 将自动执行：
1. 构建前端生产包并放入 Nginx 容器（监听 80 端口）；
2. 编译并启动 Node.js TypeScript 后端多智能体服务（监听 3001 端口）；
3. 启动 Redis 7 缓存；
4. 配置内网安全通信与 `/api` 自动代理。

### 检查运行状态

```bash
docker compose ps
docker compose logs -f server
```

看到如下输出即代表启动成功：
```
✨ ===================================================
🧭 Maptale 多智能体后端服务已成功启动！
🚀 服务端口: http://localhost:3001
🧠 7大协同智能体就绪: Orchestrator, Vision, Location, Story, Chat, Planner
====================================================
```

---

## 🌐 步骤五：访问与域名解析

1. 确保云服务器的安全组规则已放行 **80** 和 **443** 端口。
2. 在浏览器中直接输入你的服务器公网 IP：`http://<YOUR_SERVER_IP>` 即可打开 Maptale。
3. **若需绑定域名与 HTTPS 证书**：
   可使用免费的 Certbot：
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔄 日常维护与更新

当 GitHub 仓库有新功能提交时，在服务器一键热更新：

```bash
cd /opt/Maptale
git pull origin main
docker compose up -d --build
```
