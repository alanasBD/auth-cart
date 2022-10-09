const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    getPhoto,
    filterProducts
} = require('../controllers/product.controllers');
const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');



router.route('/')
.get(getProducts)
.post([authorize,admin],createProduct)

router.route('/:id')
.get(getProductById)
.put(updateProductById)


router.route('/photo/:id')
.get(getPhoto);


router.route('/filter')
.post(filterProducts);





module.exports = router;