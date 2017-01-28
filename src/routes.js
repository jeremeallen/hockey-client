import Vue from 'vue';
import VueRouter from 'vue-router';

import Conferences from './components/Conferences';
import Home from './components/Home';
import Seasons from './components/Seasons';
import Sections from './components/Sections';

Vue.use(VueRouter);

const routes = [
  { path: '/conferences', component: Conferences },
  { path: '/dashboard', component: Home },
  { path: '/seasons', component: Seasons },
  { path: '/sections', component: Sections },
];

const router = new VueRouter({
  routes,
});

export default router;
