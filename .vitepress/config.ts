/**
 * VitePress 项目核心配置文件 (主入口)
 * 
 * 【设计模式】：模块化解耦配置 (Modular Configuration Pattern)
 * 核心配置项已被拆分至 `./config/*` 独立模块，本文件仅作为"系统总线"进行组装与导出，
 * 以确保配置文件的单一职责 (SRP) 与高度可维护性。
 * 
 * 【国际化支持】：支持中文、英文、越南语三种语言
 * 【架构优化】：结构配置与文本翻译分离，易于维护和扩展
 * 【Mermaid 支持】：支持在 Markdown 中绘制流程图、时序图等图表
 */

import { defineConfig } from 'vitepress'

// -----------------------------------------------------------------------------
// 1. 基础配置导入 (Base Configuration Imports)
// -----------------------------------------------------------------------------

// 基础站点配置：包含 base, srcDir, outDir 等全局技术配置
import { siteConfig } from './config/site'
// SEO 优化配置：包含 <head> 中的 meta 标签、Open Graph 协议、Favicon、外部资源预加载等
import { seoConfig } from './config/seo'
// 国际化配置：多语言标签与链接配置
import { localesConfig } from './config/i18n'
// Markdown 配置：代码高亮、图表支持等
import { markdownConfig } from './config/markdown'

// -----------------------------------------------------------------------------
// 2. 共享配置导入 (Shared Configuration Imports)
// -----------------------------------------------------------------------------

// 导航结构配置（与语言无关的路由和层级）
import { navStructure } from './config/shared/nav.config'
// 侧边栏结构配置（与语言无关的分组和层级）
import { sidebarStructure } from './config/shared/sidebar.config'
// 搜索引擎配置（技术参数：分词、权重等）
import { searchEngineConfig } from './config/shared/search.config'
// 主题共享配置（logo、社交链接等）
import { themeSharedConfig, editLinkPattern } from './config/shared/theme.config'

// -----------------------------------------------------------------------------
// 3. 各语言翻译导入 (Locale Translations Imports)
// -----------------------------------------------------------------------------

// 中文翻译
import { zhNavText, zhSidebarText, zhSearchText, zhUIText, zhMetaData } from './config/locales/zh'
// 英文翻译
import { enNavText, enSidebarText, enSearchText, enUIText, enMetaData } from './config/locales/en'
// 越南语翻译
import { viNavText, viSidebarText, viSearchText, viUIText, viMetaData } from './config/locales/vi'

// -----------------------------------------------------------------------------
// 4. 配置合并工具导入 (Merge Utilities Imports)
// -----------------------------------------------------------------------------

import { mergeNav, mergeSidebar, mergeSearch, mergeThemeConfig } from './config/utils/merge-config'

// -----------------------------------------------------------------------------
// 5. 配置验证工具导入 (Validation Utilities Imports)
// -----------------------------------------------------------------------------

import { validateLocaleConfig } from './config/utils/validators'

// -----------------------------------------------------------------------------
// 6. 开发环境下验证配置完整性 (Development Validation)
// -----------------------------------------------------------------------------

// 仅在开发环境下执行验证，避免影响生产构建性能
// 使用 process.env.NODE_ENV 而非 import.meta.env.DEV
const isDevelopment = process.env.NODE_ENV !== 'production'

if (isDevelopment) {
  // 验证中文配置
  validateLocaleConfig('zh', {
    navStructure,
    navTranslations: zhNavText,
    sidebarStructure,
    sidebarTranslations: zhSidebarText,
    searchTranslations: zhSearchText,
    uiTranslations: zhUIText,
    metadata: zhMetaData
  })
  
  // 验证英文配置
  validateLocaleConfig('en', {
    navStructure,
    navTranslations: enNavText,
    sidebarStructure,
    sidebarTranslations: enSidebarText,
    searchTranslations: enSearchText,
    uiTranslations: enUIText,
    metadata: enMetaData
  })
  
  // 验证越南语配置
  validateLocaleConfig('vi', {
    navStructure,
    navTranslations: viNavText,
    sidebarStructure,
    sidebarTranslations: viSidebarText,
    searchTranslations: viSearchText,
    uiTranslations: viUIText,
    metadata: viMetaData
  })
}

// -----------------------------------------------------------------------------
// 7. 配置组装 (Configuration Assembly)
// -----------------------------------------------------------------------------

/**
 * 利用 defineConfig 函数提供全量的 TypeScript 类型推导与智能补全。
 * 
 * 架构说明：
 * 1. 结构配置（shared/*）：定义导航、侧边栏的路由和层级关系
 * 2. 文本翻译（locales/xx/*）：提供各语言的翻译文本
 * 3. 配置合并（utils/merge-config）：将结构和翻译合并成最终配置
 * 
 * 优势：
 * - 修改结构只需改一处（shared）
 * - 新增语言只需添加翻译文件
 * - 结构和文本完全解耦，易于维护
 */
export default defineConfig({
  // 站点基础信息
  ...siteConfig,
  // SEO 与 Head 元数据
  head: seoConfig,
  
  // 国际化配置
  locales: {
    // ========== 中文（默认语言，根路径） ==========
    root: {
      label: localesConfig.root.label,
      link: localesConfig.root.link,
      
      // 元数据（包含 title, description, lang 等）
      ...zhMetaData,
      
      // 主题配置
      themeConfig: {
        // 共享配置（logo、社交链接等）
        ...themeSharedConfig,
        
        // 导航配置（结构 + 中文翻译）
        nav: mergeNav(navStructure, enNavText, ''),
        
        // 侧边栏配置（结构 + 中文翻译）
        sidebar: mergeSidebar(sidebarStructure, enSidebarText, ''),
        
        // 主题 UI 配置（页脚、404 等）
        ...mergeThemeConfig(themeSharedConfig, enUIText, editLinkPattern)
      }
    },
    
    // ========== 英文 ==========
    zh: {
      label: localesConfig.zh.label,
      link: localesConfig.zh.link,
      
      // 元数据（包含 title, description, lang 等）
      ...enMetaData,
      
      // 主题配置
      themeConfig: {
        // 共享配置
        ...themeSharedConfig,
        
        // 导航配置（结构 + 英文翻译）
        nav: mergeNav(navStructure, enNavText, 'zh'),
        
        // 侧边栏配置（结构 + 英文翻译）
        sidebar: mergeSidebar(sidebarStructure, enSidebarText, 'zh'),
        
        // 主题 UI 配置
        ...mergeThemeConfig(themeSharedConfig, enUIText, editLinkPattern)
      }
    },
    
    // ========== 越南语 ==========
    vi: {
      label: localesConfig.vi.label,
      link: localesConfig.vi.link,
      
      // 元数据（包含 title, description, lang 等）
      ...viMetaData,
      
      // 主题配置
      themeConfig: {
        // 共享配置
        ...themeSharedConfig,
        
        // 导航配置（结构 + 越南语翻译）
        nav: mergeNav(navStructure, viNavText, 'vi'),
        
        // 侧边栏配置（结构 + 越南语翻译）
        sidebar: mergeSidebar(sidebarStructure, viSidebarText, 'vi'),
        
        // 主题 UI 配置
        ...mergeThemeConfig(themeSharedConfig, viUIText, editLinkPattern)
      }
    }
  },

  // 主题与 UI 层配置（全局共享配置）
  themeConfig: {
    // 搜索配置（引擎配置 + 各语言翻译）
    search: mergeSearch(searchEngineConfig, zhSearchText, enSearchText, viSearchText)
  },

  // Markdown 配置（代码高亮、图表支持等）
  markdown: markdownConfig
})
