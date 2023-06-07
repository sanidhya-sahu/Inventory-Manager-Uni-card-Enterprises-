const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')


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
    Last_Signin: String,
    acctype: String
});
const stockSchema = new Schema({
    dateCreated: String,
    user: String,
    product: String,
    detail: String,
    quantity: String,
});
// Model
const data = mongoose.model('data', mySchema);
const stock = mongoose.model('stock', stockSchema);
const logtime = mongoose.model('logtime', logSchema);
// Express
app = express();
app.use('/static', express.static('static'))
app.use(express.urlencoded())
// Session
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

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
                req.session.logsuccess = false
            }
            else {
                logtime.updateOne({ user: req.body.username }, { Last_Signin: Date(), acctype: "admin" }, { upsert: true })
                    .then(result => {
                        req.session.username = req.body.username;
                        req.session.logsuccess = true
                        if (req.session.logsuccess == true) {
                            res.render('adminmain')
                        }
                        else {
                            res.render('admin')
                        }
                    })
                    .catch(error => {
                        console.error('Error updating document:', error);
                    });

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
                req.session.logsuccess = false
            }
            else {
                logtime.updateOne({ user: req.body.username }, { Last_Signin: Date(), acctype: "eployee" }, { upsert: true })
                    .then(result => {
                        req.session.username = req.body.username;
                        req.session.logsuccess = true
                        if (req.session.logsuccess == true) {
                            res.render('empmain')
                        }
                        else {
                            res.render('employee')
                        }
                    })
                    .catch(error => {
                        console.error('Error updating document:', error);
                    });

            }
        })
        .catch(error => {
            console.error('Error saving document:', error);
            res.render('employee')
        });
})
app.get('/viewstock', (req, res) => {
    if (req.session.logsuccess == true) {
        res.render('index')
        console.log('view')
    }
    else {
        res.render('index')
    }
})
app.get('/updatestock', (req, res) => {
    if (req.session.logsuccess == true) {
        res.render('updatestock')
    }
    else {
        res.render('index')
    }

})
app.post('/updatestock', (req, res) => {
    if (req.session.logsuccess == true) {
        req.session.quantity = req.body.quantity
        req.session.note = req.body.note
        const param = { 'note': req.body.note, 'quantity': req.body.quantity }
        res.render('updateconfirmation', param)
        // res.send('updated')

    }
    else {
        res.render('index')
    }
})
app.post('/savestock', (req, res) => {
    if (req.session.logsuccess == true) {
        stock.updateOne({ product: String(req.body.prod).replace(/_/g, ' ') }, { detail: req.session.note, user: req.session.username, quantity: req.session.quantity, dateCreated: Date() }, { upsert: true })
            .then(result => {
                console.log('Update result:', result);
                res.render('stockconfirm')
            })
            .catch(error => {
                console.error('Error updating document:', error);
            });
    }
    else {
        res.render('index')
    }
})
app.post('/confirmredirectupdate', (req, res) => {
    if (req.session.logsuccess == true) {
        res.render('updatestock')
    }
    else {
        res.render('index')
    }
});
app.post('/confirmredirecthome', (req, res) => {
    res.render('index')
});
// Redirect route
app.get('/redirect', (req, res) => {
    res.redirect('/');
});
//server 
app.listen(80, () => {
    console.log('strated at http://127.0.0.1/')
})