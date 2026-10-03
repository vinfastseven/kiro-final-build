# 国际化路由与主题切换规范 (I18n Routing & Theme Switching Spec)

## 1. 功能概述

本规范定义 VitePress 多语言文档站点的路由解析、语言切换与黑夜模式切换的行为规则。

---

## 2. 需求定义 (EARS 语法)

### R1: 中英文路由解析

**WHERE** 用户访问文档站点的 URL  
**WHEN** URL 路径包含 `/en/` 前缀  
**THEN** 系统 **SHALL** 加载英文版本的 Markdown 内容  
**AND** 导航栏与侧边栏 **SHALL** 显示英文翻译文本

**WHERE** 用户访问文档站点的 URL  
**WHEN** URL 路径不包含 `/en/` 前缀（根路径或 `/zh/`）  
**THEN** 系统 **SHALL** 加载中文版本的 Markdown 内容  
**AND** 导航栏与侧边栏 **SHALL** 显示中文翻译文本

### R2: 语言切换器行为

**WHERE** 用户点击导航栏的语言切换器  
**WHEN** 当前页面为中文版 `/guide/introduction.html`  
**THEN** 系统 **SHALL** 跳转到对应的英文版 `/en/guide/introduction.html`  
**AND** 页面内容 **SHALL** 切换为英文  
**AND** 浏览器地址栏 **SHALL** 更新为英文路径

**WHERE** 用户点击导航栏的语言切换器  
**WHEN** 当前页面为英文版 `/en/guide/introduction.html`  
**THEN** 系统 **SHALL** 跳转到对应的中文版 `/guide/introduction.html`  
**AND** 页面内容 **SHALL** 切换为中文  
**AND** 浏览器地址栏 **SHALL** 更新为中文路径

### R3: 黑夜模式切换

**WHERE** 用户点击导航栏的主题切换器  
**WHEN** 当前主题为亮色模式  
**THEN** 系统 **SHALL** 切换到暗色模式  
**AND** 主题切换器图标 **SHALL** 更新为月亮图标  
**AND** 用户偏好 **SHALL** 保存到 `localStorage`

**WHERE** 用户点击导航栏的主题切换器  
**WHEN** 当前主题为暗色模式  
**THEN** 系统 **SHALL** 切换到亮色模式  
**AND** 主题切换器图标 **SHALL** 更新为太阳图标  
**AND** 用户偏好 **SHALL** 保存到 `localStorage`

### R4: 404 错误页面

**WHERE** 用户访问不存在的页面路径  
**WHEN** URL 路径以 `/en/` 开头  
**THEN** 系统 **SHALL** 显示英文版 404 错误页面  
**AND** 提供返回首页的英文链接 `/en/`

**WHERE** 用户访问不存在的页面路径  
**WHEN** URL 路径不以 `/en/` 开头  
**THEN** 系统 **SHALL** 显示中文版 404 错误页面  
**AND** 提供返回首页的中文链接 `/`

---

## 3. 正确性属性 (Property-Based Testing)

### 属性 P1: 路径解析的双向映射

**不变量：** 对于任意有效的中文路径 `path_zh`，存在唯一的英文路径 `path_en`，满足：
```
localeSwitch(path_zh) = path_en
localeSwitch(path_en) = path_zh
localeSwitch(localeSwitch(path)) = path  // 幂等性
```

**测试策略：**
```typescript
// 基于属性的测试用例
property('路径切换的幂等性', gen.path(), (path) => {
  const switched = localeSwitch(path)
  const restored = localeSwitch(switched)
  return path === restored
})

property('中英文路径结构一致性', gen.zhPath(), (zhPath) => {
  const enPath = localeSwitch(zhPath)
  const zhParts = zhPath.split('/').filter(Boolean)
  const enParts = enPath.split('/').filter(Boolean)
  // 移除语言前缀后，路径结构应相同
  return zhParts.length === enParts.length - 1 // en 多一个 'en' 前缀
})
```

### 属性 P2: 主题状态持久化

**不变量：** 主题状态在页面刷新后应保持一致
```
theme_before_refresh = localStorage.get('vitepress-theme-appearance')
refresh_page()
theme_after_refresh = getCurrentTheme()
theme_before_refresh === theme_after_refresh
```

**测试策略：**
```typescript
property('主题状态持久化', gen.theme(), (theme) => {
  setTheme(theme)
  simulatePageRefresh()
  return getCurrentTheme() === theme
})
```

### 属性 P3: 路由解析的确定性

**不变量：** 相同的 URL 输入应始终解析到相同的语言版本
```
∀ url ∈ ValidURLs:
  parseLocale(url) = parseLocale(url)  // 确定性
  isZhLocale(url) XOR isEnLocale(url)   // 互斥性
```

**测试策略：**
```typescript
property('路由解析的确定性', gen.url(), (url) => {
  const locale1 = parseLocale(url)
  const locale2 = parseLocale(url)
  return locale1 === locale2
})

property('语言版本互斥性', gen.url(), (url) => {
  const isZh = isZhLocale(url)
  const isEn = isEnLocale(url)
  return (isZh && !isEn) || (!isZh && isEn)
})
```

---

## 4. 验收标准 (Acceptance Criteria)

### AC1: 路由跳转正确性

