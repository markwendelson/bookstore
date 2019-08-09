import Vue from 'vue'
import VeeValidate from 'vee-validate'
import _includes from 'lodash/includes'

window.Validator = VeeValidate.Validator

Vue.use(VeeValidate, {
  events: 'input|blur'
})
