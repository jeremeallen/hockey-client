<template>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li><router-link to="/">Dashboard</router-link></li>
                    <router-link to="/games" tag='li' active-class='active'><a>Games</a></router-link>
                    <router-link to="/conferences" tag='li' active-class='active'><a>Conferences</a></router-link>
                    <router-link to="/seasons" tag='li' active-class='active'><a>Seasons</a></router-link>
                    <router-link to="/sections" tag='li' active-class='active'><a>Sections</a></router-link>
                    <router-link to="/teams" tag='li' active-class='active'><a>Teams</a></router-link>
                    <router-link to="/scores" tag='li' active-class='active'><a>Scores</a></router-link>
                </ul>
                <ul class="nav navbar-nav navbar-right ">
                    <ul class="nav navbar-nav">
                        <li><a href='' @click="logout">{{ user.name }} - Logout</a></li>
                    </ul>
                </ul>
            </div><!--/.nav-collapse -->

        </div>
    </nav>
</template>
<script>
  export default{
    name: 'header',
    data() {
      return {
        menus: {
          attendanceMenuOpen: false,
          scheduleMenuOpen: false,
          requestMenuOpen: false,
          configMenuOpen: false,
          profileMenuOpen: false,
        },
      };
    },
    props: [
      'loggedIn',
      'user',
    ],
    methods: {
      logout() {
        this.$store.dispatch('logout');
        this.$router.push('/auth/login');
      },
    },
  };
</script>
<style lang="sass">
    ul.navbar-nav > li { line-height: 50px; text-transform: uppercase; }
</style>
