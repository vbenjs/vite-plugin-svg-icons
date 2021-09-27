# vite-plugin-svg-icons

**中文** | [English](./README.md)

用于生成 svg 雪碧图.

## 特征

- **预加载** 在项目运行时就生成所有图标,只需操作一次 dom
- **高性能** 内置缓存,仅当文件被修改时才会重新生成

## 安装 (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```
yarn add vite-plugin-svg-icons -D
```

or

```
npm i vite-plugin-svg-icons -D
```

## 使用

- vite.config.ts 中的配置插件

```ts
import viteSvgIcons from 'vite-plugin-svg-icons';
import path from 'path';

export default () => {
  return {
    plugins: [
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  };
};
```

- 在 src/main.ts 内引入注册脚本

```ts
import 'virtual:svg-icons-register';
```

到这里 svg 雪碧图已经生成

## 如何在组件使用

**Vue 方式**

`/src/components/SvgIcon.vue`

```vue
<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script>
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#333',
      },
    },
    setup(props) {
      const symbolId = computed(() => `#${props.prefix}-${props.name}`);
      return { symbolId };
    },
  });
</script>
```

**icons 目录结构**

```bash
# src/icons

- icon1.svg
- icon2.svg
- icon3.svg
- dir/icon1.svg
```

`/src/App.vue`

```vue
<template>
  <div>
    <SvgIcon name="icon1"></SvgIcon>
    <SvgIcon name="icon2"></SvgIcon>
    <SvgIcon name="icon3"></SvgIcon>
    <SvgIcon name="dir-icon1"></SvgIcon>
  </div>
</template>

<script>
  import { defineComponent, computed } from 'vue';

  import SvgIcon from './components/SvgIcon.vue';
  export default defineComponent({
    name: 'App',
    components: { SvgIcon },
  });
</script>
```

React 使用方式一样。只需修改组件为 Jsx 组件即可

### 获取所有 SymbolId

```ts
import ids from 'virtual:svg-icons-names';
// => ['icon-icon1','icon-icon2','icon-icon3']
```

### 配置说明

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| iconDirs | `string[]` | - | 需要生成雪碧图的图标文件夹 |
| symbolId | `string` | `icon-[dir]-[name]` | svg 的 symbolId 格式，见下方说明 |
| svgoOptions | `boolean｜SvgoOptions` | `true` | svg 压缩配置，可以是对象[Options](https://github.com/svg/svgo) |

**symbolId**

`icon-[dir]-[name]`

**[name]:**

svg 文件名

**[dir]**

该插件的 svg 不会生成 hash 来区分，而是通过文件夹来区分.

如果`iconDirs`对应的文件夹下面包含这其他文件夹

例：

则生成的 SymbolId 为注释所写

```bash
# src/icons
- icon1.svg # icon-icon1
- icon2.svg # icon-icon2
- icon3.svg # icon-icon3
- dir/icon1.svg # icon-dir-icon1
- dir/dir2/icon1.svg # icon-dir-dir2-icon1
```

**注意**

虽然用文件夹来区分已经可以很大程度避免重名问题了,但是也会出现`iconDirs`包含多个文件夹，且文件名一样的 svg.

这个需要开发者自己规避下

## 示例

**运行示例**

```bash

cd ./example

yarn install

yarn dev

```

## 示例项目

[Vben Admin](https://github.com/anncwb/vue-vben-admin)

## License

[MIT © Vben-2020](./LICENSE)
