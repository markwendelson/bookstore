'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Cart = use('App/Models/Cart')
const Hash = use('Hash')
var randomstring = require("randomstring")

class AuthController {
    async showLogin ({ auth, response, view }) {
        try {
            await auth.check()
            return response.route('page.index')
        } catch (error) {
            return view.render('auth.login')
        }
    }

    async showRegister ({ view }) {
        try {
            await auth.check()
            return response.route('page.index')
        } catch (error) {
            return view.render('auth.register')
        }
    }

    async logout ({ auth, response }) {
        await auth.logout()

        return response.route('page.index')
    }

    async register ({ request, session, response }) {
        const rules = {
            firstname: 'required',
            middlename: 'required',
            lastname: 'required',
            email: 'required|email|unique:users',
            password: 'required'
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
              .withErrors(validation.messages())

            return response.json({
                message: validation.messages(),
                status: 'error',
                data: null
            });
        }

        const { firstname, middlename, lastname, contact_no, email, password } = request.only([
            'firstname',
            'middlename',
            'lastname',
            'contact_no',
            'email',
            'password'
        ])

        const user = await User.create({
            firstname,
            middlename,
            lastname,
            contact_no,
            email,
            password
        })

        if (user) {
            return response.json({
                message: 'Registration successful',
                status: 'success',
                data: user
            });
        } else {
            return response.json({
                message: 'Registration not successful',
                status: 'error',
                data: user
            });
        }
    }

    async login ({ request, response, session, auth }) {
        const rules = {
            email: 'required|email',
            password: 'required'
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
              .withErrors(validation.messages())

            return response.json({
                message: validation.messages(),
                status: 200,
            });
        }

        const { email, password } = request.only([ 'email', 'password'])

        const user = await auth.attempt(email, password)

        if (!user.can_buy_and_sell) {
          await auth.logout()
          return response.json({
              message: 'Invalid login.',
              status: 'error',
          });
        }

        return response.json({
            message: 'Successfuly login.',
            status: 'success',
        });
    }

    async changePassword ({ params, request, session, response, auth }) {
        const rules = {
            password: 'required',
            current_password: 'required'
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
              .withErrors(validation.messages())

            return response.json({
                message: validation.messages(),
                status: 'error',
                data: null
            });
        }
        const userInfo = request.only(['password', 'current_password'])

        const user = await User.find(auth.user.id)

        if (!user.password == Hash.make(userInfo.current_password)) {
            return response.json({
                message: 'Invalid current password',
                status: 'error',
                data: null
            });
        }
        user.password = userInfo.password


        await user.save()

        return response.json({
            message: 'Password changed successfully.',
            status: 'success',
            data: user
        });
    }

    async showChangePassword ({ view, auth }) {
        let cart = await Cart.query().with('book').where('user_id',auth.user.id).fetch()
        cart = cart.toJSON()
        return view.render('auth.change-password', { cart })
    }

    async showForgotPassword ({ view }) {
        return view.render('auth.forgotpassword')
    }

}

module.exports = AuthController
