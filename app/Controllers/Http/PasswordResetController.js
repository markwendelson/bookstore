'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('randomstring')
const Mail = use('Mail')
const Hash = use('Hash')

class PasswordResetController {

    async sendResetLinkEmail ({ request, session, response }) {
        // validate form inputs
        const validation = await validate(request.only('email'), {
          email: 'required|email'
        })
    
        if (validation.fails()) {
          session.withErrors(validation.messages()).flashAll()
    
          return response.json({
              message: validation.messages(),
              status: 'error',
              data: null
          });
        }
    
          // get user
          const user = await User.findBy('email', request.input('email'))
    
          await PasswordReset.query().where('email', user.email).delete()
    
          const { token } = await PasswordReset.create({
            email: user.email,
            token: randomString.generate(40)
          })
    
          const Env = use('Env')
          const appUrl = Env.get('APP_URL');
    
          const mailData = {
            user: user.toJSON(),
            token,
            appUrl
          }

          await Mail.send('emails.password_reset', mailData, message => {
            message
              .to(user.email)
              .from('support@essu-bookstore.com')
              .subject('Password reset link')
          })
    
          return response.json({
              message: 'A password reset link has been sent to your email address.',
              status: 'success',
              data: user
          });
        
      }

      async showResetForm ({ params, view }) {
        const data = await PasswordReset.query().where('token', params.token).first()
        if (!data) {
            return view.render('pages.error404')
        } else {
            return view.render('auth.reset-password', { data })
        }
      }
    
      async reset ({ request, session, response }) {
        // validate form inputs
        const validation = await validateAll(request.all(), {
          token: 'required',
          email: 'required',
          password: 'required'
        })
    
        if (validation.fails()) {
          session
            .withErrors(validation.messages())
    
          return response.json({
              message: validation.messages(),
              status: 'error',
              data: null
          });
        }

        const { token, email, password } = request.only([
          'token',
          'email',
          'password'
      ])
    
          // get user by the provider email
          const user = await User.findBy('email', email)
    
          // check if password reet token exist for user
          const data = await PasswordReset.query()
            .where('email', user.email)
            .where('token', token)
            .first()
    
          if (!data) {
            // display error message
            return response.json({
                message: 'This password reset token does not exist.',
                status: 'error',
                data: null
            });
          }
    
          user.password = password
          await user.save()
    
          // delete password reset token
          await PasswordReset.query().where('email', user.email).delete()
    
          // display success message
          return response.json({
            message: 'Your password has been reset!',
            status: 'success',
            data: null
        });
    
      }
}

module.exports = PasswordResetController
