# Pancrepal 小胰宝 - 病情主动管理助手

## 项目简介
小胰宝 (Pancrepal) 是一款专为肿瘤病友及其家属设计的非营利性科普与病情主动管理平台。通过结构化的管理路线图、游戏化的知识学习、互助社区以及基于 Gemini AI 的智能助手，赋能患者，消除信息差。

## 核心功能
- **智能管理路线图**：结构化展示临床治疗、营养、心理等关键节点。
- **知识大闯关**：寓教于乐，通过答题赢取 AI 互动配额。
- **AI 科普助手**：基于 Gemini-3-Flash 驱动，提供实时的专业科普解答。
- **互助社区**：病友间真实的康复经验分享。
- **适老关怀模式**：全局字体放大，简化交互，服务高龄患者。

## 🚀 部署注意事项

如果您计划将本项目部署到 **EdgeOne**、**Zeabur**、**Vercel** 或 **Cloudflare Pages** 等静态托管平台，请务必对 `index.html` 进行如下修改，以确保 React 入口脚本能被正确识别和加载。

在 `index.html` 文件中，找到 `<div id="root"></div>`，并在其后加入脚本引用代码。修改后的 body 结构应如下所示：

```html
<body>
  <div id="root"></div>
  <script type="module" src="index.tsx"></script>
</body>
</html>
```

## 技术栈
- **Frontend**: React 19, Tailwind CSS, Lucide React
- **AI**: Google Gemini API (@google/genai)
- **Data**: Supabase (推荐用于生产环境)

## 免责声明
本平台所有内容仅供科普参考，不可作为医疗诊断建议，不能替代医生面诊。如有身体不适，请务必及时前往医院咨询专业医师。