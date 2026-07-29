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

// 构建成功后自动应用 pagefind exact-search 补丁
if (result.status === 0) {
  const patchResult = spawnSync('node', ['scripts/patch-pagefind.mjs'], {
    stdio: 'inherit',
    cwd: root,
    shell: true,
  })
  if (patchResult.status !== 0) {
    console.error('Pagefind patch failed!')
    process.exit(patchResult.status ?? 1)
  }
}

process.exit(result.status ?? 0)