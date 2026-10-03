/**
 * 配置合并工具
 * 
 * 将 shared 配置结构和各语言的翻译文本合并成 VitePress 需要的最终配置
 */

import type { DefaultTheme } from 'vitepress'
import type { NavStructureItem } from '../shared/nav.config'
import type { SidebarGroup } from '../shared/sidebar.config'

/**
 * 合并导航配置
 * 
 * @param structure - 导航结构（来自 shared/nav.config.ts）
 * @param texts - 导航文本翻译（来自 locales/xx/nav.ts）
 * @param locale - 语言代码（'' 表示根路径，'en' 表示 /en/，'vi' 表示 /vi/）
 * @returns VitePress 导航配置
 */
export function mergeNav(
  structure: NavStructureItem[],
  texts: Record<string, string>,
  locale: string = ''
): DefaultTheme.NavItem[] {
  const localePrefix = locale ? `/${locale}` : ''
  
  return structure.map(item => {
    // 处理下拉菜单
    if (item.items) {
      return {
        text: texts[item.id] || item.id,
        items: item.items.map(subItem => ({
          text: texts[subItem.id] || subItem.id,
          link: subItem.external ? subItem.link! : `${localePrefix}${subItem.link}`
        }))
      } as DefaultTheme.NavItemWithChildren
    }
    
    // 处理普通链接
    return {
      text: texts[item.id] || item.id,
      link: item.external ? item.link! : `${localePrefix}${item.link}`
    } as DefaultTheme.NavItemWithLink
  })
}

/**
 * 合并侧边栏配置
 * 
 * @param structure - 侧边栏结构（来自 shared/sidebar.config.ts）
 * @param texts - 侧边栏文本翻译（来自 locales/xx/sidebar.ts）
 * @param locale - 语言代码
 * @returns VitePress 侧边栏配置
 */
export function mergeSidebar(
  structure: SidebarGroup[],
  texts: Record<string, string>,
  locale: string = ''
): DefaultTheme.SidebarItem[] {
  const localePrefix = locale ? `/${locale}` : ''
  
  return structure.map(group => ({
    text: texts[group.groupId] || group.groupId,
    collapsed: group.collapsed,
    items: group.items.map(item => ({
      text: texts[item.id] || item.id,
      link: `${localePrefix}${item.link}`
    }))
  }))
}

/**
 * 合并搜索配置
 * 
 * @param engineConfig - 搜索引擎配置（来自 shared/search.config.ts）
 * @param zhSearchText - 中文搜索文本
 * @param enSearchText - 英文搜索文本
 * @param viSearchText - 越南语搜索文本
 * @returns VitePress 搜索配置
 */
export function mergeSearch(
  engineConfig: any,
  zhSearchText: any,
  enSearchText: any,
  viSearchText: any
): any {
  return {
    ...engineConfig,
    options: {
      ...engineConfig.options,
      locales: {
        root: {
          translations: zhSearchText
        },
        en: {
          translations: enSearchText
        },
        vi: {
          translations: viSearchText
        }
      }
    }
  }
}

/**
 * 合并主题配置
 * 
 * 重构说明：将原来的单一大函数拆分为多个职责清晰的小函数
 * 遵循单一职责原则，便于维护和扩展
 * 
 * @param sharedConfig - 共享主题配置（来自 shared/theme.config.ts）
 * @param uiTexts - UI 文本翻译（来自 locales/xx/ui.ts）
 * @param editLinkPattern - 编辑链接模板
 * @returns VitePress 主题配置
 */
export function mergeThemeConfig(
  sharedConfig: Partial<DefaultTheme.Config>,
  uiTexts: any,
  editLinkPattern: string
): Partial<DefaultTheme.Config> {
  return {
    ...sharedConfig,
    
    // 站点标题
    siteTitle: uiTexts.siteTitle,
    
    // 页面大纲配置
    ...mergeOutlineConfig(sharedConfig, uiTexts),
    
    // 页脚配置
    footer: uiTexts.footer,
    
    // 编辑链接配置
    ...mergeEditLinkConfig(editLinkPattern, uiTexts),
    
    // 最后更新时间配置
    ...mergeLastUpdatedConfig(uiTexts),
    
    // 文档页脚配置
    docFooter: uiTexts.docFooter,
    
    // 其他 UI 文本
    ...mergeUILabels(uiTexts),
    
    // 404 页面配置
    notFound: uiTexts.notFound
  }
}

/**
 * 合并页面大纲配置
 */
function mergeOutlineConfig(
  sharedConfig: Partial<DefaultTheme.Config>,
  uiTexts: any
): Pick<DefaultTheme.Config, 'outline'> {
  const baseOutline = sharedConfig.outline as Record<string, any> || {}
  return {
    outline: {
      ...baseOutline,
      label: uiTexts.outline.label
    }
  }
}

/**
 * 合并编辑链接配置
 */
function mergeEditLinkConfig(
  editLinkPattern: string,
  uiTexts: any
): Pick<DefaultTheme.Config, 'editLink'> {
  return {
    editLink: {
      pattern: editLinkPattern,
      text: uiTexts.editLink.text
    }
  }
}

/**
 * 合并最后更新时间配置
 */
function mergeLastUpdatedConfig(
  uiTexts: any
): Pick<DefaultTheme.Config, 'lastUpdated'> {
  return {
    lastUpdated: {
      text: uiTexts.lastUpdated.text,
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
}

/**
 * 合并 UI 标签配置
 * 包括暗色模式切换、侧边栏菜单、返回顶部等标签
 */
function mergeUILabels(uiTexts: any) {
  return {
    darkModeSwitchLabel: uiTexts.darkModeSwitchLabel,
    lightModeSwitchTitle: uiTexts.lightModeSwitchTitle,
    darkModeSwitchTitle: uiTexts.darkModeSwitchTitle,
    sidebarMenuLabel: uiTexts.sidebarMenuLabel,
    returnToTopLabel: uiTexts.returnToTopLabel
  }
}
