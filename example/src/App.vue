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
