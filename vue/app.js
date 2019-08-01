import Vue from 'vue';
import vSelect from 'vue-select'

window.Vue = Vue;
Vue.component('v-select', vSelect)

require('./js/bootstrap')
require('./js/validator')