//let's me use client class from pg
const { Client } = require('pg');

//let's me use .env stuff
require('dotenv').config();

//creates new instance of client class for .env info
const client = new Client({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB
});

//connects client to my database
client.connect(err => {
    if (err) {
        console.error('Connection Error', err.stack);
    } else {
        console.log('Connected to the Database');
    }
});

//makes a query function that makes it easier for me to write SQL
function query(sql, params) {
    return client.query(sql, params);
}

//exports the query function for use in my index.js file
module.exports = { query };