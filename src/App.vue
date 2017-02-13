<template>
  <div id="app" class='container'>
    <app-header v-if="loggedIn" :loggedIn="loggedIn" :user="user"></app-header>
    <app-message :message="message"></app-message>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header';
import Message from './components/Message';

export default {
  name: 'app',
  computed: {
    message() {
      return this.$store.getters.getMessage;
    },
    loggedIn() {
      return this.$auth.loggedIn();
    },
    user() {
      return this.$store.getters.getCurrentUser;
    },
  },
  components: {
    'app-message': Message,
    'app-header': Header,
  },
  created() {
    this.$store.dispatch('loadCurrentUser');
  },
};
</script>
<style>
  body {
    padding-top: 50px;
  }

  td.action-items {
    font-size: 20px
  }
</style>
