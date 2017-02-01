import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// const localStorage = window.localStorage;

export default new Vuex.Store({
  state: {
    currentUser: {},
    loggedIn: false,
    message: {
      type: 'error',
      message: '',
      display: false,
    },
  },
  getters: {
    getMessage(state) {
      return state.message;
    },
    isLoggedIn(state) {
      return state.loggedIn;
    },
    getCurrentUser(state) {
      return state.currentUser;
    },
  },
  mutations: {
    displayMessage(state, message) {
      const currentState = state;
      const userMessage = message;
      userMessage.display = true;
      currentState.message = userMessage;
    },
    removeMessage(state) {
      const currentState = state;
      currentState.message = {};
    },
    setLoggedIn(state, loggedIn) {
      const currentState = state;
      currentState.loggedIn = loggedIn;
    },
  },
  actions: {
    showMessage(context, message) {
      const currentContext = context;
      const userMessage = message;
      userMessage.display = true;
      currentContext.commit('displayMessage', message);

      setTimeout(() => {
        currentContext.commit('removeMessage');
      }, 3000);
    },
    setLoggedIn(context, auth) {
      context.commit('setLoggedIn', auth.token);
      window.localStorage.setItem('user', JSON.stringify(auth));
    },
  },
});
