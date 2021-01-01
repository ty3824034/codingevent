var express = require('express');
const save = require('./multer');
var router = express.Router();
var pool = require('./sqlpool');
var fs = require('fs')
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gaurinstitute491@gmail.com',
        pass: 'blcebvoimsaxwpiv'
    },
    secure: true
});

// var smtpPool = require('nodemailer-smtp-pool');
// var transporter = nodemailer.createTransport(smtpPool({
//     host: 'smtp.gmail.com',
//     port: 465,
//   service: 'gmail',
//   auth: {
//     user: 'gaurinstitute491@gmail.com',
//     // pass: 'sanjeevgaur@12'
//     pass: 'blcebvoimsaxwpiv'

//   },
//   maxConnections: 5,
//   maxMessages: 10
// }));

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.admin) {
        res.render('dashboard', { result: req.session.admin });
    } else {
        res.redirect('/admin/login')
    }

});


router.post('/contactus', function (req, res, next) {
    // console.log(req.body)

    var mailOptions = {
        from: req.body.name,
        to: 'deepaky802@gmail.com',
        subject: 'Contact Us Mail',
        html: `<html>
        <p>Name: ${req.body.name} </p>
        <p>Email: ${req.body.email} </p>
        <p>Phone: ${req.body.phone} </p>
        <p style="color:'green'">Message: ${req.body.message} </p>
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(false)
        } else {
            var mailOptions = {
                from: "XYZ Industry",
                to: req.body.email,
                subject: 'Response received',
                html: `<html>
                <p>Hi ${req.body.name}</p>
                <p>We will contact you soon</p>
                <p>Thanks and Regards</p>
                </html>`
            };
            transporter.sendMail(mailOptions, function (error, info) { })
            res.send(true)
        }
    });

});

router.get('/addproduct', function (req, res) {
    if (req.session.admin) {
        res.render('addproduct', { message: '', name: req.session.name })
    } else {
        res.redirect('/admin/login')
    }

});

router.post('/datasubmit', save.single('productimage'), function (req, res) {
    if (req.session.admin) {
        pool.query("INSERT INTO furnitures (name,price,category,image,stock,description,discount,seller) VALUES(?,?,?,?,?,?,?,?)", [req.body.productname, req.body.productprice, req.body.productcategory, req.file.filename, req.body.productstock, req.body.productdescription, req.body.productdiscount, req.body.productseller], function (error, result) {
            if (error) {
                console.log("Error", error);
                fs.unlink(`public/productimage/${req.file.filename}`, function (error) {
                })
                res.render('addproduct', { message: 'Failed To Submit Record' })
            }
            else {
                console.log("Result", result);
                res.render('addproduct', { message: 'Record Submitted' })
            }
        })
    } else {
        res.redirect('/admin/login')
    }
})

router.get('/showproducts', function (req, res) {
    if (!req.session.admin) {
        res.redirect('/admin/login')
    } else {

        pool.query('select * from furnitures', function (error, result) {
            if (error) {
                res.render('showproducts', { result: [] })
            } else {
                res.render('showproducts', { result: result })
            }
        })
    }
});

router.get('/updateproducts', function (req, res) {
    if (!req.session.admin) {
        res.redirect('/admin/login')
    } else {

        pool.query('select * from furnitures where id = ?', [req.query.id], function (error, result) {
            if (error) {
                res.render('updateproducts', { result: [], message: 'Server Error' })
            } else {
                res.render('updateproducts', { result: result[0], message: '' })
            }
        })
    }
});

router.post('/updateproducts', function (req, res) {
    if (!req.session.admin) {
        res.redirect('/admin/login')
    } else {

        if (req.body.btn == 'Update') {
            pool.query("UPDATE furnitures SET name=?,price=?,category=?,stock=?,description=?,discount=?,seller=? WHERE id = ?", [req.body.productname, req.body.productprice, req.body.productcategory, req.body.productstock, req.body.productdescription, req.body.productdiscount, req.body.productseller, req.body.id], function (error, result) {

                if (error) {
                    res.render('updateproducts', { result: [], message: 'Server Error' })
                } else {
                    res.redirect('/admin/showproducts')
                }
            })
        } else {
            pool.query('delete from furnitures where id =?', [req.body.id], function (error, result) {
                if (error) {
                    res.send('Server error')
                } else {
                    res.redirect('/admin/showproducts')
                }
            })
        }
    }
});



router.post('/updateproductimage', save.single('image'), function (req, res) {
    if (!req.session.admin) {
        res.redirect('/admin/login')
    } else {

        pool.query("UPDATE furnitures SET image=? WHERE id = ?", [req.file.filename, req.body.id], function (error, result) {

            if (error) {
                res.render('updateproducts', { result: [], message: 'Server Error' })
            } else {
                fs.unlink(`public/productimage/${req.body.oldimage}`, function (error) {
                    if (error) {
                        console.log(error)
                    }
                })
                res.redirect('/admin/showproducts')
            }
        })
    }
});

router.get('/login', function (req, res, next) {
    res.render('login', { message: '' });
});

router.post('/login', function (req, res, next) {
    pool.query('select name,phone from admin where phone=? && password=?', [req.body.phone, req.body.password], function (error, result) {
        if (error) {
            res.render('login', { message: "Server Error" })
        } else {
            if (result.length == 0) {
                res.render('login', { message: "Invalid Phone or Password" })
            } else {
                req.session.admin = result[0];
                res.redirect('/admin')
            }
        }
    })
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.render('login', { message: '' });
});

module.exports = router;
