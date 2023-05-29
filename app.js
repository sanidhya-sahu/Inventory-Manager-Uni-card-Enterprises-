const express = require('express')
const path = require('path')
app = express();
app.use('/static', express.static('static'))
app.use(express.urlencoded())
// Engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'templates'))
//Endpoints
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/logina',(req,res)=>{
    res.render('admin')
    console.log('admin login')
})
app.post('/logina',(req,res)=>{
    res.render('main')
    console.log(req.url)
    console.log(req.body.username)
    console.log(req.body.password)
})
app.get('/logine',(req,res)=>{
    res.render('employee')
    console.log('employee login')
})
app.post('/logine',(req,res)=>{
    res.render('main')
    console.log(req.url)
    console.log(req.body.username)
    console.log(req.body.password)
})
app.get('/viewstock',(req,res)=>{
    res.render('index')
    console.log('view')
})
app.get('/updatestock',(req,res)=>{
    res.render('index')
    console.log('update')
})
//server 
app.listen(80, () => {
    console.log('strated at http://127.0.0.1/')
})