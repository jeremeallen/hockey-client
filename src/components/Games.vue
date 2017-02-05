<template>
    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <div class="panel panel-default">
                <div class="panel-heading">Scores</div>
                <div class="panel-body">
                    <table class='table table-striped'>
                        <tr>
                            <th class='text-center'>id</th>
                            <th class='text-center'>Game time</th>
                            <th class='text-center'>Home</th>
                            <th class='text-center'>Visitor</th>
                            <th class='text-center'>Actions</th>
                        </tr>
                        <tr v-for='game in games'>
                            <td class='text-center'>{{ score.id }}</td>
                            <td class='text-center'>{{ score.date }}</td>
                            <td class='text-center'>{{ score.home.team.name }}</td>
                            <td class='text-center'>{{ score.visitor.team.name }}</td>
                            <td class='text-center'>
                                <span class="glyphicon glyphicon-pencil text-warning"
                                      aria-hidden="true"
                                      @click='editGame(game)'
                                ></span>
                                <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"
                                      @click='deleteGame(game.id)'></span>
                            </td>
                        </tr>
                    </table>
                    <button class='btn btn-primary' @click='showAddForm'>Add new game</button>

                    <form v-if='showAdd.show' class='form' @submit.prevent='saveGame'>
                        <h3>{{ showAdd.title }}</h3>
                        <div class="form-group">
                            <label for="home_team">Home Team</label>
                            <select class="form-control" v-model='team.home.team'>
                                <option
                                        v-for='team in teams'
                                        :value='team.id'
                                        v-text='team.name'
                                >
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                          <label for="home_team">Visitor Team</label>
                          <select class="form-control" v-model='team.visitor.team'>
                            <option
                                    v-for='team in teams'
                                    :value='team.id'
                                    v-text='team.name'
                            >
                            </option>
                          </select>
                        </div>
                        <button type="submit" class="btn btn-success" :disabled="isDisabled">{{ showAdd.buttonText }}</button>
                        <button class="btn btn-default" @click.prevent='showAdd.show = false'>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
        <modal title="Game Delete" :show.sync="show" @ok="ok" @cancel="cancel">
            Are you sure you wish to delete this game?
        </modal>
    </div>
</template>
<script>
  import Modal from './Modal';

  export default{
    name: 'games',
    components: {
      modal: Modal,
    },
    data() {
      return {
        sections: [],
        conferences: [],
        teams: [],
        showAdd: {
          mode: 'add',
          show: false,
          title: 'Add new game',
          buttonText: 'Add',
        },
        game: {
          start: '',
          home: {},
          visitor: {},
        },
        show: false,
        deletingId: null,
      };
    },
    created() {
      this.$http.get('http://hockey.app/games')
        .then((response) => {
          this.teams = response.data;
        });

      this.$http.get('http://hockey.app/teams')
        .then((response) => {
          this.sections = response.data;
        });

      this.$http.get('http://hockey.app/conferences')
        .then((response) => {
          this.conferences = response.data;
        });
    },
    computed: {
      isDisabled() {
        return false;
      },

      sortedTeams() {
        return this.teams.sort((a, b) => ((a.school > b.school) ? 0 : -1));
      },
    },
    methods: {
      showAddForm() {
        this.showAdd.show = true;
        this.showAdd.mode = 'add';
        this.showAdd.title = 'Add new game';
        this.team = {};
      },
      editGame(score) {
        this.showAdd.show = true;
        this.showAdd.mode = 'edit';
        this.showAdd.title = 'Edit game';
        this.showAdd.buttonText = 'Save';

        this.score = score;
      },
      saveGame() {
        let url = 'http://hockey.app/games';

        if (this.showAdd.mode === 'edit') {
          url += `/${this.game.id}`;
          this.sendPut(url, this.game);
        } else {
          this.sendPost(url, this.game);
        }
      },
      deleteGame(id) {
        this.show = true;
        this.deletingId = id;
      },
      ok() {
        this.show = false;
        this.$http.delete(`http://hockey.app/games/${this.deletingId}`)
          .then(() => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Game deleted',
            });
            this.games = this.games
                .filter(game => game.id !== this.deletingId);
            this.deletingId = null;
          });
      },
      cancel() {
        this.show = false;
        this.deletingId = null;
      },
      sendPost(url, data) {
        this.$http.post(url, data)
          .then((response) => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Game created',
            });
            this.scores.push(response.data);

            this.resetForm();
          })
          .catch((error) => {
            this.handleErrors(error);
          });
      },
      sendPut(url, data) {
        this.$http.put(url, data)
          .then((response) => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Game saved',
            });

            let gameIndex = null;
            this.games.find((game, index) => {
              if (game.id === response.data.id) {
                gameIndex = index;
                return true;
              }

              return false;
            });

            if (gameIndex) {
              this.games[gameIndex] = response.data;
            }

            this.resetForm();
          })
          .catch((error) => {
            this.handleErrors(error);
          });
      },
      handleErrors(error) {
        const messageObject = error.response.data;
        const keys = Object.keys(messageObject);
        const message = keys.map(key => messageObject[key]).join('<br />');
        this.$store.dispatch('showMessage', {
          type: 'error',
          message,
        });
      },
      resetForm() {
        this.game = game: {
          start: '',
          home: {},
          visitor: {},
        };
        this.showAdd.show = false;
      },
    },
  };

</script>