var multer = require('multer');
var date= new Date
var mul = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/productimage')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
});

var save = multer({ storage: mul })

module.exports = save;
