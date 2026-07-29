import { spawnSync } from 'node:child_process'
import { platform, arch } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const root = process.cwd()
const pagefindBin = join(root, 'node_modules', '@pagefind', getPlatformDir(), 'bin', 'pagefind_extended')

function getPlatformDir() {
  const p = platform()
  const a = arch()
  if ((p === 'linux' || p === 'android') && a === 'arm64') return 'linux-arm64'
  if (p === 'linux' && a === 'x64') return 'linux-x64'
  if (p === 'darwin' && a === 'arm64') return 'darwin-arm64'
  if (p === 'darwin' && a === 'x64') return 'darwin-x64'
  if (p === 'win32' && a === 'x64') return 'win32-x64'
  return 'linux-x64' // fallback
}

if (!existsSync(pagefindBin)) {
  console.error(`Pagefind binary not found: ${pagefindBin}`)
  console.error('Run: pnpm add -D @pagefind/<platform>')
  process.exit(1)
}

process.env.PAGEFIND_BINARY_PATH = pagefindBin

const result = spawnSync('pnpm', ['vitepress', 'build'], {
  stdio: 'inherit',
  cwd: root,
  shell: true,
})

process.exit(result.status ?? 0)