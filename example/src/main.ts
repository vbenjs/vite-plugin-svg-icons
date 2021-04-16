import { createApp } from 'vue';
import App from './App.vue';

import 'vite-plugin-svg-icons/register';

import allKeys from 'virtual:svg-icons-names';

console.log(allKeys);

const app = createApp(App);

app.mount('#app');
