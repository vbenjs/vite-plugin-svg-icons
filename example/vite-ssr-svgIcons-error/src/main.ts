import './plugins';
import './app.css';
import 'virtual:svg-icons-register';
import Vue from 'vue';
import App from './App.vue';
import { Router } from 'vue-router';
import { createSSRApp } from 'vue';
import { createRouter } from './router';

export function createApp(): { app: Vue.App; router: Router } {
  const app = createSSRApp(App);
  const router = createRouter();

  app.use(router);

  return { app, router };
}
