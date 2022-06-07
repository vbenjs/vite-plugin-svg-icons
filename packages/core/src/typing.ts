import type { OptimizeOptions } from 'svgo'

export type DomInject = 'body-first' | 'body-last'

export interface ViteSvgIconsPlugin {
  /**
   * icons folder, all svg files in it will be converted to svg sprite.
   */
  iconDirs: string[] | string

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

  /**
   * custom dom id
   * @default: __svg__icons__dom__
   */
  customDomId?: string

	/**
	 * path to which a .d.ts file will be generated
	 * @default false
	 */
	dts?: string | boolean | DtsOptions
}

export interface DtsOptions {
	/**
	 * Name of the generated namespace, or false to use the global namespace.
	 * @default false
	 */
	namespace?: string | false

	/**
	 * Name of the generated type.
	 * @default "SvgIcons"
	 */
	type?: string

	/**
	 * Name of the generated declaration file.
	 * @default "icons.d.ts"
	 */
	filename?: string

	/**
	 * Custom function to generate individual icon name in the generated type.
	 */
	symbol?: (name: string) => string
}

export interface FileStats {
  relativeName: string
  mtimeMs?: number
  code: string
  symbolId?: string
}
