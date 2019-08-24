'use strict'

const { validate } = use('Validator')
const Comments = use('App/Models/Comment')

class CommentController {
    async index({ response }){
        const comment = await Comments.all()

        return response.json({
            message: comment.count ? "comment found" : "no comment found",
            status: 200,
            data: comment
        });
    }
    
    async show ({ params, response }) {
        const comment = await Comments.find(params.id)
        
        if (!comment) {
            return response.json({
                message: "comment not found",
                status: 404,
                data: null
              });
        }

        return response.json({
            message: "comment found",
            status: 200,
            data: comment
        });
    }

    async store ({ request, response, auth, session }) {
        const rules = {
            comment: 'required'
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

        const { book_id, comment } = request.only([
            'book_id',
            'comment'
        ])

        const user_id = auth.user.id
        const posted_by = auth.user.firstname
        const userComment = await Comments.create({ 
            book_id, 
            user_id, 
            posted_by,
            comment 
        })

        return response.json({
            message: "Comment successfully added",
            status: 'success',
            data: userComment
        });
    }

    async destroy ({ params, request, response }) {
        const comment = await Comments.find(params.id)
        
        await comment.delete()

        return response.json({
            message: "comment deleted",
            status: 204,
            data: null
        });
    }

    async update ({ params, request, response }) {
        const comment = await Comments.find(params.id)
       
        if (!comment) {
            return response.status(404).json(null)
        }

        const rules = {
            comment: 'required'
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

        const commentInfo = request.only(['comment'])

        comment.comment = commentInfo.comment
       
        await comment.save()

        return response.json({
            message: "comment updated",
            status: 200,
            data: cat
        });
    
    }

}

module.exports = CommentController
