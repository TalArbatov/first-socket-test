const express = require('express');
const config = require('../config');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/', express.static(require('path').join(__dirname, '..', 'client', 'public')));

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`)
})
