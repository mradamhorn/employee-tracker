const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '@Cr3t0rt0utsid3',
    database: 'workplaceDB',
});

connection.connect((err) => {
    if (err) throw err;
});

module.exports = connection;