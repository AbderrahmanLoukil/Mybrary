if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();//this will load the variables in the .env file to the process.env
}


const express = require('express')
const app=express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require ('./routes/index')
const authorRouter = require('./routes/authors')
const bodyParser = require ('body-parser')
const bookRouter = require ('./routes/books')
const methodOverride = require ('method-override')

app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'10 mb', extended:false}))
app.use('/books',bookRouter)
app.use(methodOverride('_method'))

app.use('/',indexRouter)
app.use('/authors',authorRouter)

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',error=>{console.error(error)})
db.once('open',()=>{console.log('Connection to mongoose Successful')})



app.listen(process.env.PORT || 3000)
