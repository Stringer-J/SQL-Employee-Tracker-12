const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB
});

client.connect(err => {
    if (err) {
        console.error('Connection Error', err.stack);
    } else {
        console.log('Connected to the Database');
    }
});

function query(sql, params) {
    return client.query(sql, params);
}

module.exports = { query };