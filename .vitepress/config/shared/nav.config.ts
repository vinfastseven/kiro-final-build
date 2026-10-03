/**
 * 导航结构配置（共享）
 * 
 * 此文件定义导航的结构、路由和层级关系，与语言无关
 * 文本内容由各语言的翻译文件提供
 */

export interface NavStructureItem {
  /** 导航项的唯一标识，用于匹配翻译文本 */
  id: string
  /** 路由链接 */
  link?: string
  /** 子菜单项（下拉菜单） */
  items?: NavStructureItem[]
  /** 是否为外部链接 */
  external?: boolean
}

/**
 * 导航结构配置
 * - id: 与翻译文件中的 key 对应
 * - link: 路由路径（会根据语言自动添加前缀）
 * - items: 存在时表示这是一个下拉菜单
 * - external: 外部链接不添加语言前缀
 */
export const navStructure: NavStructureItem[] = [
  {
    id: 'home',
    link: '/'
  },
  {
    id: 'examples',
    link: '/markdown-examples'
  },
  {
    id: 'api',
    link: '/api-examples'
  },
  {
    id: 'mermaid',
    link: '/mermaid-examples'
  },
  {
    id: 'juejin',
    link: 'https://juejin.cn',
    external: true
  }
]
