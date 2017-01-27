<script>

export default {
  props: {
    show: {
      type: Boolean,
      twoWay: true,
      default: false,
    },
    title: {
      type: String,
      default: 'Modal',
    },
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    force: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: String,
      default: 'modal',
    },
    // 确认按钮text
    okText: {
      type: String,
      default: 'OK',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    okClass: {
      type: String,
      default: 'btn blue',
    },
    cancelClass: {
      type: String,
      default: 'btn red btn-outline',
    },
    closeWhenOK: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      duration: null,
    };
  },
  computed: {
    showModal() {
      return this.show;
    },
    modalClass() {
      return {
        'modal-lg': this.large,
        'modal-sm': this.small,
        'modal-full': this.full,
      };
    },
  },
  created() {
    if (this.showModal) {
      window.document.body.className += ' modal-open';
    }
  },
  beforeDestroy() {
    window.document.body.className = window.document.body.className.replace(/\s?modal-open/, '');
  },
  watch: {
    showModal(value) {
      if (value) {
        window.document.body.className += ' modal-open';
      } else {
        if (!this.duration) {
          this.duration = window.getComputedStyle(this.$refs.dialog)['transition-duration'].replace('s', '') * 1000;
        }
        window.setTimeout(() => {
          window.document.body.className = window.document.body.className.replace(/\s?modal-open/, '');
        }, this.duration || 0);
      }
    },
  },
  methods: {
    ok() {
      this.$emit('ok');
    },
    cancel() {
      this.$emit('cancel');
    },
    clickMask() {
      if (!this.force) {
        this.cancel();
      }
    },
  },
};

</script>

<template>
  <div v-show="show" :transition="transition">
    <div class="modal" @click.self="clickMask">
      <div class="modal-dialog" :class="modalClass" ref=dialog>
        <div class="modal-content">
          <!--Header-->
          <div class="modal-header">
            <slot name="header">
              <a type="button" class="close" @click="cancel">x</a>
              <h4 class="modal-title">
                <slot name="title">
                  {{title}}
                </slot>
              </h4>
            </slot>
          </div>
          <!--Container-->
          <div class="modal-body">
            <slot></slot>
          </div>
          <!--Footer-->
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" :class="cancelClass" @click="cancel">{{cancelText}}</button>
              <button type="button" :class="okClass" class="btn-primary" @click="ok">{{okText}}</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop in"></div>
  </div>
</template>

<style scoped>
    .modal {
        display: block;
    }
    .modal-transition {
        transition: all .6s ease;
    }
    .modal-leave {
        /* 样式没什么用，但可以让根标签的transitionEnd生效，以去掉modal-leave */
        border-radius: 1px !important;
    }
    .modal-transition .modal-dialog, .modal-transition .modal-backdrop {
        transition: all .5s ease;
    }
    .modal-enter .modal-dialog, .modal-leave .modal-dialog {
        opacity: 0;
        transform: translateY(-30%);
    }
    .modal-enter .modal-backdrop, .modal-leave .modal-backdrop {
        opacity: 0;
    }

</style>