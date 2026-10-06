import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.join(__dirname, '..', 'app')

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (entry.name.endsWith('.tsx')) files.push(full)
  }
  return files
}

for (const file of walk(appDir)) {
  let content = fs.readFileSync(file, 'utf8')
  if (!content.includes('TopNavbar') && !content.includes('MobileNavbar')) continue

  const original = content
  content = content
    .replace(/^import TopNavbar from '@\/components\/navigation\/TopNavbar'\n/m, '')
    .replace(/^import MobileNavbar from '@\/components\/navigation\/MobileNavbar'\n/m, '')
    .replace(/^\s*{\/\* Top Navigation \*\/}\s*\n\s*<TopNavbar \/>\s*\n/m, '')
    .replace(/^\s*<TopNavbar \/>\s*\n/m, '')
    .replace(/^\s*{\/\* Mobile Bottom Navigation \*\/}\s*\n\s*<MobileNavbar \/>\s*\n/m, '')
    .replace(/^\s*<MobileNavbar \/>\s*\n/m, '')
    .replace(/\s*className="pt-16 pb-20 lg:pb-6 h-screen"/g, ' className="min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-4rem)]"')
    .replace(/\s*className="pt-16 pb-20 lg:pb-6"/g, '')
    .replace(/\s*className="pt-16 pb-20 lg:pb-8"/g, '')

  if (content !== original) {
    fs.writeFileSync(file, content)
    console.log('Updated', path.relative(appDir, file))
  }
}
