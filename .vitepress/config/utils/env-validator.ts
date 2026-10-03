/**
 * 环境变量验证工具
 * 
 * 用于验证必需的环境变量是否正确配置
 * 防止生产环境因配置缺失导致的问题
 */

/**
 * 环境变量配置接口
 */
interface EnvConfig {
  /** 环境变量名称 */
  name: string
  /** 是否必需（生产环境） */
  required: boolean
  /** 默认值（开发环境） */
  defaultValue?: string
  /** 描述信息 */
  description: string
  /** 验证函数（可选） */
  validate?: (value: string) => boolean
}

/**
 * 环境变量配置列表
 */
const envConfigs: EnvConfig[] = [
  {
    name: 'VITE_BASE',
    required: false,
    defaultValue: '/',
    description: '站点部署的基准路径（如 /docs/）',
    validate: (value) => value.startsWith('/') && value.endsWith('/')
  },
  {
    name: 'VITE_SITE_URL',
    required: true,
    description: '站点生产环境完整域名（用于 SEO、sitemap 生成）',
    validate: (value) => /^https?:\/\/.+/.test(value)
  }
]

/**
 * 验证环境变量
 * 
 * @param isProduction - 是否为生产环境
 * @throws 如果必需的环境变量缺失或不合法
 */
export function validateEnv(isProduction: boolean = false): void {
  const errors: string[] = []
  const warnings: string[] = []
  
  console.log(`\n🔍 验证环境变量配置...`)
  console.log(`环境: ${isProduction ? '生产环境' : '开发环境'}`)
  
  envConfigs.forEach(config => {
    // 优先从 process.env 读取，回退到 import.meta.env
    let value: string | undefined
    if (typeof process !== 'undefined' && process.env) {
      value = process.env[config.name]
    } else if (typeof import.meta !== 'undefined' && import.meta.env) {
      value = import.meta.env[config.name] as string | undefined
    }
    
    // 检查必需的环境变量
    if (config.required && isProduction && !value) {
      errors.push(
        `❌ 缺少必需的环境变量: ${config.name}\n   描述: ${config.description}`
      )
      return
    }
    
    // 使用默认值或实际值
    const finalValue = value || config.defaultValue
    
    if (!finalValue) {
      if (!config.required) {
        warnings.push(
          `⚠️  环境变量未设置: ${config.name}\n   描述: ${config.description}`
        )
      }
      return
    }
    
    // 执行自定义验证
    if (config.validate && !config.validate(finalValue)) {
      errors.push(
        `❌ 环境变量格式不正确: ${config.name} = "${finalValue}"\n   描述: ${config.description}`
      )
      return
    }
    
    // 验证通过
    console.log(`✅ ${config.name} = "${finalValue}"`)
  })
  
  // 显示警告
  if (warnings.length > 0) {
    console.warn('\n⚠️  警告:')
    warnings.forEach(warning => console.warn(warning))
  }
  
  // 如果有错误，抛出异常
  if (errors.length > 0) {
    console.error('\n❌ 环境变量验证失败:')
    errors.forEach(error => console.error(error))
    
    console.error('\n💡 请在项目根目录创建对应的 .env 文件：')
    console.error('   - .env.development  (开发环境)')
    console.error('   - .env.production   (生产环境)')
    console.error('\n参考 .env.example 文件配置环境变量\n')
    
    throw new Error('环境变量验证失败，请检查配置')
  }
  
  console.log(`✅ 环境变量验证通过\n`)
}

/**
 * 获取环境变量（带默认值）
 * 
 * 优先从 process.env 读取（构建时可用），回退到 import.meta.env（运行时可用）
 * 
 * @param name - 环境变量名称
 * @param defaultValue - 默认值
 * @returns 环境变量值或默认值
 */
export function getEnv(name: string, defaultValue: string = ''): string {
  // 优先使用 process.env（构建时可用）
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name] as string
  }
  // 回退到 import.meta.env（运行时可用）
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name] as string
  }
  return defaultValue
}

/**
 * 获取必需的环境变量
 * 
 * @param name - 环境变量名称
 * @throws 如果环境变量不存在
 * @returns 环境变量值
 */
export function getRequiredEnv(name: string): string {
  // 优先从 process.env 读取
  let value: string | undefined
  if (typeof process !== 'undefined' && process.env) {
    value = process.env[name]
  } else if (typeof import.meta !== 'undefined' && import.meta.env) {
    value = import.meta.env[name] as string
  }
  
  if (!value) {
    throw new Error(
      `缺少必需的环境变量: ${name}\n` +
      `请在 .env 文件中配置该环境变量`
    )
  }
  
  return value
}
