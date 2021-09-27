# vite-plugin-svg-icons

**English** | [中文](./README.zh_CN.md)

Used to generate svg sprite map.

## Feature

- **Preloading** All icons are generated when the project is running, and you only need to operate dom once.
- **High performance** Built-in cache, it will be regenerated only when the file is modified.

## Installation (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```
yarn add vite-plugin-svg-icons -D
```

or

```
npm i vite-plugin-svg-icons -D
```

## Usage

- Configuration plugin in vite.config.ts

```ts
import viteSvgIcons from 'vite-plugin-svg-icons';
import path from 'path';

export default () => {
  return {
    plugins: [
      viteSvgIcons({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  };
};
```

- Introduce the registration script in src/main.ts

```ts
import 'virtual:svg-icons-register';
```

Here the svg sprite map has been generated

## How to use in components

### **Vue way**

`/src/components/SvgIcon.vue`

```vue
<template>
  <svg aria-hidden="true">
    <use :href="symbolId" :fill="color" />
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

#### **Icons Directory Structure**

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

### **React way**

`/src/components/SvgIcon.jsx`

```jsx
export default function SvgIcon({ name, prefix = 'icon', color = '#333', ...props }) {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg {...props} aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
  );
}
```

#### **Icons Directory Structure**

```bash
# src/icons

- icon1.svg
- icon2.svg
- icon3.svg
- dir/icon1.svg
```

`/src/App.jsx`

```jsx
import SvgIcon from './components/SvgIcon';

export default function App() {
  return (
    <>
      <SvgIcon name="icon1"></SvgIcon>
      <SvgIcon name="icon1"></SvgIcon>
      <SvgIcon name="icon1"></SvgIcon>
      <SvgIcon name="dir-icon1"></SvgIcon>
    </>
  );
}
```

### Get all SymbolId

```ts
import ids from 'virtual:svg-icons-names';
// => ['icon-icon1','icon-icon2','icon-icon3']
```

### Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| iconDirs | `string[]` | - | Need to generate the icon folder of the Sprite image |
| symbolId | `string` | `icon-[dir]-[name]` | svg symbolId format, see the description below |
| svgoOptions | `boolean｜SvgoOptions` | `true` | svg compression configuration, can be an object[Options](https://github.com/svg/svgo) |

**symbolId**

`icon-[dir]-[name]`

**[name]:**

svg file name

**[dir]**

The svg of the plug-in will not generate hash to distinguish, but distinguish it by folder.

If the folder corresponding to `iconDirs` contains this other folder

example:

Then the generated SymbolId is written in the comment

```bash
# src/icons
- icon1.svg # icon-icon1
- icon2.svg # icon-icon2
- icon3.svg # icon-icon3
- dir/icon1.svg # icon-dir-icon1
- dir/dir2/icon1.svg # icon-dir-dir2-icon1
```

**Note**

Although the use of folders to distinguish between them can largely avoid the problem of duplicate names, there will also be svgs with multiple folders and the same file name in `iconDirs`.

This needs to be avoided by the developer himself

## Example

**Run**

```bash

cd ./example

yarn install

yarn dev

```

## Sample project

[Vben Admin](https://github.com/anncwb/vue-vben-admin)

## License

[MIT © Vben-2020](./LICENSE)
