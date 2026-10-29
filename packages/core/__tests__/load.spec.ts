import fg from 'fast-glob'
import { fileURLToPath, URL } from 'url'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { PluginContext } from 'rollup'
import { ResolvedConfig } from 'vite'
import { createSvgIconsPlugin } from '../src/index'

// 初始化构建或开发环境，直接验证插件加载钩子的输出和目录扫描次数。
function createLoadHook(command: 'build' | 'serve') {
  const plugin = createSvgIconsPlugin({
    iconDirs: [fileURLToPath(new URL('./fixtures', import.meta.url))],
    svgoOptions: false,
  })
  plugin.configResolved!({ command } as ResolvedConfig)
  return plugin.load!.bind({} as PluginContext)
}

// 每个用例独立统计扫描，避免相邻用例的调用记录相互影响。
afterEach(() => {
  vi.restoreAllMocks()
})

// 覆盖构建、开发及 SSR 组合，保留既有虚拟模块匹配和返回行为。
describe('load hook', () => {
  for (const command of ['build', 'serve'] as const) {
    for (const options of [undefined, { ssr: true }]) {
      test(`${command} (ssr=${options?.ssr}) skips unrelated modules without scanning icons`, async () => {
        const scan = vi.spyOn(fg, 'sync')
        const load = createLoadHook(command)
        // eslint-disable-next-line no-useless-catch -- 保留原始异步错误交给测试框架报告。
        try {
          for (const id of [
            '/src/main.ts',
            '/src/App.vue',
            '/src/style.css',
            '/node_modules/example/index.js',
            '\0other-plugin:module',
          ]) {
            const result = await load(id, options)
            expect(scan).not.toHaveBeenCalled()
            expect(result).toBeNull()
          }
        } catch (error) {
          throw error
        }
      })

      test(`${command} (ssr=${options?.ssr}) preserves virtual module output`, async () => {
        const scan = vi.spyOn(fg, 'sync')
        const load = createLoadHook(command)
        // eslint-disable-next-line no-useless-catch -- 保留原始异步错误交给测试框架报告。
        try {
          for (const prefix of ['', '\0']) {
            const register = await load(
              `${prefix}virtual:svg-icons-register`,
              options,
            )
            const names = await load(
              `${prefix}virtual:svg-icons-names`,
              options,
            )
            // 构建产出真实图标模块，开发 SSR 返回空模块，其余开发请求由中间件处理。
            if (command === 'build') {
              expect(register).toContain('<symbol')
              expect(register).toContain('icon-test')
              expect(names).toBe('export default ["icon-test"]')
            } else if (options?.ssr) {
              expect(register).toBe('export default {}')
              expect(names).toBe('export default {}')
            } else {
              expect(register).toBeNull()
              expect(names).toBeNull()
            }
          }
          expect(scan).toHaveBeenCalledTimes(command === 'build' ? 4 : 0)
        } catch (error) {
          throw error
        }
      })
    }
  }
})
