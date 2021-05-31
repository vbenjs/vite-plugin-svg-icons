<template>
  <h1>{{ msg }}</h1>
  <p>User Icon :</p>
  <SvgIcon name="user" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SvgIcon from '../../components/atoms/SvgIcon.vue'

export default defineComponent({
  name: 'Home',
  components: {
    SvgIcon,
  },
  setup() {
    const msg = ref<string>('Home')

    return {
      msg,
    }
  },
})
</script>

<style scoped>
svg {
  border: 1px solid black;
}
</style>
