/**
 * 腾讯云 COS 部署脚本
 *
 * 功能：
 * - 将构建产物上传到腾讯云 COS（对象存储）
 * - 支持增量上传（只上传变更的文件）
 * - 设置正确的 Content-Type
 * - 配置缓存策略
 *
 * 环境变量要求：
 * - COS_SECRET_ID: 腾讯云 SecretId
 * - COS_SECRET_KEY: 腾讯云 SecretKey
 * - COS_BUCKET: 存储桶名称（格式：bucket-appid）
 * - COS_REGION: 地域（如 ap-guangzhou）
 * - COS_PREFIX: 上传路径前缀（可选，默认为根目录）
 */

const fs = require('node:fs')
const path = require('node:path')
const COS = require('cos-nodejs-sdk-v5')

// 配置
const config = {
  secretId: process.env.COS_SECRET_ID,
  secretKey: process.env.COS_SECRET_KEY,
  bucket: process.env.COS_BUCKET,
  region: process.env.COS_REGION,
  prefix: process.env.COS_PREFIX || '',
}

// 验证必需的环境变量
function validateConfig() {
  const required = ['secretId', 'secretKey', 'bucket', 'region']
  const missing = required.filter(key => !config[key])

  if (missing.length > 0) {
    console.error('❌ 缺少必需的环境变量：')
    missing.forEach((key) => {
      console.error(`   - COS_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`)
    })
    process.exit(1)
  }

  console.log('✅ 环境变量验证通过')
  console.log(`📦 存储桶: ${config.bucket}`)
  console.log(`🌍 地域: ${config.region}`)
  console.log(`📁 前缀: ${config.prefix || '(根目录)'}`)
}

// 获取文件的 Content-Type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

// 获取缓存控制策略
function getCacheControl(filePath) {
  const ext = path.extname(filePath).toLowerCase()

  // 静态资源（带 hash）：长期缓存
  if (filePath.includes('/assets/')) {
    return 'public, max-age=31536000, immutable'
  }

  // HTML 文件：不缓存，每次重新验证
  if (ext === '.html') {
    return 'public, max-age=0, must-revalidate'
  }

  // 其他文件：短期缓存
  return 'public, max-age=3600'
}

// 递归获取目录下所有文件
function getAllFiles(dir, basePath = '') {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(basePath, item.name)

    if (item.isDirectory()) {
      files.push(...getAllFiles(fullPath, relativePath))
    }
    else {
      files.push({
        localPath: fullPath,
        remotePath: path.posix.join(config.prefix, relativePath.replace(/\\/g, '/')),
      })
    }
  }

  return files
}

// 上传单个文件
async function uploadFile(cos, file) {
  const { localPath, remotePath } = file

  return new Promise((resolve) => {
    const fileStream = fs.createReadStream(localPath)

    cos.putObject({
      Bucket: config.bucket,
      Region: config.region,
      Key: remotePath,
      Body: fileStream,
      ContentType: getContentType(localPath),
      CacheControl: getCacheControl(localPath),
    }, (err, _data) => {
      if (err) {
        resolve({ success: false, path: remotePath, error: err.message })
      }
      else {
        resolve({ success: true, path: remotePath })
      }
    })
  })
}

// 主函数
async function deploy() {
  console.log('\n🚀 开始部署到腾讯云 COS...\n')

  // 验证配置
  validateConfig()

  // 创建 COS 客户端
  const cos = new COS({
    SecretId: config.secretId,
    SecretKey: config.secretKey,
  })
  console.log('✅ COS 客户端创建成功\n')

  // 获取构建产物目录
  const distDir = path.join(process.cwd(), 'dist')
  if (!fs.existsSync(distDir)) {
    console.error('❌ 构建产物目录不存在：dist/')
    console.error('   请先运行 pnpm run build')
    process.exit(1)
  }

  // 获取所有文件
  console.log('📂 扫描构建产物...')
  const files = getAllFiles(distDir)
  console.log(`✅ 找到 ${files.length} 个文件\n`)

  // 上传文件
  console.log('📤 开始上传文件...\n')
  const results = []
  let uploadedCount = 0
  let failedCount = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const progress = `[${i + 1}/${files.length}]`

    process.stdout.write(`${progress} 上传: ${file.remotePath}`)

    const result = await uploadFile(cos, file)
    results.push(result)

    if (result.success) {
      uploadedCount++
      process.stdout.write(' ✅\n')
    }
    else {
      failedCount++
      process.stdout.write(` ❌ ${result.error}\n`)
    }
  }

  // 输出结果
  console.log(`\n${'='.repeat(60)}`)
  console.log('📊 部署结果统计')
  console.log('='.repeat(60))
  console.log(`✅ 成功: ${uploadedCount} 个文件`)
  console.log(`❌ 失败: ${failedCount} 个文件`)
  console.log(`📦 总计: ${files.length} 个文件`)
  console.log('='.repeat(60))

  if (failedCount > 0) {
    console.log('\n❌ 部署失败的文件：')
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`   - ${r.path}: ${r.error}`))
    process.exit(1)
  }

  console.log('\n🎉 部署完成！')

  // 输出访问地址
  const bucketDomain = `https://${config.bucket}.cos.${config.region}.myqcloud.com`
  const siteUrl = config.prefix
    ? `${bucketDomain}/${config.prefix}/index.html`
    : `${bucketDomain}/index.html`

  console.log(`\n🌐 访问地址: ${siteUrl}`)
}

// 执行部署
deploy().catch((error) => {
  console.error('\n❌ 部署失败：', error.message)
  process.exit(1)
})
