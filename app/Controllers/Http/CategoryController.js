'use strict'

const { validate } = use('Validator')
const Category = use('App/Models/Category')

class CategoryController {
    async index({ response }){
        const cat = await Category.all()

        return response.json({
            message: cat.count ? "category found" : "no category found",
            status: 200,
            data: cat
        });
    }
    
    async show ({ params, response }) {
        const cat = await Category.find(params.id)
        
        if (!cat) {
            return response.json({
                message: "category not found",
                status: 404,
                data: null
              });
        }

        return response.json({
            message: "category found",
            status: 200,
            data: cat
        });
    }

    async store ({ request, response }) {
        const rules = {
            category: 'required'
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

        const { category } = request.only(['category'])

        const cat = await Category.create({ category })

        return response.json({
            message: "category added",
            status: 201,
            data: cat
        });
    }

    async destroy ({ params, request, response }) {
        const cat = await Category.find(params.id)
        
        await cat.delete()

        return response.json({
            message: "category deleted",
            status: 204,
            data: null
        });
    }

    async update ({ params, request, response }) {
        const cat = await Category.find(params.id)
       
        if (!cat) {
            return response.status(404).json(null)
        }

        const rules = {
            category: 'required'
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

        const catInfo = request.only(['category'])

        cat.category = catInfo.category
       
        await cat.save()

        return response.json({
            message: "category updated",
            status: 200,
            data: cat
        });
    
    }
}

module.exports = CategoryController
