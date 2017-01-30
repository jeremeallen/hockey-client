import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './components/auth/Login';
import Conferences from './components/Conferences';
import Home from './components/Home';
import Seasons from './components/Seasons';
import Sections from './components/Sections';
import Teams from './components/Teams';

Vue.use(VueRouter);

const routes = [
  { path: '/auth/login', component: Login },
  { path: '/conferences', component: Conferences },
  { path: '/dashboard', component: Home },
  { path: '/seasons', component: Seasons },
  { path: '/sections', component: Sections },
  { path: '/teams', component: Teams },
];

const router = new VueRouter({
  routes,
});

export default router;
