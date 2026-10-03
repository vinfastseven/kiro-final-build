/**
 * 配置验证工具
 * 
 * 用于验证配置的完整性和正确性，确保：
 * 1. 所有结构配置的 ID 都有对应的翻译
 * 2. 所有语言的翻译 key 保持一致
 * 3. 防止运行时因缺少翻译而显示 ID
 */

import type { NavStructureItem } from '../shared/nav.config'
import type { SidebarGroup } from '../shared/sidebar.config'

/**
 * 验证导航翻译完整性
 * 
 * @param structure - 导航结构配置
 * @param translations - 翻译文本对象
 * @param locale - 语言标识（用于错误提示）
 * @throws 如果缺少翻译则抛出错误
 */
export function validateNavTranslations(
  structure: NavStructureItem[],
  translations: Record<string, string>,
  locale: string
): void {
  const missingKeys: string[] = []
  
  function checkItem(item: NavStructureItem) {
    // 检查当前项的翻译
    if (!translations[item.id]) {
      missingKeys.push(item.id)
    }
    
    // 递归检查子项
    if (item.items) {
      item.items.forEach(checkItem)
    }
  }
  
  structure.forEach(checkItem)
  
  if (missingKeys.length > 0) {
    throw new Error(
      `[${locale}] 导航配置缺少以下翻译键：\n${missingKeys.map(key => `  - ${key}`).join('\n')}`
    )
  }
  
  console.log(`✅ [${locale}] 导航翻译验证通过 (${Object.keys(translations).length} 个键)`)
}

/**
 * 验证侧边栏翻译完整性
 * 
 * @param structure - 侧边栏结构配置
 * @param translations - 翻译文本对象
 * @param locale - 语言标识（用于错误提示）
 * @throws 如果缺少翻译则抛出错误
 */
export function validateSidebarTranslations(
  structure: SidebarGroup[],
  translations: Record<string, string>,
  locale: string
): void {
  const missingKeys: string[] = []
  
  structure.forEach(group => {
    // 检查分组标题翻译
    if (!translations[group.groupId]) {
      missingKeys.push(group.groupId)
    }
    
    // 检查每个项的翻译
    group.items.forEach(item => {
      if (!translations[item.id]) {
        missingKeys.push(item.id)
      }
    })
  })
  
  if (missingKeys.length > 0) {
    throw new Error(
      `[${locale}] 侧边栏配置缺少以下翻译键：\n${missingKeys.map(key => `  - ${key}`).join('\n')}`
    )
  }
  
  console.log(`✅ [${locale}] 侧边栏翻译验证通过 (${Object.keys(translations).length} 个键)`)
}

/**
 * 验证搜索翻译完整性
 * 
 * @param translations - 搜索翻译对象
 * @param locale - 语言标识
 */
export function validateSearchTranslations(
  translations: any,
  locale: string
): void {
  const requiredKeys = [
    'button.buttonText',
    'button.buttonAriaLabel',
    'modal.noResultsText',
    'modal.resetButtonTitle',
    'modal.footer.selectText',
    'modal.footer.navigateText',
    'modal.footer.closeText'
  ]
  
  const missingKeys: string[] = []
  
  requiredKeys.forEach(key => {
    const keys = key.split('.')
    let current = translations
    
    for (const k of keys) {
      if (!current || !current[k]) {
        missingKeys.push(key)
        break
      }
      current = current[k]
    }
  })
  
  if (missingKeys.length > 0) {
    throw new Error(
      `[${locale}] 搜索配置缺少以下翻译键：\n${missingKeys.map(key => `  - ${key}`).join('\n')}`
    )
  }
  
  console.log(`✅ [${locale}] 搜索翻译验证通过`)
}

/**
 * 验证 UI 翻译完整性
 * 
 * @param translations - UI 翻译对象
 * @param locale - 语言标识
 */
export function validateUITranslations(
  translations: any,
  locale: string
): void {
  const requiredFields = [
    'siteTitle',
    'outline.label',
    'footer',
    'editLink.text',
    'lastUpdated.text',
    'docFooter.prev',
    'docFooter.next',
    'darkModeSwitchLabel',
    'notFound.title'
  ]
  
  const missingFields: string[] = []
  
  requiredFields.forEach(field => {
    const keys = field.split('.')
    let current = translations
    
    for (const k of keys) {
      if (!current || current[k] === undefined) {
        missingFields.push(field)
        break
      }
      current = current[k]
    }
  })
  
  if (missingFields.length > 0) {
    throw new Error(
      `[${locale}] UI 配置缺少以下字段：\n${missingFields.map(field => `  - ${field}`).join('\n')}`
    )
  }
  
  console.log(`✅ [${locale}] UI 翻译验证通过`)
}

/**
 * 验证元数据完整性
 * 
 * @param metadata - 元数据对象
 * @param locale - 语言标识
 */
export function validateMetadata(
  metadata: any,
  locale: string
): void {
  const requiredFields = ['title', 'description', 'lang']
  const missingFields = requiredFields.filter(field => !metadata[field])
  
  if (missingFields.length > 0) {
    throw new Error(
      `[${locale}] 元数据缺少以下字段：\n${missingFields.map(field => `  - ${field}`).join('\n')}`
    )
  }
  
  console.log(`✅ [${locale}] 元数据验证通过`)
}

/**
 * 验证单个语言的所有配置
 * 
 * 这是一个便捷函数，一次性验证某个语言的所有配置
 */
export function validateLocaleConfig(
  locale: string,
  config: {
    navStructure: NavStructureItem[]
    navTranslations: Record<string, string>
    sidebarStructure: SidebarGroup[]
    sidebarTranslations: Record<string, string>
    searchTranslations: any
    uiTranslations: any
    metadata: any
  }
): void {
  console.log(`\n🔍 开始验证 [${locale}] 语言配置...`)
  
  try {
    validateNavTranslations(config.navStructure, config.navTranslations, locale)
    validateSidebarTranslations(config.sidebarStructure, config.sidebarTranslations, locale)
    validateSearchTranslations(config.searchTranslations, locale)
    validateUITranslations(config.uiTranslations, locale)
    validateMetadata(config.metadata, locale)
    
    console.log(`✅ [${locale}] 所有配置验证通过\n`)
  } catch (error) {
    console.error(`\n❌ [${locale}] 配置验证失败：`)
    throw error
  }
}
