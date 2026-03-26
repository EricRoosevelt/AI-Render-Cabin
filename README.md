# 🚀 AI Render Cabin (私人 AI 渲染舱)

专为大语言模型 (LLM) 创作者打造的本地沉浸式阅读、富文本编辑与小说导出工作站。

## ✨ 核心特性

* **🕵️‍♂️ 全平台底层劫持 (Universal Support)**：无需复杂配置，油猴脚本直接在浏览器底层监听 `Clipboard API`。完美兼容 Grok, ChatGPT, Gemini, Claude, Kimi 等所有带“复制”按钮的 AI！
* **📺 X光图片投屏**：独创的 DOM 穿透技术，无视网站前端遮罩层，一键提取最高清的原图 Base64 数据并投屏至本地控制台。
* **💾 时光机系统 (SQLite)**：所有抓取的文本和图片自动存入本地轻量级数据库，断电不丢失，重启秒恢复。
* **🖍️ 极客生产力 (Rich Text Editor)**：
    * 支持 `Highlight.js` 代码高亮 (Atom One Dark 主题)。
    * 全局智能检索，关键词呼吸灯定位。
    * 划词悬浮菜单：加粗、下划线、马克笔高亮一气呵成。
* **📦 三剑客导出引擎**：一键将你的聊天记录打包为 📱 沉浸式单文件 HTML、📝 标准 Markdown，或 📘 无损嵌套本地图片的 Word (.doc) 文档。

## 🛠️ 安装与使用指南

### 步骤一：启动本地渲染舱
1. 克隆本项目：`git clone https://github.com/你的名字/AI-Render-Cabin.git`
2. 安装依赖：`pip install -r requirements.txt`
3. 运行服务：`python app.py` (等待1.5秒，浏览器会自动打开控制台)

### 步骤二：安装浏览器拦截插件 (仅需一次)
为你的浏览器安装 [Tampermonkey (油猴插件)](https://www.tampermonkey.net/)。

### 步骤三：一键注入灵魂 (安装脚本)
👉 **[点击这里一键安装 AI 渲染舱拦截脚本](这里粘贴你刚才复制的那个Raw链接)**

*(点击上方链接后，油猴插件会自动弹出安装提示，点击确认即可。)*