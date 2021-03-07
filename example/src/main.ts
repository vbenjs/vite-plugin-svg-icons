import { createApp } from 'vue';
import App from './App.vue';

import 'vite-plugin-svg-icons/register';

import allKeys from 'vite-plugin-svg-icons/client';

console.log(allKeys);

const app = createApp(App);

app.mount('#app');
