import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
import App from './App';
import router from './routes';
import store from './store';

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
