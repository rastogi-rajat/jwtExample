const express = require('express');
const jwt = require('jsonwebtoken');

const app =  express();

app.get('/api', (req, res) => {
    res.json({
        message: 'API is working....'
    })
})

app.post('/api/signin', (req, res) => {
    //create mock user
    const user = {
        username: 'Rajat Rastogi',
        email: 'rajat.rastogi@3pillarglobal.com',
        details: {
            dob: '28/3/1995',
            city: 'modinagar'
        }
    }
    jwt.sign({user}, 'omegaAlpha', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        })
    })
})

app.get('/api/getList', verfyToken, (req, res) => {
    console.log('token varified');
    res.status(200).json(req.token);
})

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
                res.status(403).send('Session Expired').end();
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