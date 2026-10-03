/**
 * 主题共享配置
 * 
 * 此文件定义所有语言共享的主题配置
 * 包括 logo、社交链接、外部链接图标等与语言无关的配置
 */

import type { DefaultTheme } from 'vitepress'

/**
 * 主题共享配置
 * - 这些配置在所有语言版本中保持一致
 */
export const themeSharedConfig: Partial<DefaultTheme.Config> = {
  // Logo 配置（所有语言共享）
  logo: '/logo.svg',
  
  // 社交链接配置（所有语言共享）
  socialLinks: [
    { 
      icon: 'github', 
      link: 'https://github.com/your-username/your-repo' 
    }
  ],

  // 是否显示外部链接图标
  externalLinkIcon: true,

  // 页面大纲配置（所有语言共享）
  outline: {
    level: [2, 5]
  }
}

/**
 * 编辑链接配置模板
 * 实际使用时需要替换 :path 占位符
 */
export const editLinkPattern = 'https://github.com/your-username/your-repo/edit/main/src/:path'
