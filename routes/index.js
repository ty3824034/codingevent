var express = require('express');
var router = express.Router();
var pool = require('./sqlpool');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("Running")
});



// React Api's Start here


router.get('/user/dashboard', function (req, res) {
    result = { name: "Hello, how are you I'm fine" }
    res.send(result)
})


router.get('/search', function (req, res) {
    pool.query(`Select * from furnitures where name like '%${req.query.name}%' or price like '%${req.query.name}%' `, function (error, result) {
        if (error) {
            console.log(error)
            res.send('Server error come back soon')
        } else {
            res.send(result);
        }
    })
})



// React Api's End here


module.exports = router;
