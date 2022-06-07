import { throttle } from 'throttle-debounce'
import type { DtsOptions } from './typing'
import path from 'path'
import fs from 'fs'

export const generateDtsThrottled = throttle(500, generateDts)

export function generateDts(idSet: Set<string>, options?: string | true | DtsOptions) {
	let filepath = 'icons.d.ts'
	let namespace: false | string = false
	let type = 'SvgIcons'
	let symbol = (name: string) => name

	if (typeof options === 'object') {
		filepath = options.filename ?? filepath
		namespace = options.namespace ?? namespace
		type = options.type ?? type
		symbol = options.symbol ?? symbol
	}

	if (typeof options === 'string') {
		filepath = options
	}

	const dts = `export {}
declare ${namespace ? `namespace ${namespace}` : 'global'} {
  type ${type} = ${Array.from(idSet).map((name) => `"${symbol(name)}"`).join(' | ')}
}`

	fs.writeFileSync(path.resolve(process.cwd(), filepath), dts, 'utf-8')
}
