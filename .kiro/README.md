# Kiro 智能体协作配置体系

> 本目录包含完整的 Kiro University 规范配置，用于实现 AI Agent 与项目的深度集成

---

## 📁 目录结构

```
.kiro/
├── specs/                      # 规范文档（Specs & PBT）
│   └── i18n-routing.md         # 国际化路由与主题切换规范
├── steering/                   # 指导文件（Steering Rules）
│   └── code-style.md           # 代码风格与修改规则
├── hooks/                      # 自动化钩子（Hooks）
│   └── post-edit.json          # 文件编辑后触发的检查
├── powers/                     # 能力包（Powers）
│   └── vitepress-pro/
│       ├── plugin.json         # 能力包元数据
│       └── SKILLS.md           # 专家技能文档
├── settings/                   # 全局设置
│   └── mcp.json                # Model Context Protocol 配置
├── agents/                     # 自定义 Agent
│   └── doc-architect.json      # 文档架构师 Agent
└── README.md                   # 本文档
```

---

## 🎓 Kiro University 课程映射

| 课程 | 配置文件 | 功能说明 |
|------|---------|---------|
| **第一课** | `specs/i18n-routing.md` | Spec 驱动开发规范 |
| **第二课** | `steering/code-style.md` | Agent 行为指导规则 |
| **第三课** | `hooks/post-edit.json` | 自动化工作流钩子 |
| **第四课** | `specs/i18n-routing.md` | 基于属性的测试（PBT） |
| **第五课** | `powers/vitepress-pro/` | 专家能力包封装 |
| **第六课** | `settings/mcp.json` | 外部上下文协议 |
| **第七课** | `agents/doc-architect.json` | 专属 Agent 角色 |

---

## 📖 配置文件详解

### 1. Spec 规范文档 (specs/)

#### `i18n-routing.md` - 国际化路由规范

**用途：** 定义 VitePress 多语言路由解析、语言切换与主题切换的行为规则

**核心内容：**
- ✅ 使用 EARS 语法（WHERE/WHEN/THEN）定义需求
- ✅ 基于属性的测试（PBT）不变量声明
- ✅ Bug Condition 定义与修复验证
- ✅ 集成测试场景与性能基准

**适用场景：**
- 添加新语言支持时的参考规范
- 修改路由逻辑前的行为基准
- 编写属性测试用例的指导文档

**示例用法：**
```typescript
// 引用规范中的属性测试
property('路径切换的幂等性', gen.path(), (path) => {
  const switched = localeSwitch(path)
  const restored = localeSwitch(switched)
  return path === restored
})
```

---

### 2. Steering 指导文件 (steering/)

#### `code-style.md` - 代码风格与修改规则

**用途：** 定义 AI Agent 在协作开发时必须遵守的强制性规则

**核心约束：**
- 🔒 **包管理器**：必须使用 `pnpm`
- 🔒 **Vue 语法**：必须使用 `<script setup lang="ts">`
- 🔒 **国际化结构**：`src/`, `src/en/`, `src/vi/` 必须 1:1:1 镜像
- 🔒 **敏感信息**：禁止硬编码任何密钥或密码
- 🔒 **构建配置**：禁止随意修改核心构建脚本

**AI Agent 工作流程：**
```typescript
// Agent 内部检查逻辑
function beforeExecute(command: string) {
  if (command.includes('npm') || command.includes('yarn')) {
    throw new Error('❌ 禁止使用 npm/yarn，请使用 pnpm')
  }
  
  if (isFileOperation(command)) {
    checkI18nStructure()
  }
  
  if (isConfigChange(command)) {
    validateBuildScripts()
  }
}
```

**适用场景：**
- Agent 执行命令前的验证
- 代码审查时的参考标准
- 新成员加入时的规范培训

---

### 3. Hooks 自动化钩子 (hooks/)

#### `post-edit.json` - 文件编辑后触发检查

**用途：** 编辑特定文件后自动触发构建预览检查

**触发条件：**
```json
{
  "when": {
    "type": "fileEdited",
    "patterns": [
      "src/**/*.md",
      ".vitepress/config/**/*.ts",
      ".vitepress/theme/**/*.vue"
    ]
  }
}
```

