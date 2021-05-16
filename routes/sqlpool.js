var mysql = require('mysql');

// var database = mysql.createPool({
//     host: "db4free.net",
//     port: 3306,
//     user: "devilmaycry",    
//     password: "qwertyuiop",
//     database: "shoppingdbdeepak",
//     multipleStatements: true
// })

var database = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "1234",
    database: "shopping_db",
    multipleStatements: true
})

//console.log("data",database)
module.exports = database;