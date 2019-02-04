const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const app =  express();

//mock user list
const userList = [
    {
        username: 'Rajat Rastogi',
        email: 'rajat.rastogi@3pillarglobal.com',
        details: {
            dob: '28/3/1995',
            city: 'modinagar'
        }
    }
]

//use express to parse body to json
app.use(express.json());
//use body-parser module to parse the json
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))


app.get('/api', (req, res) => {
    res.json({
        message: 'API is working....'
    })
})

app.post('/api/signup', (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string().alphanum().min(3),
        details: Joi.object().keys({
            dob: Joi.date(),//mm-dd-yyyy
            city: Joi.string().min(3)
        })
    })
    Joi.validate(req.body.user, schema, (err, result) => {
        if(err) {
            res.status(400).send(err.details[0].message);
        } else {
            const { user } = req.body;
            const exixtingUser = userList.find(item => user.username === item.username || user.email === item.email);
            if(exixtingUser) {
                res.status(400).send('User already exist');
            } else {
                userList.push(result);
                genToken(res, result);
            }
        }
    })
})

app.post('/api/signin', (req, res) => {
    //find user from the list
    const user = userList.find( item => item.email === req.body.email);
    if(!user){
        res.status(401).send('User not found');
    } else {
        genToken(res, user);
    }
})

app.get('/api/getList', verfyToken, (req, res) => {
    res.status(200).json(req.token);
})

function genToken(res, user) {
    jwt.sign({user}, 'omegaAlpha', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        })
    })
}
//Format of auth
// auth <token>
//verfy Token
function verfyToken(req, res, next) {
    const { auth } = req.headers;
    if(auth !== undefined) {
        try {
            req.token = jwt.verify(auth.split(' ')[1], 'omegaAlpha');
            next();
        } catch (err) { 
            if(err.name = 'TokenExpiredError') {
                res.status(403).send('Session Expired');
            } else {
                res.sendStatus(403);
            }
        }
    } else {
        res.sendStatus(403)
    }
}

app.listen(4000, () => {
    console.log('server running on 4000')
})