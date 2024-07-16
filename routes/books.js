const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const path = require ('path')
const fs = require ('fs')
const uploadPath = path.join ('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
      callback(null, imageMimeTypes.includes(file.mimetype))
    }
  })


//all books route
router.get('/',async(req,res)=>{
    let query = Book.find()
    if(req.query.title !=null  && req.query.title !=''){
        query = query.regex('title' , new RegExp(req.query.title , 'i'))
    }
    if(req.query.publishedBefore !=null  && req.query.publishedBefore !=''){
        query = query.lte('publishDate' , req.query.publishedBefore)
    }
    if(req.query.publishedAfter !=null  && req.query.publishedAfter !=''){
        query = query.gte('publishDate' ,  req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render ('books/index' , {
            books : books ,
            searchOptions : req.query
        })
    }catch{
        res.redirect('/')
    }
})

//new book route
router.get('/new', async (req,res)=>{
    renderNewPage(res ,new Book ())

})

//create book route
router.post('/',upload.single('cover') ,async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate)
})
    const authors = await Author.find({})
    try{
        const newBook = await book.save()
        //res.redirect(`/books/${newBook.id}`)
        res.redirect(`books`)
    }catch{
        if (book.coverImageName != null){
            bookRemoveCover(book.coverImageName)  
            //console.log('im here')          
        }
        renderNewPage(res , book , true)
    }
})

async function renderNewPage (res,book, hasError=false){

    try{
        const authors = await Author.find({})
        const params =  {
            authors : authors,
            book : book
        }
        if(hasError) params.errorMessage="Error creating book"
        res.render('books/new',params)
    }catch{
        res.redirect('/books')
    }
}

function bookRemoveCover(fileName){//if theres an error it doesnt save the booc cover in uploads
    fs.unlink(path.join(uploadPath , fileName) , err =>{
        console.error(err) 
    })
}

module.exports = router;
