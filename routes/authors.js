const express=require('express')
const router=express.Router()
const Author = require('../models/author')
const Book = require ('../models/book')

//all authors route
router.get('/',async(req,res)=>{
    let searchOptions = {}
    if (req.query.name!= null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i') //fills the search (mo gives us mohsen moemen modeen tomori ..)
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors : authors ,
            searchOptions : req.query //sends back the name to the user in the search bar
        })
    } catch {
        res.redirect('/')
    }
})

//new author route
router.get('/new',(req,res)=>{
    res.render('authors/new', {author : new Author()})
})

//create author route
router.post('/',(req,res)=>{
    const author=new Author({
        name: req.body.name
    })
    author.save()
        .then(newAuthor=>{
            res.redirect(`/authors/${newAuthor.id}`)
        })
        .catch(err=>{
            res.render('authors/new',{
                author:author ,
                errorMessage: 'Error Creating Author'
            })
        })
})

router.get('/:id' ,async(req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        const booksByAuthor = await Book.find({author : author.id}).limit(6)
        res.render('authors/show', {author : author , booksByAuthor : booksByAuthor})
    }
    catch{
        res.redirect('/')
    }
})
router.get('/:id/edit' , async(req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author : author})
    }
    catch{
        res.redirect('/authors')
    }
})
router.put('/:id' , async (req,res)=>{
    let author 
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }
    catch{
        if (author == null){
            res.redirect('/')
        }else{
            res.render('authors/edit' , {
            author :author ,
            errorMessage :'Error updating author'
            })            
        }
    }
})
router.delete('/:id' , async(req,res)=>{
    let author 
    try{
        author = await Author.findById(req.params.id)
        await author.deleteOne()
        res.redirect('/authors')
    }
    catch{
        if (author == null){
            res.redirect('/')
        }else{
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router;
