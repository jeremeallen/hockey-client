<template>
    <div class="row">
        <div class='col-md-12'>
            <div class="alert" :class="alert_type" role="alert" v-if="show_message">{{ message.message }}</div>
        </div>
    </div>
</template>
<script>
  export default{
    name: '',
    data() {
      return {
        alert_message: 'This is a message',
      };
    },
    props: [
      'message',
    ],
    computed: {
      alert_type() {
        if (this.message.type === 'error') {
          return 'alert-danger';
        }

        return 'alert-success';
      },
      show_message() {
        return this.message.display;
      },
    },
  };
</script>
<style>
</style>
