import type { DefaultTheme, UserConfig } from 'vitepress'
import { validateEnv, getEnv } from './utils/env-validator'

// 验证环境变量（生产环境构建时会检查必需的环境变量）
// 使用 process.env.NODE_ENV 而非 import.meta.env.PROD（配置时尚未可用）
const isProduction = process.env.NODE_ENV === 'production'
validateEnv(isProduction)

/** 站点部署的基准路径 (Base URL) */
const VITE_BASE = getEnv('VITE_BASE', '/')
/** 站点生产环境完整域名 (用于 RSS、Sitemap 生成) */
const VITE_SITE_URL = getEnv('VITE_SITE_URL', 'http://localhost:5173')

/**
 * 站点配置
 * 
 * 注意：站点元数据（title, description, lang）由各语言的 locales 配置提供
 * 此处仅保留技术性配置（base, srcDir, outDir 等）
 */
export const siteConfig: UserConfig<DefaultTheme.Config> = {
  // ==================== 1. 部署配置 ====================
  /** 
   * 站点部署的基准路径 (Base URL)
   * - 部署在根域名 (https://example.com/) 时设为 '/'
   * - 部署在 GitHub Pages 或子路径 (https://example.com/docs/) 时设为 '/docs/'
   * - 建议：生产环境可通过 import.meta.env.VITE_BASE 动态读取
   */
  base: VITE_BASE,

  // ==================== 2. 路由 ====================
  cleanUrls: true,

  // ==================== 3. 构建 ====================
  srcDir: './src',
  outDir: './dist',
  ignoreDeadLinks: [
    /^https?:\/\/localhost/
  ],


  // ==================== 4. 主题 ====================
  appearance: true,
  lastUpdated: true,

  // ==================== 5. 构建钩子 ====================
  /**
   * 自动生成 sitemap.xml 供搜索引擎抓取 (SEO 核心配置)
   * - 替换为你的真实线上域名
   */
  sitemap: {
    hostname: VITE_SITE_URL
  },
  /**
  * Vite底层配置，VitePress是基于Vite构建，这里直接透传Vite配置项
  * - publicDir：指定静态资源public文件夹的位置
  * - 当前srcDir是 ./src，配置文件运行时的基准目录在 src/.vitepress
  * - public目录里面放置logo、图片等不需要编译、直接原样输出的静态资源
  * - optimizeDeps: 优化 Mermaid 依赖
  */
  vite: {
    publicDir: '../public',
    // 修复 Mermaid 模块导入问题
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
}