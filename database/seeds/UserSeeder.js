'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    // admin user
    var firstname = 'admin'
    var middlename = 'admin'
    var lastname = 'admin'
    var contact_no = '09123456789'
    var email = 'admin@bookstore.com'
    var password = '1234567890'
    var can_buy_and_sell = '1'
    var is_admin = '1'

    const user = await User.create({
      firstname,
      middlename,
      lastname,
      contact_no,
      email,
      password,
      can_buy_and_sell,
      is_admin
  })
    
  }
}

module.exports = UserSeeder
