<template>
  <div id="app" class='container'>
    <app-message :message="message"></app-message>
    <router-view></router-view>
  </div>
</template>

<script>
import Message from './components/Message';

export default {
  name: 'app',
  computed: {
    message() {
      return this.$store.getters.getMessage;
    },
  },
  components: {
    'app-message': Message,
  },
};
</script>
