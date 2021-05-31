import { createApp } from './main'

const { app, router } = createApp()

router.isReady().then(() => app.mount('#app'))