**执行动作：**
1. 运行 TypeScript 类型检查
2. 检查多语言文档同步状态
3. 验证配置文件语法
4. 可选：完整构建测试

**工作流程：**
```
用户编辑 src/guide/getting-started.md
    ↓
Hook 触发检测
    ↓
Agent 提示：
  1. ✅ TypeScript 类型检查通过
  2. ⚠️  检测到中文文档变更，建议同步更新：
     - src/en/guide/getting-started.md
     - src/vi/guide/getting-started.md
  3. ✅ 配置文件语法正确
```

**禁用方法：**
```bash
# 临时禁用（本次会话）
export KIRO_HOOKS_DISABLED=true

# 永久禁用（修改 .kiro/hooks/post-edit.json）
{
  "disabled": true
}
```

---

### 4. Powers 能力包 (powers/)

#### `vitepress-pro` - VitePress 专家能力包

**用途：** 封装 VitePress 专业技能，提供自动化工具

**核心能力：**

| 能力 | 描述 | 使用方法 |
|------|------|---------|
| 侧边栏生成 | 扫描目录自动生成侧边栏配置 | `@vitepress-pro generateSidebar` |
| Mermaid 优化 | 分析图表性能并提供优化建议 | `@vitepress-pro optimizeMermaid` |
| 多语言同步 | 检测文档结构一致性 | `@vitepress-pro syncI18n` |
| 配置验证 | 实时验证配置文件语法 | `@vitepress-pro validateConfig` |

**使用示例：**
```bash
# 为 guide 目录生成侧边栏
@vitepress-pro generateSidebar --dir src/guide

# 检查所有 Mermaid 图表
@vitepress-pro optimizeMermaid --dir src

# 多语言文档同步检查
@vitepress-pro syncI18n --auto-fix

# 验证配置并生成报告
@vitepress-pro validateConfig --detailed
```

**配置选项：**
```json
{
  "settings": {
    "defaultLocales": ["zh", "en", "vi"],
    "sidebarDepth": 2,
    "autoCollapse": true,
    "mermaidTheme": "default"
  }
}
```

---

### 5. MCP 上下文协议 (settings/)

#### `mcp.json` - Model Context Protocol 配置

**用途：** 配置 Agent 访问外部资源的能力

**已配置的服务：**

| 服务 | 用途 | 状态 | 自动批准 |
|------|------|------|---------|
| **fetch** | 抓取网页内容 | ✅ 启用 | ✅ |
| **github** | 查询 GitHub 仓库 | ✅ 启用 | ✅ (读) |
| **filesystem** | 本地文件访问 | ✅ 启用 | ✅ (读) |
| **brave-search** | Brave 搜索 | ⏸️ 禁用 | ❌ |
| **sqlite** | SQLite 数据库 | ⏸️ 禁用 | ❌ |

**启用禁用的服务：**
```json
{
  "mcpServers": {
    "brave-search": {
      "disabled": false,  // 改为 false
      "env": {
        "BRAVE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**环境变量配置：**
```bash
# Windows PowerShell
$env:GITHUB_TOKEN="your_github_pat"
$env:BRAVE_API_KEY="your_brave_key"

# Linux/Mac
export GITHUB_TOKEN="your_github_pat"
export BRAVE_API_KEY="your_brave_key"
```

**使用示例：**
```typescript
// Agent 自动使用 MCP 服务
"请从 VitePress 官方仓库获取最新的配置示例"
→ Agent 使用 github MCP 服务查询 vuejs/vitepress

"请查看这个网页的内容"
→ Agent 使用 fetch MCP 服务抓取网页

"列出 src/guide 目录的所有文件"
→ Agent 使用 filesystem MCP 服务列出目录
```

---

### 6. Custom Agents 自定义代理 (agents/)

#### `doc-architect.json` - 文档架构师 Agent

**用途：** 专职处理技术文档编写、架构图绘制和文档结构优化

**核心能力：**
- 📝 技术文档编写（Technical Writing）
- 📊 架构图绘制（Architecture Diagramming）
- 🏗️ 文档结构优化（Documentation Structure）
- 🌐 多语言协调（Multilingual Sync）
- 📚 API 文档生成（API Documentation）

**工作原则：**
1. 使用 EARS 语法定义需求
2. 遵循 Steering 规则
3. 确保多语言文档镜像对齐
4. 图表节点数 < 20
5. 使用 Markdown 最佳实践

**调用方式：**
```bash
# 方法 1：显式调用
@doc-architect 创建用户认证 API 文档

