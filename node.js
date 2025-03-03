const express = require('express')
const app = express()
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//Import the router files
const studentRoutes = require('./routes/studentRoutes');

//use the routers
app.use('/student',studentRoutes);

app.listen(PORT,()=>{
    console.log('listening on port 3000');
})