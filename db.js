const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'Moogpaulvo1!',
    database: 'employee_tracker'
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