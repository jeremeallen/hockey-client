<template>
    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <div class="panel panel-default">
                <div class="panel-heading">Conferences</div>
                <div class="panel-body">
                    <table class='table table-striped'>
                        <tr>
                            <th class='text-center'>id</th>
                            <th class='text-center'>Name</th>
                            <th class='text-center'>Actions</th>
                        </tr>
                        <tr v-for='conference in conferences'>
                            <td class='text-center'>{{ conference.id }}</td>
                            <td class='text-center'>{{ conference.name }}</td>
                            <td class='text-center'>
                <span class="glyphicon glyphicon-pencil text-warning"
                      aria-hidden="true"
                      @click='editConference(conference)'
                ></span>
                                <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"
                                      @click='deleteConference(conference.id)'></span>
                            </td>
                        </tr>
                    </table>
                    <button class='btn btn-primary' @click='showAddForm'>Add new conference</button>

                    <form v-if='showAdd.show' class='form-inline' @submit.prevent='saveConference'>
                        <h3>{{ showAdd.title }}</h3>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" placeholder="Name" maxlength='255' v-model='conference.name'>
                        </div>
                        <button type="submit" class="btn btn-success" :disabled="isDisabled">{{ showAdd.buttonText }}</button>
                        <button class="btn btn-default" @click.prevent='showAdd.show = false'>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
        <modal title="Conference Delete" :show.sync="show" @ok="ok" @cancel="cancel">
            Are you sure you wish to delete this conference?
        </modal>
    </div>
</template>
<script>
  import Modal from './Modal';

  export default{
    name: 'conferences',
    components: {
      modal: Modal,
    },
    data() {
      return {
        conferences: [],
        showAdd: {
          mode: 'add',
          show: false,
          title: 'Add new conference',
          buttonText: 'Add',
        },
        conference: {
          name: '',
        },
        show: false,
        deletingId: null,
      };
    },
    created() {
      this.$http.get('http://hockey.app/conferences')
        .then((response) => {
          this.conferences = response.data;
        });
    },
    computed: {
      isDisabled() {
        return false;
      },

      sortedConferences() {
        return this.conferences.sort((a, b) => ((a.name > b.name) ? 0 : -1));
      },
    },
    methods: {
      showAddForm() {
        this.showAdd.show = true;
        this.showAdd.mode = 'add';
        this.showAdd.title = 'Add new conference';
        this.season = {};
      },
      editConference(conference) {
        this.showAdd.show = true;
        this.showAdd.mode = 'edit';
        this.showAdd.title = 'Edit conference';
        this.showAdd.buttonText = 'Save';

        this.conference = conference;
      },
      saveConference() {
        let url = 'http://hockey.app/conferences';

        if (this.showAdd.mode === 'edit') {
          url += `/${this.conference.id}`;
          this.sendPut(url, this.conference);
        } else {
          this.sendPost(url, this.conference);
        }
      },
      deleteConference(id) {
        this.show = true;
        this.deletingId = id;
      },
      ok() {
        this.show = false;
        this.$http.delete(`http://hockey.app/conferences/${this.deletingId}`)
          .then(() => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Conference deleted',
            });
            this.conferences = this.conferences
                .filter(conference => conference.id !== this.deletingId);
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
              message: 'Conference created',
            });
            this.conferences.push(response.data);

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
              message: 'Conference saved',
            });

            let conferenceIndex = null;
            this.conferences.find((conference, index) => {
              if (conference.id === response.data.id) {
                conferenceIndex = index;
                return true;
              }

              return false;
            });

            if (conferenceIndex) {
              this.conferences[conferenceIndex] = response.data;
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
        this.conference = {
          name: '',
        };
        this.showAdd.show = false;
      },
    },
  };

</script>