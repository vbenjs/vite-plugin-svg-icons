import type { OptimizeOptions } from 'svgo'

export type DomInject = 'body-first' | 'body-last'

export interface ViteSvgIconsPlugin {
  /**
   * icons folder, all svg files in it will be converted to svg sprite.
   */
  iconDirs: string[]

  /**
   * svgo configuration, used to compress svg
   * @default：true
   */
  svgoOptions?: boolean | OptimizeOptions

  /**
   * icon format
   * @default: icon-[dir]-[name]
   */
  symbolId?: string

  /**
   * icon format
   * @default: body-last
   */
  inject?: DomInject
}

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}
