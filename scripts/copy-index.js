import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 在 ES modules 中获取 __dirname 等效功能
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取构建环境基础路径
const IS_GITHUB = Boolean(process.env.GITHUB_ACTIONS);
const base = IS_GITHUB ? '/omninav/' : '/';

// 设置源文件和目标文件的路径
const srcPath = path.join(__dirname, '../dist/en/index.html');
const destPath = path.join(__dirname, '../dist/index.html');

try {
  console.log(`尝试从 ${srcPath} 复制到 ${destPath}`);
  
  // 检查源文件是否存在
  if (!fs.existsSync(srcPath)) {
    console.error(`源文件不存在: ${srcPath}`);
    process.exit(1);
  }
  
  // 读取并稍微修改内容
  let content = fs.readFileSync(srcPath, 'utf8');
  
  // 确保canonical链接正确指向根URL而不是/en/
  content = content.replace(
    /<link rel="canonical" href="([^"]+)\/en\//g, 
    '<link rel="canonical" href="$1/'
  );
  
  // 写入目标文件
  fs.writeFileSync(destPath, content);
  console.log('✅ 成功复制index.html到根目录');
} catch (err) {
  console.error('❌ 复制index.html失败:', err);
  process.exit(1);
}