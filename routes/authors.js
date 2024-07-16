const express=require('express')
const router=express.Router()
const Author = require('../models/author')

//all authors route
router.get('/',async(req,res)=>{
    let searchOptions = {}
    if (req.query.name!= null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i') //fills the search (mo gives us mohsen moemen modeen ..)
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
            //res.redirect(`/authors/${newAuthor.id}`)
            res.redirect('/authors')
        })
        .catch(err=>{
            res.render('authors/new',{
                author:author ,
                errorMessage: 'Error Creating Author'
            })
        })
})


module.exports = router;
