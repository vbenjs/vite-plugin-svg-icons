import type { Plugin } from 'vite';
import type { Options as SvgoOptions } from 'svgo';

import fg from 'fast-glob';
import getEtag from 'etag';

// @ts-ignore
import { optimize } from 'svgo';
import fs from 'fs-extra';
import path from 'path';
import { debug as Debug } from 'debug';
import { SVG_DOM_ID, SVG_ICONS_CLIENT, SVG_ICONS_NAME } from './constants';
import { normalizePath } from 'vite';
// @ts-ignore
import SVGCompiler from 'svg-baker';

const debug = Debug('vite-plugin-svg-icons');

export interface ViteSvgIconsPlugin {
  /**
   * icons folder, all svg files in it will be converted to svg sprite.
   */
  iconDirs: string[];
  /**
   * svgo configuration, used to compress svg
   * @default：true
   */
  svgoOptions?: boolean | SvgoOptions;
  /**
   * icon format
   * @default: icon-[dir]-[name]
   */
  symbolId?: string;
}

interface FileStats {
  relativeName: string;
  mtimeMs?: number;
  code: string;
  symbolId?: string;
}

export default (opt: ViteSvgIconsPlugin): Plugin => {
  const cache = new Map<string, FileStats>();
  let isBuild = false;

  const options = {
    svgoOptions: true,
    symbolId: 'icon-[dir]-[name]',
    ...opt,
  };

  let { svgoOptions } = options;
  const { symbolId } = options;
  if (!symbolId.includes('[name]')) {
    throw new Error('SymbolId must contain [name] string!');
  }

  if (svgoOptions) {
    svgoOptions = typeof svgoOptions === 'boolean' ? {} : svgoOptions;
  }

  debug('plugin options:', options);

  return {
    name: 'vite:svg-icons',
    configResolved(resolvedConfig) {
      isBuild = resolvedConfig.isProduction || resolvedConfig.command === 'build';
      debug('resolvedConfig:', resolvedConfig);
    },
    resolveId(importee) {
      if (importee === SVG_ICONS_NAME || importee === SVG_ICONS_CLIENT) {
        return importee;
      }
      return null;
    },

    async load(id) {
      if (!isBuild) return null;
      const isRegister = id.endsWith(SVG_ICONS_NAME);
      const isClient = id.endsWith(SVG_ICONS_CLIENT);
      const { code, idSet } = await createModuleCode(cache, svgoOptions as SvgoOptions, options);
      if (isRegister) {
        return code;
      }
      if (isClient) {
        return idSet;
      }
    },
    configureServer: ({ middlewares }) => {
      middlewares.use(async (req, res, next) => {
        const url = normalizePath(req.url!);
        const registerId = `/@id/${SVG_ICONS_NAME}`;
        const clientId = `/@id/${SVG_ICONS_CLIENT}`;
        if ([clientId, registerId].some((item) => url.endsWith(item))) {
          res.setHeader('Content-Type', 'application/javascript');
          res.setHeader('Cache-Control', 'no-cache');
          const { code, idSet } = await createModuleCode(
            cache,
            svgoOptions as SvgoOptions,
            options
          );
          const content = url.endsWith(registerId) ? code : idSet;

          res.setHeader('Etag', getEtag(content, { weak: true }));
          res.statusCode = 200;
          res.end(content);
        } else {
          next();
        }
      });
    },
  };
};

export async function createModuleCode(
  cache: Map<string, FileStats>,
  svgoOptions: SvgoOptions,
  options: ViteSvgIconsPlugin
) {
  const { insertHtml, idSet } = await compilerIcons(cache, svgoOptions, options);
  const code = `
         document.addEventListener('DOMContentLoaded', () => {
          let body = document.body;
          let svgDom = document.getElementById('${SVG_DOM_ID}');
          if(!svgDom) {
            svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgDom.style.display = 'none';
            svgDom.id = '${SVG_DOM_ID}';
          }
          svgDom.innerHTML = ${JSON.stringify(insertHtml)};
          body.insertBefore(svgDom, body.firstChild);
        });
        `;
  return {
    code: `${code}\nexport default {}`,
    idSet: `export default ${JSON.stringify(Array.from(idSet))}`,
  };
}

/**
 * Preload all icons in advance
 * @param cache
 * @param options
 */
export async function compilerIcons(
  cache: Map<string, FileStats>,
  svgOptions: SvgoOptions,
  options: ViteSvgIconsPlugin
) {
  const { iconDirs } = options;

  let insertHtml = '';
  const idSet = new Set<string>();

  for (const dir of iconDirs) {
    const svgFilsStats = fg.sync('**/*.svg', { cwd: dir, stats: true, absolute: true });

    for (const entry of svgFilsStats) {
      const { path, stats: { mtimeMs } = {} } = entry;
      const cacheStat = cache.get(path);
      let svgSymbol;
      let symbolId;
      let relativeName = '';

      const getSymbol = async () => {
        relativeName = normalizePath(path).replace(normalizePath(dir + '/'), '');
        symbolId = createSymbolId(relativeName, options);
        svgSymbol = await compilerIcon(path, symbolId, svgOptions);
        idSet.add(symbolId);
      };

      if (cacheStat) {
        if (cacheStat.mtimeMs !== mtimeMs) {
          await getSymbol();
        } else {
          svgSymbol = cacheStat.code;
          symbolId = cacheStat.symbolId;
          symbolId && idSet.add(symbolId);
        }
      } else {
        await getSymbol();
      }

      svgSymbol &&
        cache.set(path, {
          mtimeMs,
          relativeName,
          code: svgSymbol,
          symbolId,
        });
      insertHtml += `${svgSymbol || ''}`;
    }
  }
  return { insertHtml, idSet };
}

export async function compilerIcon(
  file: string,
  symbolId: string,
  svgOptions: SvgoOptions
): Promise<string | null> {
  if (!file) return null;

  let content = fs.readFileSync(file, 'utf-8');

  if (svgOptions) {
    const { data } = await optimize(content, svgOptions);
    content = data;
  }
  const svgSymbol = await new SVGCompiler().addSymbol({
    id: symbolId,
    content,
    path: file,
  });
  return svgSymbol.render();
}

export function createSymbolId(name: string, options: ViteSvgIconsPlugin) {
  const { symbolId } = options;

  if (!symbolId) {
    return name;
  }

  let id = symbolId;
  let fName = name;

  const { fileName = '', dirName } = discreteDir(name);
  if (symbolId.includes('[dir]')) {
    id = id.replace(/\[dir\]/g, dirName);
    if (!dirName) {
      id = id.replace('--', '-');
    }
    fName = fileName;
  }
  id = id.replace(/\[name\]/g, fName);
  return id.replace(path.extname(id), '');
}

export function discreteDir(name: string) {
  if (!normalizePath(name).includes('/')) {
    return {
      fileName: name,
      dirName: '',
    };
  }

  const strList = name.split('/');

  const fileName = strList.pop();
  const dirName = strList.join('-');
  return { fileName, dirName };
}
