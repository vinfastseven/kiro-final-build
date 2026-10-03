/**
 * 搜索引擎配置（共享）
 * 
 * 此文件定义搜索引擎的技术参数，包括分词算法、权重配置等
 * 与语言无关的技术配置，UI 文本由各语言的翻译文件提供
 */

/**
 * 搜索引擎核心配置
 * - 基于 VitePress 内置的 MiniSearch 引擎
 * - 配置了中文分词支持
 * - 配置了模糊搜索和权重
 */
export const searchEngineConfig = {
  provider: 'local' as const,
  
  options: {
    // ==================== 1. 本地搜索引擎高级参数优化 ====================
    miniSearch: {
      /** 
       * 索引构建阶段选项 (仅支持 extractField, tokenize, processTerm)
       */
      options: {
        /**
         * 中文分词适配：解决 MiniSearch 无法对无空格中文切词的问题
         * 修复：调整了正则中 '-' 的位置，避免范围解析错误
         */
        tokenize: (term: string) => 
          term
            .split(/[\-_ \t\n\r,./\\+=="'`:;!?()（）〔〕【】《》]+/)
            .flatMap(word => word.split(/(?<=[\u4e00-\u9fa5])|(?=[\u4e00-\u9fa5])/))
            .filter(Boolean),
      },

      /**
       * 检索匹配阶段选项 (匹配规则、权重与模糊度放在这里)
       */
      searchOptions: {
        // 允许前缀匹配（如输入 "vite" 匹配 "vitepress"）
        prefix: true,
        // 模糊搜索容错度（0~1）
        fuzzy: 0.2,
        // 权重配置：标题 > 标题层级 > 文本正文
        boost: { title: 4, heading: 2, text: 1 },
      }
    }
  }
}