# 方法 2：关键词触发
"请帮我绘制一个系统架构图"
→ 自动路由到 doc-architect Agent

# 方法 3：文件触发
编辑 src/guide/*.md
→ doc-architect Agent 提供建议
```

**工作流程示例：**

**场景 1：创建新文档**
```
用户: 创建一个关于插件系统的文档
    ↓
doc-architect:
  1. ✅ 分析需求 - 确认目标读者和内容范围
  2. ✅ 检查现有结构 - 查看 src/guide/ 目录
  3. ✅ 创建大纲 - 设计 5 个主要章节
  4. ✅ 编写内容 - 使用清晰的语言和代码示例
  5. ✅ 添加图表 - 绘制插件生命周期流程图
  6. ✅ 多语言同步 - 创建 en/vi 版本
  7. ✅ 更新配置 - 添加到侧边栏
```

**场景 2：绘制架构图**
```
用户: 展示前后端交互的登录流程
    ↓
doc-architect:
  1. ✅ 分析需求 - 确定使用时序图
  2. ✅ 设计结构 - 识别参与者（用户/前端/后端/数据库）
  3. ✅ 编写 Mermaid 代码 - 使用 sequenceDiagram
  4. ✅ 优化可读性 - 添加清晰的消息标签
  5. ✅ 性能检查 - 共 8 个消息，符合标准
  6. ✅ 嵌入文档 - 插入到 authentication.md
```

**场景 3：优化文档结构**
```
用户: 指南文档太混乱，需要重新组织
    ↓
doc-architect:
  1. ✅ 审查现有结构 - 发现 15 个文件无明确分类
  2. ✅ 识别问题 - 深度过深（4 层），重复内容
  3. ✅ 设计新结构 - 提出三层结构（入门/进阶/参考）
  4. ✅ 生成迁移计划 - 列出 12 个文件需要移动
  5. ✅ 更新配置 - 同步侧边栏和导航
  6. ✅ 验证完整性 - 检查所有链接和引用
```

---

## 🚀 快速开始

### 1. 验证配置

```bash
# 检查配置文件语法
kiro config validate

# 查看已启用的能力
kiro powers list

# 测试 MCP 连接
kiro mcp test
```

### 2. 使用 Hooks

```bash
# 编辑文档触发检查
vim src/guide/getting-started.md
# → 自动触发 post-edit Hook

# 查看 Hook 日志
kiro hooks logs
```

### 3. 调用 Powers

```bash
# 使用 VitePress Pro 能力包
@vitepress-pro check-all

# 查看详细帮助
@vitepress-pro --help
```

### 4. 使用 Custom Agent

```bash
# 调用文档架构师
@doc-architect 创建 API 文档

# 或使用关键词触发
"请帮我绘制一个时序图"
```

---

## 📋 开发指南

### 添加新的 Spec

```markdown
# 1. 创建规范文件
touch .kiro/specs/new-feature.md

# 2. 使用 EARS 语法定义需求
WHERE 用户执行 X 操作
WHEN 条件 Y 满足
THEN 系统 SHALL 执行 Z 行为

# 3. 添加属性测试
property('不变量描述', gen.data(), (data) => {
  // 验证逻辑
})
```

### 添加新的 Steering Rule

```markdown
# 1. 编辑 steering/code-style.md
vim .kiro/steering/code-style.md

# 2. 添加新规则
## X. 新规则标题

**强制要求：** 描述规则

**原因：** 说明为什么需要此规则

**示例：**
```
<!-- ✅ 正确示例 -->
<!-- ❌ 错误示例 -->
```
```

### 添加新的 Hook

```json
// 1. 创建 Hook 配置
{
  "name": "my-new-hook",
  "when": {
    "type": "fileCreated",
    "patterns": ["src/api/*.md"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "检测到新的 API 文档，请验证..."
  }
}
```

### 扩展 Power

```markdown
# 1. 编辑 powers/vitepress-pro/SKILLS.md
vim .kiro/powers/vitepress-pro/SKILLS.md

# 2. 添加新技能
## 技能 X：技能名称

### 功能描述
### 使用场景
### 工作原理
### 使用方法
```

### 配置新的 MCP 服务

```json
{
  "mcpServers": {
    "new-service": {
      "command": "uvx",
      "args": ["mcp-server-new-service"],
      "env": {
        "API_KEY": "${NEW_SERVICE_API_KEY}"
      },
      "disabled": false,
      "autoApprove": ["read_action"]
    }
  }
}
```

### 创建新的 Custom Agent

```json
{
  "name": "new-agent",
  "displayName": "新 Agent 名称",
  "role": "specialist",
  "capabilities": ["capability-1", "capability-2"],
  "systemPrompt": "你是一个专注于...的 Agent",
  "tools": ["tool-1", "tool-2"],
  "triggers": {
    "keywords": ["关键词1", "关键词2"]
  }
}
```

---

## 🔧 故障排查

### 问题 1：Hook 未触发

**检查项：**
```bash
# 1. 验证 Hook 配置语法
kiro hooks validate

# 2. 查看 Hook 状态
kiro hooks list

# 3. 检查文件模式匹配
kiro hooks test-pattern "src/guide/test.md"
```

### 问题 2：Power 调用失败

**检查项：**
```bash
# 1. 验证 Power 已安装
kiro powers list

# 2. 查看 Power 日志
kiro powers logs vitepress-pro

# 3. 重新激活 Power
kiro powers reload vitepress-pro
```

### 问题 3：MCP 连接失败

**检查项：**
```bash
# 1. 测试 MCP 连接
kiro mcp test fetch

# 2. 检查环境变量
echo $GITHUB_TOKEN

# 3. 查看 MCP 日志
kiro mcp logs
```

### 问题 4：Custom Agent 未响应

**检查项：**
```bash
# 1. 验证 Agent 配置
kiro agents validate doc-architect

# 2. 查看 Agent 状态
kiro agents list

# 3. 重新加载 Agent
kiro agents reload doc-architect
```

---

## 📚 参考资源

### 官方文档
- [Kiro University](https://kiro.dev/university) - 完整课程体系
- [Kiro Powers](https://kiro.dev/powers) - 能力包市场
- [MCP Protocol](https://modelcontextprotocol.io/) - 上下文协议规范

### 社区资源
- [VitePress 官方文档](https://vitepress.dev/)
- [Mermaid 图表文档](https://mermaid.js.org/)
- [EARS 语法指南](https://www.volere.org/templates/ears-template/)

### 项目文档
- [AGENTS.md](../AGENTS.md) - AI 协作开发指南
- [README.md](../README.md) - 项目说明文档
- [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) - 部署检查清单

---

## 🤝 贡献指南

欢迎为 Kiro 配置体系贡献改进建议！

**贡献流程：**
1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/kiro-improvement`)
3. 修改配置文件
4. 提交更改 (`git commit -m 'feat(kiro): 添加新的 Hook'`)
5. 推送分支 (`git push origin feature/kiro-improvement`)
6. 创建 Pull Request

**贡献规范：**
- 遵循 Conventional Commits 规范
- 更新相关文档
- 添加使用示例
- 通过配置验证

---

## 📝 变更日志

### v1.0.0 (2024-10-03)

**新增功能：**
- ✨ 完整的 Kiro University 7 课配置
- ✨ i18n-routing Spec 规范
- ✨ code-style Steering 规则
- ✨ post-edit Hook 自动化
- ✨ vitepress-pro Power 能力包
- ✨ MCP 上下文协议配置
- ✨ doc-architect Custom Agent

**文档：**
- 📚 完整的配置说明文档
- 📚 快速开始指南
- 📚 故障排查手册
- 📚 开发指南

---

**配置版本：** 1.0.0  
**最后更新：** 2024-10-03  
**维护者：** VitePress 项目团队  
**兼容性：** Kiro v0.8.0+
