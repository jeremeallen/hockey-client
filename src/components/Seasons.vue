<template>
  <div class='row'>
    <div class='col-md-8 col-md-offset-2'>
      <div class="panel panel-default">
        <div class="panel-heading">Seasons</div>
        <div class="panel-body">
          <table class='table table-striped'>
            <tr>
              <th class='text-center'>id</th>
              <th class='text-center'>Start</th>
              <th class='text-center'>End</th>
              <th class='text-center'>Actions</th>
            </tr>
            <tr v-for='season in sortedSeasons'>
              <td class='text-center'>{{ season.id }}</td>
              <td class='text-center'>{{ season.start_year }}</td>
              <td class='text-center'>{{ season.end_year }}</td>
              <td class='text-center'>
                <span class="glyphicon glyphicon-pencil text-warning"
                      aria-hidden="true"
                      @click='editSeason(season)'
                ></span>
                <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"
                      @click='deleteSeason(season.id)'></span>
              </td>
            </tr>
          </table>
          <button class='btn btn-primary' @click='showAddForm'>Add new season</button>

          <form v-if='showAdd.show' class='form-inline' @submit.prevent='saveSeason'>
            <h3>{{ showAdd.title }}</h3>
            <div class="form-group">
              <label for="startYear">Start Year</label>
              <input type="text" class="form-control" placeholder="Start Year" maxlength='4' v-model='season.start_year'>
            </div>
            <div class="form-group">
              <label for="endYear">End Year</label>
              <input type="text" class="form-control" placeholder="End Year" maxlength='4' v-model='season.end_year'>
            </div>
            <button type="submit" class="btn btn-success" :disabled="isDisabled">{{ showAdd.buttonText }}</button>
            <button class="btn btn-default" @click.prevent='showAdd.show = false'>Cancel</button>
          </form>
        </div>
      </div>
    </div>
    <modal title="Season Delete" :show.sync="show" @ok="ok" @cancel="cancel">
      Are you sure you wish to delete this season?
    </modal>
  </div>
</template>
<script>
  import Modal from './Modal';

  export default{
    name: 'seasons',
    components: {
      modal: Modal,
    },
    data() {
      return {
        seasons: [],
        showAdd: {
          mode: 'add',
          show: false,
          title: 'Add new season',
          buttonText: 'Add',
        },
        season: {
          start_year: '',
          end_year: '',
        },
        show: false,
        deletingId: null,
      };
    },
    created() {
      this.$http.get('http://hockey.app/seasons')
        .then((response) => {
          this.seasons = response.data;
        });
    },
    computed: {
      isDisabled() {
        return false;
      },

      sortedSeasons() {
        return this.seasons.sort((a, b) => ((a.start_year > b.start_year) ? 0 : -1));
      },
    },
    methods: {
      showAddForm() {
        this.showAdd.show = true;
        this.showAdd.mode = 'add';
        this.showAdd.title = 'Add new season';
        this.season = {};
      },
      editSeason(season) {
        this.showAdd.show = true;
        this.showAdd.mode = 'edit';
        this.showAdd.title = 'Edit season';
        this.showAdd.buttonText = 'Save';

        this.season = season;
      },
      saveSeason() {
        let url = 'http://hockey.app/seasons';

        if (this.showAdd.mode === 'edit') {
          url += `/${this.season.id}`;
          this.sendPut(url, this.season);
        } else {
          this.sendPost(url, this.season);
        }
      },
      deleteSeason(id) {
        this.show = true;
        this.deletingId = id;
      },
      ok() {
        this.show = false;
        this.$http.delete(`http://hockey.app/seasons/${this.deletingId}`)
          .then(() => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Season deleted',
            });
            this.seasons = this.seasons.filter(season => season.id !== this.deletingId);
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
              message: 'Season created',
            });
            this.seasons.push(response.data);

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
              message: 'Season saved',
            });

            let seasonIndex = null;
            this.seasons.find((season, index) => {
              if (season.id === response.data.id) {
                seasonIndex = index;
                return true;
              }

              return false;
            });

            if (seasonIndex) {
              this.seasons[seasonIndex] = response.data;
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
        this.season = {
          start_year: '',
          end_year: '',
        };
        this.showAdd.show = false;
      },
    },
  };

</script>