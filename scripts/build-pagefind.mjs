import { spawnSync } from 'node:child_process'
import { platform, arch } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const root = process.cwd()

// 只处理 Termux (android + arm64)，其他平台全靠 pagefind 自己 npx
const isTermux = platform() === 'android' && arch() === 'arm64'

if (isTermux) {
  const bin = join(root, 'node_modules', '@pagefind', 'linux-arm64', 'bin', 'pagefind_extended')
  if (existsSync(bin)) {
    process.env.PAGEFIND_BINARY_PATH = bin
  }
}

const result = spawnSync('pnpm', ['vitepress', 'build'], {
  stdio: 'inherit',
  cwd: root,
  shell: true,
})

process.exit(result.status ?? 0)