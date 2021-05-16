var express = require('express');
const save = require('./multer');
var router = express.Router();
var pool = require('./sqlpool');
var fs = require('fs')
var nodemailer = require('nodemailer');
const response = require('./responseCodes');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gaurinstitute491@gmail.com',
        pass: 'blcebvoimsaxwpiv'
    },
    secure: true
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



router.post('/addproducts', save.single('image'), function (req, res) {

    pool.query("INSERT INTO products (name,price,category,image,stock,description,discount,seller) VALUES(?,?,?,?,?,?,?,?)", [req.body.name, req.body.price, req.body.category, req.file.filename, req.body.stock, req.body.description, req.body.discount, req.body.seller], function (error, result) {
        if (error) {
            console.log("Error", error);
            fs.unlink(`public/productimage/${req.file.filename}`, function (error) {
            })
            res.send({ code: response.error })
        }
        else {
            res.send({ code: response.success })
        }
    })

})



// router.get('/showproducts', function (req, res) {
//     console.log(req.session.user)
//     pool.query('select * from products', function (error, result) {
//         if (error) {
//             res.send({ code: response.error })
//         } else {
//             res.send({ code: response.success, result: result })
//         }
//     })

// });


router.post('/editproducts', function (req, res) {

    if (req.body.btn == 'update') {
        pool.query("UPDATE products SET name=?,price=?,category=?,stock=?,description=?,discount=?,seller=? WHERE id = ?", [req.body.name, req.body.price, req.body.category, req.body.stock, req.body.description, req.body.discount, req.body.seller, req.body.id], function (error, result) {

            if (error) {
                res.send({ code: response.error })
            } else {
                res.send({ code: response.success })
            }
        })
    } else {
        pool.query('delete from products where id =?', [req.body.id], function (error, result) {
            if (error) {
                res.send({ code: response.error })
            } else {
                res.send({ code: response.success })
            }
        })
    }

});



router.post('/updateproductimage', save.single('image'), function (req, res) {

    pool.query("UPDATE products SET image=? WHERE id = ?", [req.file.filename, req.body.id], function (error, result) {

        if (error) {
            res.send({ code: response.error })
        } else {
            fs.unlink(`public/productimage/${req.body.oldimage}`, function (error) {
                if (error) {
                    console.log(error)
                }
            })
            res.send({ code: response.success })
        }
    })

});


module.exports = router;
