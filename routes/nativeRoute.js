var express = require('express');
var router = express.Router();
var pool = require('./sqlpool');
const response = require('./responseCodes');
const { sendFcmNotification } = require('./FcmController');


function checkSeesion(req) {
    if (req.session.user) {
        return true
    } else {
        return false
    }
}

router.get('/home', function (req, res) {
    // if (checkSeesion(req)) {
    // pool.query('select * from bestoffer', (error, bestoffer) => {
    //     pool.query('select * from categories', (error, categories) => {
    //         pool.query('select * from bestselling', (error, bestselling) => {
    //             console.log(req.session.user)
    //             res.send({
    //                 code: response.success,
    //                 bestoffer,
    //                 categories,
    //                 bestselling
    //             })
    //         })
    //     })
    // })
    // } else {
    //     res.send({
    //         code: response.sessionInvalid,
    //     })
    // }
    res.send({
        code: response.success,
        bestoffer: [],
        categories: [],
        bestselling: []
    })
})



router.get('/productbycategory', function (req, res) {
    pool.query('select * from products where category=?', [req.query.category], (error, result) => {
        res.send({ code: response.success, result })
    })
})


router.get('/productbyid', function (req, res) {
    pool.query('select * from products where id=?', [req.query.id], (error, result) => {
        res.send({ code: response.success, result })
    })
})

router.post('/check/login', function (req, res) {
    pool.query('select name,phone,fcmtoken from users where phone=? and password=?', [req.body.phone, req.body.password], (error, result) => {
        if (result.length > 0) {
            req.session.user = result[0]
            res.send({ code: response.success, result })
        }
        else {
            res.send({ code: response.usernotpresent, result })
        }
    })
})


router.post('/placeorder', (req, res) => {
    // console.log(req.body)
    if (checkSeesion(req)) {
        pool.query('INSERT INTO orders (name,phone,address,items,userId,status) VALUES(?,?,?,?,?,?)', [req.body.name, req.body.phone, req.body.address, req.body.items, req.session.user.phone, 'new'], function (err) {
            if (err) {
                console.log(err)
                res.send({ code: response.error })
            } else {
                // console.log(req.session.user.fcmtoken)
                sendFcmNotification(req.session.user.fcmtoken, {
                    title: 'Congratulations',
                    body: 'Your order has been placed successfully 😊',
                    type: 'myorders'
                })
                res.send({ code: response.success })
            }
        })
    } else {
        res.send({
            code: response.sessionInvalid,
        })
    }
})

router.get('/myorders', (req, res) => {
    if (checkSeesion(req)) {
        pool.query('select * from orders where userId=?', [req.session.user.phone], function (error, result) {
            if (error) {
                // console.log(error)
                res.send({ code: response.error })
            } else {
                res.send({ code: response.success, result })
            }
        })
    } else {
        res.send({ code: response.sessionInvalid })
    }
})


router.post('/update/fcm/token', (req, res) => {
    // console.log(req.body)
    pool.query('UPDATE users SET fcmtoken=? WHERE phone=?', [req.body.token, req.session.user.phone], function (err) {
        if (err) {
            // console.log(err)
            res.send({ code: response.error })
        } else {
            res.send({ code: response.success })
        }
    })
})


router.post('/change/order/status', (req, res) => {
    pool.query('UPDATE orders SET status=? where id=?', [req.body.status, req.body.id], function (err) {
        if (err) {
            res.send({ code: response.error })
        } else {
            // console.log(req.session.user.fcmtoken)
            sendFcmNotification(req.body.token, {
                title: 'Order update',
                body: `Your order status has been changed to ${req.body.status} 😊`,
                type: req.body.type
            })
            res.send({ code: response.success })
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.send({ code: response.success })
})


router.post('/social/login', (req, res) => {
    // console.log(req.body)
    pool.query('select name,phone,fcmtoken from users where id=?', [req.body.id], function (error, result) {
        if (result.length > 0) {
            req.session.user = result[0]
            res.send({ code: response.success, result })
        }
        else {
            res.send({ code: response.usernotpresent })
        }
    })

})

router.post('/social/register', (req, res) => {
    // console.log(req.body)
    pool.query('INSERT INTO users (phone,name,password,email,photo,id) VALUES(?,?,?,?,?,?)', [req.body.phone, req.body.name, '123456789', req.body.email, req.body.photo, req.body.id], function (error, result) {
        if (error) {
            console.log(error)
            res.send({ code: response.error, })
        } else {
            // console.log("socailllll", result)
            req.session.user = req.body
            res.send({ code: response.success, result: req.body })


        }

    })

})


// React Api's End here


module.exports = router;
