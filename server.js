const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const cors = require('cors');


// require('dotenv').config();
// if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
//     throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
// }


const port = process.env.PORT || 3001;

// enable CORS. this app is a public API, and we want any client browsers to send requests to this app
app.use(cors());

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-chrisro.auth0.com/.well-known/jwks.json'
    }),
    // audience: 'https://api.dev-chrisr.com',
    issuer: 'https://dev-chrisro.auth0.com/',
    algorithms: ['RS256']
});

// app.use(jwtCheck);

app.get('/public', function (req, res) {
    res.send('This is a public endpoint');
});

app.get('/authorized', jwtCheck, function (req, res) {
    res.send('Secured Resource');
});

app.get("/api/external", jwtCheck, (req, res) => {
    console.log('-------  /api/external - req.user  ----------');
    console.log(req.user);

    res.send({
        msg: "Your Access Token was successfully validated!"
    });
});

app.get('/api/v1/users', jwtCheck, function (req, res) {
    console.log('-------  req.user  ----------');
    console.log(req.user);

    res.send('GET Users response from Backend!!');
});

app.listen(port, () => console.log(`API listening on ${port}`));
