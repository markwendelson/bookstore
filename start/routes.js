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
Route.get('/search', 'PageController.search').as('page.search')
Route.get('/view/book/:id', 'PageController.singleItem').as('page.single-item')
Route.get('/view/book/category/:id', 'PageController.viewByCategory').as('page.book-by-category')
Route.get('/error', 'PageController.pageNotFound').as('page.notFound')
Route.post('/check-available-quantity', 'PageController.checkAvailableQuantity').as('page.check-available-quantity')

Route.group(()=> {
    Route.get('/login', 'AuthController.showLogin').as('auth.login').middleware('guest')
    Route.get('/register', 'AuthController.showRegister').as('auth.register').middleware('guest')
    Route.get('/forgot-password', 'AuthController.showForgotPassword').as('auth.forgotpassword').middleware('guest')
    Route.post('/forgot-password', 'PasswordResetController.sendResetLinkEmail').as('auth.sendResetpassword').middleware('guest')
    Route.get('/reset-password/:token', 'PasswordResetController.showResetForm').as('auth.showResetForm').middleware('guest')
    Route.post('/reset-password/', 'PasswordResetController.reset').as('auth.resetpassword').middleware('guest')
    Route.get('/change-password', 'AuthController.showChangePassword').as('auth.showChangePassword').middleware('auth')
    Route.post('/change-password', 'AuthController.changePassword').as('auth.changepassword').middleware('auth')
    Route.get('/info', 'UserController.userAccount').as('user.account').middleware('auth')
    Route.get('/cart', 'UserController.userCart').as('user.cart').middleware('auth')
    Route.get('/orders', 'UserController.userOrders').as('user.order').middleware('auth')
    Route.get('/orders/:orderCode', 'OrderController.getOrderCode').as('user.orderCode').middleware('auth')
    Route.get('/books', 'UserController.userBooks').as('user.books').middleware('auth')
    Route.post('/checkout', 'UserController.userCheckout').as('user.checkout').middleware('auth')
    Route.get('/cart/items', 'UserController.userGetCheckout').as('user.getCheckout').middleware('auth')
    Route.post('login', 'AuthController.login').middleware('guest')
    Route.post('logout', 'AuthController.logout').as('auth.logout').middleware('auth')
    Route.post('register', 'AuthController.register').as('auth.register').middleware('guest')
}).prefix('account')

Route.group(()=> {
    Route.get('list', 'UserController.index')
}).prefix('users')

Route.delete('/user/:id', 'UserController.destroy').as('user.delete').middleware('auth')
Route.get('/user/:id', 'UserController.show')
Route.put('/user/:id', 'UserController.update').as('user.update').middleware('auth')

// category
Route.group(()=> {
    Route.get('list', 'CategoryController.index').as('category.list')
    Route.get(':id', 'CategoryController.show').as('category.show')
    Route.delete(':id', 'CategoryController.destroy').as('category.delete')
    Route.post('store', 'CategoryController.store').as('category.store')
    Route.put(':id', 'CategoryController.update').as('category.update')
}).prefix('category')

// books
Route.group(()=> {
    Route.get('list', 'BookController.index').as('book.list')
    Route.get(':id', 'BookController.show').as('book.show')
    Route.delete(':id', 'BookController.destroy').as('book.delete')
    Route.post('store', 'BookController.store').as('book.store')
    Route.put(':id', 'BookController.update').as('book.update')
}).prefix('book')

// orders
Route.group(()=> {
    Route.get('list', 'OrderController.index').as('order.list')
    Route.get(':id', 'OrderController.show').as('order.show')
    Route.delete(':id', 'OrderController.destroy').as('order.delete')
    Route.post('store', 'OrderController.store').as('order.store')
    Route.put(':id', 'OrderController.update').as('order.update')
}).prefix('order')

// cart
Route.group(()=> {
    Route.get('list', 'CartController.index').as('cart.index')
    Route.get(':id', 'CartController.show').as('cart.show')
    Route.delete(':id', 'CartController.destroy').as('cart.destroy')
    Route.delete('/delete', 'CartController.deleteMultiple').as('cart.deleteMultiple')
    Route.post('store', 'CartController.store').as('cart.store')
    Route.put(':id', 'CartController.update').as('cart.update')
}).prefix('cart')

// management
Route.group(()=> {
    Route.get('category', 'CategoryController.management').as('management.category')
    Route.get('books', 'BookController.management').as('management.books')
    Route.get('books/search', 'BookController.search').as('book.search')
    Route.get('users', 'UserController.management').as('management.users')
    Route.get('users/search', 'UserController.search').as('user.search')
    Route.put('users/can_buy_and_sell/:id', 'UserController.updateBuyAndSell').as('user.can_buy_and_sell')
    Route.get('orders', 'OrderController.management').as('management.order')
    Route.put('orders/paid/:id', 'OrderController.paid').as('management.order.paid')
}).prefix('management')

// comment
Route.group(()=> {
    Route.post('store', 'CommentController.store').as('comment.store')
}).prefix('comment')
