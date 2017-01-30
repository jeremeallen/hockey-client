<template>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <form>
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" placeholder="Email" name="email" v-model="user.email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" placeholder="Password" name="password" v-model="user.password">
          </div>
          <button type="submit" class="btn btn-default" @click.prevent="login">Submit</button>
        </form>
      </div>
    </div>
</template>
<script>
  export default{
    name: 'login',
    data() {
      return {
        user: {
          email: '',
          password: '',
          key: 'b99ce2788da952d4e08b1876d2ae9425',
        },
      };
    },
    methods: {
      login() {
        this.$http.post('http://hockey.app/api/authenticate', this.user)
          .then((response) => {
            this.$auth.setToken(response.data.token);
            this.$store.commit('setCurrentUser', response.data);
            this.$router.push('/');
          })
          .catch((error) => {
            if (error.response) {
              this.$store.dispatch('showMessage', {
                type: 'error',
                message: error.response.data.error,
              });
            }
          });
      },
    },
    created() {
    },
  };
</script>
<style>
</style>
