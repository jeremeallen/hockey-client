import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
import App from './App';
import Auth from './plugins/Auth';
import router from './routes';
import store from './store';


Vue.prototype.$http = axios;
Vue.use(Auth);

router.beforeEach((to, from, next) => {
  // If a guest can access this resource, proceed
  if (!to.meta.allowGuest && !Vue.auth.loggedIn()) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    });
  }

  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
