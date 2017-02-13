<template>
    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <div class="panel panel-default">
                <div class="panel-heading">Scores</div>
                <div class="panel-body">
                    <table class='table table-striped'>
                        <tr>
                            <th class='text-center'>id</th>
                            <th class='text-center'>Home</th>
                            <th class='text-center'>Home Score</th>
                            <th class='text-center'>Visitor</th>
                            <th class='text-center'>Visitor Score</th>
                            <th class='text-center'>Actions</th>
                        </tr>
                        <tr v-for='score in scores'>
                            <td class='text-center'>{{ score.id }}</td>
                            <td class='text-center'>{{ score.date }}</td>
                            <td class='text-center'>{{ score.home.team.name }}</td>
                            <td class='text-center'>{{ score.home.score }}</td>
                            <td class='text-center'>{{ score.visitor.team.name }}</td>
                            <td class='text-center'>{{ score.visitor.score }}</td>
                            <td class='text-center'>
                                <span class="glyphicon glyphicon-pencil text-warning"
                                      aria-hidden="true"
                                      @click='editScore(score)'
                                ></span>
                                <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"
                                      @click='deleteScore(score.id)'></span>
                            </td>
                        </tr>
                    </table>
                    <button class='btn btn-primary' @click='showAddForm'>Add new score</button>

                    <form v-if='showAdd.show' class='form' @submit.prevent='saveScore'>
                        <h3>{{ showAdd.title }}</h3>
                        <div class="form-group">
                            <label for="home-team">Home team</label>
                            <input type="text" class="form-control" placeholder="Home Team" maxlength='255' v-model='score.home.team.name'>
                        </div>
                        <div class="form-group">
                            <label for="name">Score</label>
                            <input type="text" class="form-control" placeholder="Team name" maxlength='255' v-model='team.name'>
                        </div>
                        <div class="form-group">
                            <label for="conference">Conference</label>
                            <select class="form-control" v-model='team.conference_id'>
                                <option
                                        v-for='conference in conferences'
                                        :value='conference.id'
                                        v-text='conference.name'
                                >
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="conference">Section</label>
                            <select class="form-control" v-model='team.section_id'>
                                <option
                                        v-for='section in sections'
                                        :value='section.id'
                                        v-text='section.name'
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
        <modal title="Team Delete" :show.sync="show" @ok="ok" @cancel="cancel">
            Are you sure you wish to delete this team?
        </modal>
    </div>
</template>
<script>
  import Modal from './Modal';

  export default{
    name: 'scores',
    components: {
      modal: Modal,
    },
    data() {
      return {
        sections: [],
        conferences: [],
        teams: [],
        scores: [],
        showAdd: {
          mode: 'add',
          show: false,
          title: 'Add new score',
          buttonText: 'Add',
        },
        score: {
          school: '',
          name: '',
          conference_id: '',
          section_id: '',
        },
        show: false,
        deletingId: null,
      };
    },
    created() {
      this.$http.get('http://hockey.app/api/scores')
        .then((response) => {
          this.scores = response.data;
        });

      this.$http.get('http://hockey.app/sections')
        .then((response) => {
          this.sections = response.data;
        });

      this.$http.get('http://hockey.app/conferences')
        .then((response) => {
          this.conferences = response.data;
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
      showAddForm() {
        this.showAdd.show = true;
        this.showAdd.mode = 'add';
        this.showAdd.title = 'Add new score';
        this.team = {};
      },
      editScore(score) {
        this.showAdd.show = true;
        this.showAdd.mode = 'edit';
        this.showAdd.title = 'Edit score';
        this.showAdd.buttonText = 'Save';

        this.score = score;
      },
      saveScore() {
        let url = 'http://hockey.app/api/scores';

        if (this.showAdd.mode === 'edit') {
          url += `/${this.score.id}`;
          this.sendPut(url, this.score);
        } else {
          this.sendPost(url, this.score);
        }
      },
      deleteScore(id) {
        this.show = true;
        this.deletingId = id;
      },
      ok() {
        this.show = false;
        this.$http.delete(`http://hockey.app/scores/${this.deletingId}`)
          .then(() => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Score deleted',
            });
            this.scores = this.scores
                .filter(score => score.id !== this.deletingId);
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
              message: 'Score created',
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
              message: 'Score saved',
            });

            let teamIndex = null;
            this.teams.find((team, index) => {
              if (team.id === response.data.id) {
                teamIndex = index;
                return true;
              }

              return false;
            });

            if (teamIndex) {
              this.teams[teamIndex] = response.data;
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
        this.score = {
          school: '',
          name: '',
          conference_id: '',
          section_id: '',
        };
        this.showAdd.show = false;
      },
    },
  };

</script>