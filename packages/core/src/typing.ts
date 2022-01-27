import type { OptimizeOptions } from 'svgo'

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
}

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}
