# 📁 Pancrepal 小胰宝 - 开发需求文档 (V3.7)

## 1. 产品核心 Definition
*   **产品名称**：小胰宝 (Pancrepal)
*   **官方定义**：**肿瘤科普 | 病友/家属科普与病情主动管理伙伴**
*   **核心价值**：通过结构化的管理路线图、及时的 AI 科普回答、有温度的实时语音通话和互助社区，消除信息差，赋能病友主动管理病情。

## 2. 核心功能模块

### 2.1 智能 Management 路线图 (Roadmap)
- **详情页能力**：提供指南精要、附件资源（PDF/在线文档）及针对性 AI 提问入口。

### 2.2 知识大闯关 (Knowledge Quiz)
- **业务规则**：10 题一组，答对 1 题得 10 次 AI 配额。

### 2.3 小胰宝 AI 助手 (AI Copilot & Real-time Voice)
- **双模态交互**：支持文字聊天与实时语音通话（基于 Gemini Live API）。
- **实时语音 (Voice Mode)**：
    - **视觉规范**：中央为超大圆形品牌 Logo 头像（`w-56` 或更大），背景采用与主题一致的浅绿色渐变，严禁使用黑色背景。
    - **播报状态**：Logo 头像在说话时具有放大效果（`scale-110`）并伴随内部跳动的白色音频能量条。
    - **配置交互**：音色选择（成年女性、成年男性、年轻男性）采用**单行三列**布局并列展现，以极致节省纵向空间。
    - **交互逻辑**：点击中央大头像即可立即启动/停止语音连接。

### 2.4 互助社区 (Community)
- **奖励体系**：分享经验可赢取 AI 永久配额。

## 3. UI/UX 视觉与交互规范

### 3.1 首页 AI 入口增强
- **视觉升级**：聊天页首页的 AI 助手入口由圆角矩形升级为**大圆形卡片**。
- **元素构成**：白色圆形外框 + 品牌绿色圆形内饰 + **彩色品牌 Logo** + 右下角橙色麦克风角标。
- **引导提示**：吉祥物下方配有“点击开启语音通话”的呼吸感标签。

### 3.2 免责声明区 (Disclaimer Area)
- **极致压缩高度**：位于底部导航栏上方，高度极小（`py-0.5`），无上边框，视觉上与导航栏融为一体。
- **单行展现**：文字缩写至极简一行，禁止折行，使用 `whitespace-nowrap`。
- **文字规范**：颜色 `text-slate-400`，字号 `text-[11px]`（关怀模式 `text-[13px]`）。

### 3.3 适老关怀模式 (Care Mode)
- **全局缩放**：字体放大 1.15 倍。
- **组件增强**：圆形 AI 入口及语音助手头像尺寸相应放大。

## 4. 技术规范 (Technical Path)
- **语音引擎**：利用 `@google/genai` 的 `live.connect` 接口。
- **模型版本**：`gemini-2.5-flash-native-audio-preview-09-2025`。
- **资源路径**：Logo 图片统一使用 `https://picgo-1302991947.cos.ap-guangzhou.myqcloud.com/images/logo_512_image.png`。

## 5. 核心样式代码参考 (Tailwind)
- **大圆形 AI 入口**：`bg-white rounded-full flex items-center justify-center shadow-2xl`
- **单行并列音色选择**：`grid grid-cols-3 gap-2`
- **免责声明单行**：`text-slate-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis`

## 6. 免责声明固定文案
“⚠️ 声明：内容仅供科普参考，不作医疗建议，就医请遵医嘱。”