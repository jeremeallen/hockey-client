<template>
    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <div class="panel panel-default">
                <div class="panel-heading">Sections</div>
                <div class="panel-body">
                    <table class='table table-striped'>
                        <tr>
                            <th class='text-center'>id</th>
                            <th class='text-center'>Name</th>
                            <th class='text-center'>Actions</th>
                        </tr>
                        <tr v-for='section in sections'>
                            <td class='text-center'>{{ section.id }}</td>
                            <td class='text-center'>{{ section.name }}</td>
                            <td class='text-center'>
                <span class="glyphicon glyphicon-pencil text-warning"
                      aria-hidden="true"
                      @click='editSection(section)'
                ></span>
                                <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true"
                                      @click='deleteSection(section.id)'></span>
                            </td>
                        </tr>
                    </table>
                    <button class='btn btn-primary' @click='showAddForm'>Add new section</button>

                    <form v-if='showAdd.show' class='form-inline' @submit.prevent='saveSection'>
                        <h3>{{ showAdd.title }}</h3>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" placeholder="Name" maxlength='255' v-model='section.name'>
                        </div>
                        <button type="submit" class="btn btn-success" :disabled="isDisabled">{{ showAdd.buttonText }}</button>
                        <button class="btn btn-default" @click.prevent='showAdd.show = false'>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
        <modal title="Section Delete" :show.sync="show" @ok="ok" @cancel="cancel">
            Are you sure you wish to delete this section?
        </modal>
    </div>
</template>
<script>
  import Modal from './Modal';

  export default{
    name: 'sections',
    components: {
      modal: Modal,
    },
    data() {
      return {
        sections: [],
        showAdd: {
          mode: 'add',
          show: false,
          title: 'Add new section',
          buttonText: 'Add',
        },
        section: {
          name: '',
        },
        show: false,
        deletingId: null,
      };
    },
    created() {
      this.$http.get('http://hockey.app/sections')
        .then((response) => {
          this.conferences = response.data;
        });
    },
    computed: {
      isDisabled() {
        return false;
      },

      sortedSections() {
        return this.sections.sort((a, b) => ((a.name > b.name) ? 0 : -1));
      },
    },
    methods: {
      showAddForm() {
        this.showAdd.show = true;
        this.showAdd.mode = 'add';
        this.showAdd.title = 'Add new section';
        this.season = {};
      },
      editSection(section) {
        this.showAdd.show = true;
        this.showAdd.mode = 'edit';
        this.showAdd.title = 'Edit section';
        this.showAdd.buttonText = 'Save';

        this.section = section;
      },
      saveSection() {
        let url = 'http://hockey.app/sections';

        if (this.showAdd.mode === 'edit') {
          url += `/${this.section.id}`;
          this.sendPut(url, this.section);
        } else {
          this.sendPost(url, this.section);
        }
      },
      deleteSection(id) {
        this.show = true;
        this.deletingId = id;
      },
      ok() {
        this.show = false;
        this.$http.delete(`http://hockey.app/sections/${this.deletingId}`)
          .then(() => {
            this.$store.dispatch('showMessage', {
              type: 'success',
              message: 'Section deleted',
            });
            this.sections = this.sections
                .filter(section => section.id !== this.deletingId);
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
              message: 'Section created',
            });
            this.sections.push(response.data);

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
              message: 'Section saved',
            });

            let sectionIndex = null;
            this.sections.find((section, index) => {
              if (section.id === response.data.id) {
                sectionIndex = index;
                return true;
              }

              return false;
            });

            if (sectionIndex) {
              this.sections[sectionIndex] = response.data;
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
        this.section = {
          name: '',
        };
        this.showAdd.show = false;
      },
    },
  };

</script>