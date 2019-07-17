import Vue from 'vue'
import VeeValidate from 'vee-validate'
import _includes from 'lodash/includes'

window.Validator = VeeValidate.Validator

window.Validator.extend('credit_card_type', (value) => {
  const validCardBrands = ['visa', 'mastercard']
  const valid = window.cardValidator.number(value)
  const type = valid.card ? valid.card.type : ''

  return _includes(validCardBrands, type)
})

Vue.use(VeeValidate, {
  events: 'input|blur'
})
