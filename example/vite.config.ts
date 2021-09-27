import { UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import viteSvgIcons from '../dist/index';
import path from 'path';

export default (): UserConfigExport => {
  return {
    plugins: [
      vue(),
      jsx(),
      viteSvgIcons({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // icon symbolId
        // default
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  };
};
