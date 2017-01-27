<template>
  <div id="app" class='container'>
    <app-header v-if="loggedIn" :loggedIn="loggedIn"></app-header>
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
      return true;
    },
  },
  components: {
    'app-message': Message,
    'app-header': Header,
  },
};
</script>
<style>
  body {
    padding-top: 50px;
  }
</style>
