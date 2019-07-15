'use strict'

const User = use('App/Models/User')
const Category = use('App/Models/Category')

class PageController {
   async index({ view }){
        let categories = await Category.all()
        categories = categories.toJSON()
        
        return view.render('pages.index', { categories })
    }
}

module.exports = PageController
