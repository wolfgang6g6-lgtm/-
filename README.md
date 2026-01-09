# 广西现代物流集团有限公司公文智能起草助手

AI智能起草规范公文，符合GB/T 9704-2020标准。

## 部署说明

1. 环境变量配置：
   - `OPENAI_API_KEY`: API 密钥
   - `OPENAI_API_BASE`: API 基础地址 (例如 `https://yunwu.ai/v1`)
   - `OPENAI_MODEL`: 主模型 (推荐 `claude-3-5-haiku-20241022`)
   - `OPENAI_FALLBACK_MODEL`: 备用模型 (当主模型过载时自动切换，推荐 `claude-3-5-haiku-20241022`)
   - `OPENAI_MAX_RETRIES`: 重试次数 (推荐 `3`)
   - `OPENAI_RETRY_DELAY_MS`: 重试延迟 (推荐 `2000`)

2. 线上调试：
   - 访问 `/api/debug` 查看环境变量是否正确加载（不显示 Key）。
   - 访问 `/api/ping` 测试 API 连接。

## 最近更新
- **429 错误自动恢复**: 当遇到 "上游负载已饱和" 错误时，系统会自动重试并切换到备用模型 (Haiku)，确保生成功能可用。

## 功能特性

- **6种公文类型**：通知、请示、报告、合同、会议纪要、工作总结
- **AI智能生成**：输入关键信息，自动生成规范公文
- **流式输出**：打字机效果，实时显示生成内容
- **在线编辑**：生成后可直接编辑修改
- **一键操作**：支持复制、清空、打印/导出PDF
- **深浅模式**：支持浅色/深色主题切换

## 快速开始

### 1. 安装依赖

```bash
cd 公文助理text
npm install
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的 API Key：

```env
# 必填：OpenAI API Key
OPENAI_API_KEY=sk-your-api-key-here

# 可选：如果使用第三方代理或兼容接口
# OPENAI_API_BASE=https://api.openai.com/v1

# 可选：指定模型
# OPENAI_MODEL=gpt-3.5-turbo
```

**支持的 API 类型：**
- OpenAI 官方 API
- Azure OpenAI
- 任何兼容 OpenAI API 格式的服务（如 API2D、OneAPI 等）

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问：http://localhost:3000

### 4. 生产环境部署

```bash
# 构建
npm run build

# 启动
npm run start
```

## 项目结构

```
公文助理text/
├── app/
│   ├── api/generate/route.ts   # AI生成API（流式）
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 主页面
├── components/
│   ├── ui/                     # 基础UI组件
│   ├── header.tsx              # 页头
│   ├── footer.tsx              # 页脚
│   ├── document-type-tabs.tsx  # 公文类型选择
│   ├── document-form.tsx       # 动态表单
│   ├── document-editor.tsx     # 公文编辑器
│   ├── theme-provider.tsx      # 主题提供者
│   └── theme-toggle.tsx        # 主题切换按钮
├── lib/
│   ├── utils.ts                # 工具函数
│   ├── document-types.ts       # 公文类型配置
│   └── prompts.ts              # AI提示词模板
├── data/
│   └── site-config.json        # 站点配置
├── .env.example                # 环境变量模板
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 使用说明

1. **选择公文类型**：点击顶部Tab选择需要起草的公文类型
2. **填写关键信息**：在表单中填写公文的核心要点
3. **生成公文**：点击"生成公文"按钮，AI将自动生成规范内容
4. **编辑修改**：在下方编辑区可以直接修改生成的内容
5. **导出使用**：
   - 点击"复制"将内容复制到剪贴板
   - 点击"打印/PDF"可打印或另存为PDF

## 格式标准

本系统生成的公文格式参照 **GB/T 9704-2020《党政机关公文格式》**：

- 标题：黑体/方正小标宋体，22pt，居中
- 正文：仿宋，16pt，行距28pt
- 页边距：上37mm、下35mm、左28mm、右26mm

## 技术栈

- **框架**：Next.js 14 (App Router)
- **UI**：React + Tailwind CSS + shadcn/ui风格组件
- **AI**：OpenAI API（支持流式输出）
- **主题**：next-themes（深浅模式切换）

## 许可证

仅供广西现代物流集团有限公司内部使用。
