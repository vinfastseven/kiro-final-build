/**
 * Markdown 配置
 * 
 * 配置 Markdown 解析器的行为，包括代码高亮、图表支持等
 */

/**
 * Markdown 配置对象
 * 
 * 包含 Mermaid 图表支持的配置
 */
export const markdownConfig = {
  /**
   * 自定义 Markdown 渲染规则
   * 
   * 主要用于扩展 VitePress 默认的 Markdown 功能
   */
  config: (md: any) => {
    // ==================== Mermaid 图表支持 ====================
    
    // 保存原始的 fence 渲染规则
    const fence = md.renderer.rules.fence!
    
    // 覆盖 fence 渲染规则以支持 Mermaid
    md.renderer.rules.fence = (...args: any[]) => {
      const [tokens, idx] = args
      const token = tokens[idx]
      const lang = token.info.trim()
      
      // 如果是 mermaid 代码块，使用自定义渲染
      if (lang === 'mermaid') {
        return `<div class="mermaid-container"><pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre></div>`
      }
      
      // 其他代码块使用默认渲染
      return fence(...args)
    }
    
    // 可以在这里添加其他 Markdown 扩展
    // 例如：自定义容器、语法高亮、数学公式等
  }
}