- [x] 访问 `/guide/getting-started.html` 显示中文内容
- [x] 访问 `/en/guide/getting-started.html` 显示英文内容
- [x] 访问 `/vi/guide/getting-started.html` 显示越南语内容
- [x] 404 页面根据当前语言显示对应翻译

### AC2: 语言切换器功能

- [x] 切换器显示当前语言标签（简体中文 / English / Tiếng Việt）
- [x] 点击切换器后 URL 和内容同步更新
- [x] 切换后页面滚动位置保持不变（如可能）

### AC3: 主题切换器功能

- [x] 默认主题跟随系统偏好
- [x] 手动切换后覆盖系统偏好
- [x] 切换状态保存到 `localStorage`
- [x] 页面刷新后主题状态保持

### AC4: 边界情况处理

- [x] 不存在的语言前缀（如 `/fr/`）重定向到默认语言
- [x] 缺失对应语言版本的页面显示友好提示
- [x] 快速连续点击切换器不会导致状态错乱

---

## 5. 技术实现约束

### 约束 C1: 文件结构镜像

```
src/
├── index.md              # 中文首页
├── guide/
│   ├── getting-started.md
│   └── configuration.md
├── en/
│   ├── index.md          # 英文首页（镜像结构）
│   └── guide/
│       ├── getting-started.md
│       └── configuration.md
└── vi/
    ├── index.md          # 越南语首页（镜像结构）
    └── guide/
        ├── getting-started.md
        └── configuration.md
```

**规则：** 添加/删除任何中文文档时，必须同步更新 `en/` 和 `vi/` 对应文件。

### 约束 C2: 配置文件规范

- 语言切换逻辑集中在 `.vitepress/config.ts` 的 `locales` 配置
- 主题配置使用 VitePress 内置的 `appearance` 选项
- 禁止在 Markdown 中硬编码语言相关的路径

### 约束 C3: 性能要求

- 语言切换响应时间 < 200ms
- 主题切换动画流畅，无闪烁
- 路由解析不触发额外的网络请求

---

## 6. 测试用例生成器

### 生成器 G1: 有效路径生成器

```typescript
import { fc } from 'fast-check'

const validPathSegments = fc.constantFrom(
  'guide', 'api', 'tutorial', 'reference', 'examples'
)

const validFileName = fc.constantFrom(
  'getting-started', 'configuration', 'installation', 
  'deployment', 'troubleshooting'
)

export const genZhPath = fc.record({
  segments: fc.array(validPathSegments, { minLength: 1, maxLength: 3 }),
  file: validFileName,
}).map(({ segments, file }) => `/${segments.join('/')}/${file}.html`)

export const genEnPath = fc.record({
  segments: fc.array(validPathSegments, { minLength: 1, maxLength: 3 }),
  file: validFileName,
}).map(({ segments, file }) => `/en/${segments.join('/')}/${file}.html`)
```

### 生成器 G2: 主题状态生成器

```typescript
export const genTheme = fc.constantFrom('light', 'dark', 'auto')

export const genThemePreference = fc.record({
  systemTheme: genTheme,
  userPreference: fc.option(genTheme, { nil: undefined }),
})
```

---

## 7. Bug Condition 定义

### BC1: 路径解析失败

**Bug Condition C(X):**  
给定有效的中文路径 X，如果 `localeSwitch(X)` 返回的英文路径不存在或无法访问，则触发 Bug。

**Preservation Check:**  
确保修复不破坏现有的中文路径解析。

**Fix Check:**  
验证所有测试路径的双向切换均成功。

### BC2: 主题状态丢失

**Bug Condition C(X):**  
用户设置主题为 X，刷新页面后主题变为 Y (Y ≠ X)，则触发 Bug。

**Preservation Check:**  
确保 localStorage 读写逻辑不被破坏。

**Fix Check:**  
验证主题状态在 100 次模拟刷新后仍保持一致。

---

## 8. 集成测试场景

### 场景 S1: 完整用户流程

1. 用户访问中文首页 `/`
2. 点击语言切换器切换到英文 `/en/`
3. 浏览到指南页面 `/en/guide/getting-started.html`
4. 切换主题到暗色模式
5. 刷新页面，验证主题和语言保持
6. 切换回中文 `/guide/getting-started.html`
7. 验证主题状态依然为暗色模式

**预期结果：** 所有步骤平滑执行，无状态丢失或路径错误。

---

## 9. 性能基准

| 操作 | 目标时间 | 测量方法 |
|------|---------|---------|
| 语言切换 | < 200ms | Performance API |
| 主题切换 | < 100ms | requestAnimationFrame |
| 路由解析 | < 50ms | 单元测试计时 |
| localStorage 写入 | < 10ms | 单元测试计时 |

---

## 10. 维护指南

### 添加新语言

1. 在 `src/` 下创建新语言目录（如 `ja/`）
2. 更新 `.vitepress/config.ts` 的 `locales` 配置
3. 添加对应的翻译文件到 `.vitepress/config/locales/ja/`
4. 更新路径解析逻辑以支持新语言前缀
5. 运行完整的属性测试套件验证

### 修改路由逻辑

1. 修改前运行所有 PBT 测试确保基准
2. 进行代码修改
3. 重新运行 PBT 测试验证不变量
4. 手动测试所有语言切换场景
5. 更新本规范文档

---

**规范版本：** 1.0.0  
**最后更新：** 2024-10-03  
**维护者：** VitePress 项目团队
