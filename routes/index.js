var express = require('express');
var router = express.Router();
var pool = require('./sqlpool');
/* GET home page. */
router.get('/', function (req, res, next) {
    pool.query('SELECT * FROM (SELECT * FROM furnitures ORDER BY id DESC LIMIT 4)Var1 ORDER BY id ASC;', function (error, result) {
        if (error) {
            res.render('index', { result: [] })
        } else {
            res.render('index', { result: result })
        }
    })
});

router.get('/productdetail', function (req, res) {
    pool.query('select * from furnitures where id = ?', [req.query.id], function (error, result) {
        if (error) {
            res.send('Server error')
        } else {
            res.render('productdetail', { result: result[0] })
        }
    })
})

router.get('/search', function (req, res) {
    pool.query(`Select * from furnitures where name like '%${req.query.name}%' or price like '%${req.query.name}%' `,function (error, result) {
        if (error) {
            console.log(error)
            res.send('Server error come back soon')
        } else {
            res.send(result);
        }
    })
})

module.exports = router;
