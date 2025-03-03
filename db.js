const mongoose = require('mongoose');
require('dotenv').config();

//Define the mongoDB connection URL
const mongoURL = process.env.MONGODB_URL_LOCAL//
//conat mongoURL = process.env.MONGODB_URL;

// set up mongoDB connection
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology : true
})

//get the default connection
// ongoose maintian a default connection object representing the mongoDB connections
const db = mongoose.connection;

// define event listeners for database connection

db.on('connected',()=>{
    console.log('connected to MongoDB server');
});

db.on('error',(err)=>{
    console.log('error in MongoDB server:',err);
});

db.on('disconnected',()=>{
    console.log('disconnected to MongoDB server');
});

// export the database connection
module.exports = db;
