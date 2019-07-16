'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')

class AuthController {
    async showLogin ({ view }) {
        return view.render('auth.login')
    }

    async showRegister ({ view }) {
        return view.render('auth.register')
    }

    async forgotPassword ({ view }) {
        return view.render('auth.forgotpassword')
    }

    async login ({ auth, request }) {
        const { email, password } = request.all()
        await auth.attempt(email, password)
    
        return 'Logged in successfully'
    }

    async logout ({ auth }) {
        await auth.logout()

        return 'Logged out successfully'
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
                status: 200,
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

        await User.create({
            firstname,
            middlename,
            lastname,
            contact_no,
            email,
            password
        })

        return response.status(201).send({ message: 'Registration successful' })
    }

    async login ({ request, response, auth }) {
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
                data: null
            });
        }

        const { email, password } = request.only([ 'email', 'password'])

        const user = await auth.attempt(email, password)

        return response.json({
            message: "login success",
            status: 200,
            data: user
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
