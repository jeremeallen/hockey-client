import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// const localStorage = window.localStorage;

export default new Vuex.Store({
  state: {
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
  },
});
