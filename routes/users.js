var express = require('express');
const response = require('./responseCodes');
var router = express.Router();
var pool = require('./sqlpool');
var CryptoJS = require("crypto-js");


 function checkSeesion(req) {
  if (req.session.user) {
    return true
  } else {
    return false
  }
}

router.get('/showproducts', function (req, res) {
  // if (checkSeesion(req)) {
  pool.query('select * from products', function (error, result) {
    if (error) {
      res.send({ code: response.error })
    } else {
      console.log(req.session.user)
      res.send({ code: response.success, result: result })
    }
  })

  // } else {
  //   res.send({ code: response.sessionInvalid })
  // }

});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
  pool.query('insert into users (phone,name,password) values(?,?,?)', [req.body.phone, req.body.name, req.body.password], function (err, result) {
    if (err) {
      console.log(err)
      if (err.errno === 1062) {
        res.send({ code: response.duplicate })
      } else {
        res.send({ code: response.error })
      }
    } else {
      res.send({ code: response.success })
    }
  })
  // res.send(req.body);
});


router.post('/placeorder', (req, res) => {
  console.log(req.body)
  pool.query('INSERT INTO orders (name,phone,address,items,userId) VALUES(?,?,?,?,?)', [req.body.name, req.body.phone, req.body.address, req.body.items, req.body.userId], function (err) {
    if (err) {
      res.send({ code: response.error })
    } else {
      res.send({ code: response.success })
    }
  })
})


router.post('/login', (req, res) => {
  pool.query('select * from users where phone=?', [req.body.phone, CryptoJS.AES.encrypt(req.body.password, 'deepakreactjs@3456').toString()], function (err, result) {
    if (err) {
      res.send({ code: response.error })
    } else {
      if (result.length > 0) {
        req.session.user = result[0]
        // console.log(req.session.user)
        var bytes = CryptoJS.AES.decrypt(result[0].password, 'deepakreactjs@3456');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText === req.body.password)
          res.send({ code: response.success, data: result[0] })
        else
          res.send({ code: response.usernotpresent })
      } else {
        res.send({ code: response.usernotpresent })
      }
    }
  })
})


router.get('/myorders', (req, res) => {
  if (checkSeesion(req)) {
    pool.query('select * from orders where userId=?', [req.session.user.phone], function (error, result) {
      if (error) {
        console.log(error)
        res.send({ code: response.error })
      } else {
        res.send({ code: response.success, data: result })
      }
    })
  } else {
    res.send({ code: response.sessionInvalid })
  }
})


router.get('/logout', (req, res) => {
  req.session.destroy()
  res.send({ code: response.success })

})

module.exports = router;