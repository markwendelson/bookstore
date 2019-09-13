'use strict'

const { validate } = use('Validator')
const Books = use('App/Models/Book')
const Comments = use('App/Models/Comment')
const Category = use('App/Models/Category')
const Helpers = use('Helpers')

class BookController {
    async index({ response }){
        const book = await Books.all()

        return response.json({
            message: book.count ? "book found" : "no book found",
            status: 200,
            data: book
        });
    }
    
    async show ({ params, response }) {
        const book = await Books.find(params.id)
        await book.load('category')

        const comments = await Comments.query()
                                .with('user')
                                .where('book_id', book.id)
                                .fetch()

        if (!book) {
            return response.json({
                message: "book not found",
                status: 404,
                data: null
              });
        }

        return response.json({
            message: "book found",
            status: 200,
            data: { book, comments }
        });
    }

    async store ({ request, session, response, auth }) {
        const rules = {
            book_name: 'required',
            description: 'required',
            author: 'required',
            price: 'required',
            quantity: 'required'
        }

        let imageFile = request.file('image', {
            types: ['image'],
            size: '5mb'
          })
          
        var imageFileName = `${new Date().getTime()}.${imageFile.subtype}`
        imageFile =  await imageFile.move(Helpers.publicPath('uploads'), {
            name: imageFileName
        })

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
  
        const { book_name, description, author, category_id, price, quantity, discount } = request.only([
            'book_name',
            'description',
            'author',
            'category_id',
            'price',
            'quantity',
            'discount',
        ])
        
        var image = imageFileName

        var created_by = auth.user.id

        const book = await Books.create({ 
            book_name, 
            description, 
            author, 
            category_id, 
            price, 
            quantity,
            discount,
            image,
            created_by,
         })

        return response.json({
            message: "New book added successfully.",
            status: 'success',
            data: book
        });
    }

    async destroy ({ params, request, response }) {
        const book = await Books.find(params.id)
        
        await book.delete()

        return response.json({
            message: "Book deleted",
            status: 'success',
            data: null
        }); 
    }

    async update ({ params, request, session, response }) {
        const book = await Books.find(params.id)
       
        if (!book) {
            return response.status(404).json(null)
        }

        const rules = {
            book_name: 'required',
            description: 'required',
            author: 'required',
            price: 'required',
            quantity: 'required'
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

        const bookInfo = request.only([
            'book_name',
            'description',
            'author',
            'category_id',
            'price',
            'quantity',
            'discount'
        ])

        book.book_name = bookInfo.book_name
        book.description = bookInfo.description
        book.author = bookInfo.author
        book.category_id = bookInfo.category_id
        book.price = bookInfo.price
        book.discount = bookInfo.discount
        book.quantity = bookInfo.quantity
       
        await book.save()

        return response.json({
            message: "Book updated successfully.",
            status: 'success',
            data: book
        });
    }

    async management ({ view, response }) {
        let books = await Books.query().with('category').with('user').fetch()
        books = books.toJSON()

        let categories = await Category.all()
        categories = categories.toJSON()

        return view.render('management.books', { books, categories })
    }

    async search ({ request, view }) {
        const filter_val = request.get('q')["q"]
        let books = await Books.query().with('category').with('user')
                                .where('book_name','LIKE','%'+filter_val+'%')
                                .fetch()
        
        books = books.toJSON()

        return view.render('management.books', { books })
    }
}

module.exports = BookController
