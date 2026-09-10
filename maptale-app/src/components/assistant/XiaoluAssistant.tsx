import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHAT_RESPONSES: Record<string, string> = {
  default: '✈️ 查到北京→桂林航班：\n• 南航 CZ3168  07:30  ¥850起\n• 国航 CA1833  10:20  ¥920起\n\n建议国庆前一周出发，价格最优！',
  美食: '🍜 当地必吃：\n① 过桥米线（老字号）★4.9\n② 汽锅鸡（云南名菜）\n③ 鲜花饼（必带伴手礼）\n人均约60-100元',
  酒店: '🏨 推荐住宿：\n• 古城客栈  ¥280/晚 超赞\n• 雪山度假村  ¥580/晚 ★★★★★\n建议提前2周预订！',
  天气: '🌤️ 近期天气：\n今天 ☀️ 25°C 晴\n明天 ⛅ 22°C 多云\n后天 🌧️ 18°C 小雨\n\n建议今明两天出行最佳！',
  路线: '🗺️ 推荐3日路线：\nDay1 丽江古城 → 四方街夜市\nDay2 玉龙雪山 → 蓝月谷\nDay3 泸沽湖一日游\n\n要详细规划吗？',
}

const BOT_MSGS = [
  '欢迎回来！今天去哪里探索？🌟',
  '你的云南记忆已有 142 张照片啦 📸',
  '10月天气绝佳，要规划行程吗？✈️',
  '还有 12 个省份没走过，加油！🗺️',
]

interface Message {
  role: 'user' | 'ai'
  text: string
}

export function XiaoluAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgIdx, setMsgIdx] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '你好！我是小旅 🧭\n有任何旅行问题都可以问我～' },
  ])
  const [typing, setTyping] = useState(false)

  const send = () => {
    const v = input.trim()
    if (!v) return
    setMessages(prev => [...prev, { role: 'user', text: v }])
    setInput('')
    setTyping(true)

    let resp = CHAT_RESPONSES.default
    if (v.includes('美食') || v.includes('吃')) resp = CHAT_RESPONSES.美食
    else if (v.includes('酒店') || v.includes('住')) resp = CHAT_RESPONSES.酒店
    else if (v.includes('天气')) resp = CHAT_RESPONSES.天气
    else if (v.includes('路线') || v.includes('行程')) resp = CHAT_RESPONSES.路线

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text: resp }])
    }, 1200)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 聊天面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass-card w-80 flex flex-col overflow-hidden"
            style={{ height: 420, border: '1px solid rgba(249,168,212,0.4)' }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* 头部 */}
            <div className="flex items-center gap-3 p-3 border-b border-pink-100/50"
                 style={{ background: 'linear-gradient(135deg, rgba(249,168,212,0.15), rgba(196,181,253,0.1))' }}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200
                              flex items-center justify-center text-xl shadow-mt-glow-coral">
                🧭
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">小旅 · AI 旅行助手</p>
                <p className="text-[10px] text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  随时为你服务
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                      className="ml-auto text-gray-400 hover:text-gray-600 transition-colors text-lg">
                ×
              </button>
            </div>

            {/* 消息区 */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line
                    ${m.role === 'ai'
                      ? 'self-start bg-pink-50/80 text-gray-700 rounded-tl-sm border border-pink-100'
                      : 'self-end bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-br-sm'
                    }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  className="self-start bg-pink-50/80 border border-pink-100 rounded-2xl rounded-tl-sm px-3 py-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 bg-pink-300 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 输入区 */}
            <div className="p-3 border-t border-pink-100/50 flex gap-2">
              <input
                className="flex-1 bg-pink-50/60 border border-pink-100 rounded-full
                           px-3 py-1.5 text-xs text-gray-700 outline-none
                           placeholder:text-gray-400 focus:border-purple-300 transition-colors"
                placeholder="问小旅：美食·天气·路线..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
              />
              <button
                onClick={send}
                className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-400 to-pink-400
                           text-white flex items-center justify-center text-sm flex-shrink-0
                           hover:scale-110 transition-transform"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮动气泡提示 */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="glass-card px-4 py-2 text-xs text-gray-600 max-w-44 text-center"
            style={{ borderRadius: 14, border: '1px solid rgba(249,168,212,0.35)' }}
            key={msgIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onClick={() => setOpen(true)}
          >
            {BOT_MSGS[msgIdx % BOT_MSGS.length]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主按钮 */}
      <motion.button
        onClick={() => {
          setOpen(o => !o)
          setMsgIdx(i => (i + 1) % BOT_MSGS.length)
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-purple-400
                   text-2xl shadow-mt-glow-coral flex items-center justify-center
                   border-2 border-white/60"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 16px rgba(249,168,212,0.4)', '0 0 28px rgba(249,168,212,0.7)', '0 0 16px rgba(249,168,212,0.4)'] }}
        transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
      >
        {open ? '×' : '🧭'}
      </motion.button>
    </div>
  )
}
