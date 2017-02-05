<template>
    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <div class="panel panel-default">
                <div class="panel-heading">Games</div>
                <div class="panel-body">
                    <table class='table table-striped'>
                        <tr>
                          <th class='text-center'>id</th>
                          <th class='text-center'>Game Time</th>
                          <th class='text-center'>Home Team</th>
                          <th class='text-center'>Visitor Team</th>
                          <th class='text-center'>Actions</th>
                        </tr>
                        <tr v-for='game in games'>
                            <td class='text-center'>{{ game.id }}</td>
                            <td class='text-center'>{{ displayGameTime(game.start) }}</td>
                            <td class='text-center'>{{ getSchoolName(game.home_team) }}</td>
                            <td class='text-center'>{{ getSchoolName(game.visitor_team) }}</td>
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
                        <label for="start_date">Game Day</label>
                        <datepicker format='yyyy//MM/dd' input-class='form-control' v-model='game.startDate'></datepicker>
                      </div>
                      <div class="form-group">
                        <label for="start_time">Game Time</label>
                        <vue-timepicker
                                format="hh:mm A"
                                :minute-interval="30"
                                v-model="game.startTime">
                        </vue-timepicker>
                      </div>
                        <div class="form-group">
                            <label for="home_team">Home Team</label>
                            <select class="form-control" v-model='game.home_id'>
                                <option
                                        v-for='team in teams'
                                        :value='team.id'
                                        v-text='getSchoolName(team)'
                                >
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                          <label for="home_team">Visitor Team</label>
                          <select class="form-control" v-model='game.visitor_id'>
                            <option
                                    v-for='team in teams'
                                    :value='team.id'
                                    v-text='getSchoolName(team)'
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
  // https://github.com/charliekassel/vuejs-datepicker
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';
  // https://github.com/phoenixwong/vue2-timepicker
  import VueTimepicker from 'vue2-timepicker';
  import Modal from './Modal';

  export default{
    name: 'games',
    components: {
      modal: Modal,
      datepicker: Datepicker,
      VueTimepicker,
    },
    data() {
      return {
        sections: [],
        conferences: [],
        teams: [],
        games: [],
        showAdd: {
          mode: 'add',
          show: false,
          title: 'Add new game',
          buttonText: 'Add',
        },
        game: {
          start: '',
          home_id: null,
          visitor_id: null,
          startTime: {
            hh: '07',
            mm: '30',
            A: 'pm',
          },
          startDate: moment().format('YYYY/MM/DD'),
        },
        show: false,
        deletingId: null,
      };
    },
    created() {
      this.$http.get('http://hockey.app/games')
        .then((response) => {
          this.games = response.data;
        });

      this.$http.get('http://hockey.app/teams')
        .then((response) => {
          this.teams = response.data;
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
      displayGameTime(gameStart) {
        return moment(gameStart).format('h:mm a, M/D/Y');
      },
      getSchoolName(team) {
        if (!team || !team.school || !team.name) {
          return '';
        }

        return `${team.school} ${team.name}`;
      },
      showAddForm() {
        this.showAdd.show = true;
        this.showAdd.mode = 'add';
        this.showAdd.title = 'Add new game';
        this.team = {};
      },
      editGame(game) {
        this.showAdd.show = true;
        this.showAdd.mode = 'edit';
        this.showAdd.title = 'Edit game';
        this.showAdd.buttonText = 'Save';

        this.game = game;
      },
      saveGame() {
        let url = 'http://hockey.app/games';

        const tempDate = moment(this.game.startDate);
        tempDate.hour(this.game.startTime.hh);
        tempDate.minutes(this.game.startTime.mm);

        // Update the model to support the datetime format
        this.game.start = tempDate.format('YYYY/MM/DD HH:mma Z');

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
            this.games.push(response.data);

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
        this.game = {
          start: '',
          home: {},
          visitor: {},
        };
        this.showAdd.show = false;
      },
    },
  };

</script>