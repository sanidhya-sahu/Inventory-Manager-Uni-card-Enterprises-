const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

// Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/test-db', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb+srv://aneesahu4:sanidhya.09@cluster0.afmgcmf.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// Schema
const Schema = mongoose.Schema;
const mySchema = new Schema({
    // dateCreated:String,
    // _id:Number
    user: String,
    pass: String,
    acctype: String
});
const logSchema = new Schema({
    // dateCreated:String,
    // _id:Number
    user: String,
    time: String,
    acctype: String
});
// Model
const data = mongoose.model('data', mySchema);
const user = mongoose.model('user', mySchema);
const logtime = mongoose.model('logtime', logSchema);
// Express
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
app.get('/logina', (req, res) => {
    res.render('admin')
    // console.log('admin login')
})
app.post('/logina', (req, res) => {
    data.find({
        user: req.body.username,
        pass: req.body.password,
        acctype: "admin"
    })
        .then(foundDocument => {
            console.log('found document is ', foundDocument);

            if (Object.keys(foundDocument).length === 0) {
                console.log('Wrong Credentials')
                res.render('admin')
            }
            else {
                var timelog = new logtime({
                    user: req.body.username,
                    time: Date(),
                    acctype:"admin"
                })
                timelog.save()
                res.render('adminmain')
            }
        })
        .catch(error => {
            console.error('Error saving document:', error);
            res.render('admin')
        });

})
app.get('/logine', (req, res) => {
    res.render('employee')
    // console.log('employee login')
})
app.post('/logine', (req, res) => {
    data.find({
        user: req.body.username,
        pass: req.body.password,
        acctype: "employee"
    })
        .then(foundDocument => {
            console.log('found document is ', foundDocument);
            if (Object.keys(foundDocument).length === 0) {
                console.log('Wrong Credentials')
                res.render('employee')
            }
            else {
                var timelog = new logtime({
                    user: req.body.username,
                    time: Date(),
                    acctype:"eployee"
                })
                timelog.save()
                res.render('empmain')
            }
        })
        .catch(error => {
            console.error('Error saving document:', error);
            res.render('employee')
        });
})
app.get('/viewstock', (req, res) => {
    res.render('index')
    // console.log('view')
})
app.get('/updatestock', (req, res) => {
    res.render('updatestock')
    
})
app.post('/updatestock', (req, res) => {
    // res.render('updates')
    res.send('updated')
})

// Redirect route
app.get('/redirect', (req, res) => {
    res.redirect('/');
  });  
//server 
app.listen(80, () => {
    console.log('strated at http://127.0.0.1/')
})