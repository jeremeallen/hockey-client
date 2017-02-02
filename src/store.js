import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// const localStorage = window.localStorage;

export default new Vuex.Store({
  state: {
    currentUser: {},
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
      if (state.currentUser) {
        return state.currentUser.token;
      }
      return false;
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
    setCurrentUser(state, user) {
      const currentState = state;
      currentState.currentUser = user;
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
    setCurrentUser(context, user) {
      context.commit('setCurrentUser', user);
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    loadCurrentUser(context) {
      if (!context.getters.isLoggedIn) {
        if (window.localStorage.getItem('user')) {
          context.commit('setCurrentUser', JSON.parse(window.localStorage.getItem('user')));
        }
      }
    },
    logout(context) {
      // Clear local storage
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('authToken');
      // Clear store
      context.commit('setCurrentUser', {});
    },
  },
});
