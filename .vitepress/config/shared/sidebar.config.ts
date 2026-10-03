/**
 * 侧边栏结构配置（共享）
 * 
 * 此文件定义侧边栏的结构、分组和层级关系，与语言无关
 * 文本内容由各语言的翻译文件提供
 */

export interface SidebarGroupItem {
  /** 侧边栏项的唯一标识，用于匹配翻译文本 */
  id: string
  /** 路由链接 */
  link: string
}

export interface SidebarGroup {
  /** 分组的唯一标识，用于匹配翻译文本 */
  groupId: string
  /** 是否默认折叠 */
  collapsed?: boolean
  /** 分组下的项目列表 */
  items: SidebarGroupItem[]
}

/**
 * 侧边栏结构配置
 * - groupId: 分组标识，与翻译文件中的 key 对应
 * - collapsed: 是否默认折叠（可选，默认 false）
 * - items: 分组下的文档项
 *   - id: 文档项标识，与翻译文件中的 key 对应
 *   - link: 路由路径（会根据语言自动添加前缀）
 */
export const sidebarStructure: SidebarGroup[] = [
  {
    groupId: 'examples',
    collapsed: false,
    items: [
      {
        id: 'markdown-examples',
        link: '/markdown-examples'
      },
      {
        id: 'api-examples',
        link: '/api-examples'
      },
      {
        id: 'mermaid-examples',
        link: '/mermaid-examples'
      }
    ]
  }
]
