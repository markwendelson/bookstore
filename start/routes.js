'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'PageController.index').as('page.index')

Route.group(()=> {
    Route.get('/login', 'AuthController.showLogin').as('auth.login').middleware('guest')
    Route.get('/register', 'AuthController.showRegister').as('auth.register').middleware('guest')
    Route.get('/forgot-password', 'AuthController.forgotPassword').as('auth.forgotpassword').middleware('auth')
    Route.get('/change-password', 'AuthController.changePassword').as('auth.changepassword').middleware('auth')
    Route.get('/account', 'UserController.userAccount').as('user.account').middleware('auth')
    Route.get('/cart', 'UserController.userCart').as('user.cart').middleware('auth')
    Route.get('/cart', 'UserController.userCart').as('user.cart').middleware('auth')
    Route.post('/checkout', 'UserController.userCheckout').as('user.checkout').middleware('auth')
    Route.get('/checkout', 'UserController.userGetCheckout').as('user.checkout').middleware('auth')
    Route.post('login', 'AuthController.login').middleware('guest')
    Route.post('logout', 'AuthController.logout').as('auth.logout').middleware('auth')
    Route.post('register', 'AuthController.register').as('auth.register').middleware('guest')
}).prefix('account')

Route.group(()=> {
    Route.get('list', 'UserController.index')
}).prefix('users')

Route.get('/user/:id', 'UserController.show')

// category
Route.group(()=> {
    Route.get('list', 'CategoryController.index')
    Route.get(':id', 'CategoryController.show')
    Route.delete(':id', 'CategoryController.destroy')
    Route.post('store', 'CategoryController.store')
    Route.put(':id', 'CategoryController.update')
}).prefix('category')

// books
Route.group(()=> {
    Route.get('list', 'BookController.index')
    Route.get(':id', 'BookController.show')
    Route.delete(':id', 'BookController.destroy')
    Route.post('store', 'BookController.store')
    Route.put(':id', 'BookController.update')
}).prefix('book')

// orders
Route.group(()=> {
    Route.get('list', 'OrderController.index')
    Route.get(':id', 'OrderController.show')
    Route.delete(':id', 'OrderController.destroy')
    Route.post('store', 'OrderController.store')
    Route.put(':id', 'OrderController.update')
}).prefix('order')

// cart 
Route.group(()=> {
    Route.get('list', 'CartController.index')
    Route.get(':id', 'CartController.show')
    Route.delete(':id', 'CartController.destroy')
    Route.post('store', 'CartController.store')
    Route.put(':id', 'CartController.update')
}).prefix('cart')

// management
Route.group(()=> {
    Route.on('/category').render('management.category')
    Route.on('/books').render('management.books')
    Route.on('/users').render('management.users')
}).prefix('management')

