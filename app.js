const express = require('express')
const app = express()

const userModel = require('./models/user');
const postModel = require('./models/post');

const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken')


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())



app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send('Something went wrong');
    console.log(user)

    // bcrypt.compare(password, user)
})

app.post('/register', async (req, res) => {
    let {name, username, email, password, age} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send('User already registered');

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            await userModel.create({
                name,
                username,
                email,
                password: hash,
                age
            })
            
        })
    })
    let token = jwt.sign({email, userId: user._id}, 'secret');
            res.cookie('token', token)
            res.send('Registered')

})

app.listen(3000)
