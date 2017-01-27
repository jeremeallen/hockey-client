import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './components/Home';
import Seasons from './components/Seasons';

Vue.use(VueRouter);

const routes = [
  { path: '/dashboard', component: Home },
  { path: '/seasons', component: Seasons },
];

const router = new VueRouter({
  routes,
});

export default router;
