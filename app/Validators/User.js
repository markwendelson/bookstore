'use strict'

class User {
  get rules () {
    return {
      firstname: 'required',
      middlename: 'required',
      lastname: 'required',
      contact_no: 'required',
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
  
  get messages () {
    return {
      'firstname.required': 'You must provide a firstname.',
      'middlename.required': 'You must provide a middlename.',
      'lastname.required': 'You must provide a lastname.',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password'
    }
  }

  get sanitizationRules () {
    // sanitize data before validation
  }
}

module.exports = User
