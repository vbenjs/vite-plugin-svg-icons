<template>
  <svg class="app-svg-icon" :class="$attrs.class" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script>
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'SvgIcon',
    inheritAttrs: false,
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
