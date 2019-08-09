'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')

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

    async forgotPassword ({ view }) {
        try {
            await auth.check()
            return response.route('page.index')
        } catch (error) {
            return view.render('auth.forgotpassword')
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

        // return response.route('page.index')
        return response.json({
            message: 'Successfuly login.',
            status: 'success',
        });
    }

    async changePassword ({ params, request, response }) {
        const rules = {
            password: 'required'
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            session
              .withErrors(validation.messages())
      
            return response.json({
                message: validation.messages(),
                status: 200,
                data: null
            });
        }
        const userInfo = request.only(['password'])

        const user = await User.find(params.id)
        if (!user) {
            return response.status(404).json(null)
        }
        user.password = userInfo.password

        await user.save()
        
        return response.status(200).json(user)
    }

    async showChangePassword ({ view }) {
        return view.render('auth.change-password')
    }

    async showForgotPassword ({ view }) {
        return view.render('auth.forgotpassword')
    }

}

module.exports = AuthController
