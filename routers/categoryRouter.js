const express = require('express');
const router = express.Router();
const {createCategory,getCategory} = require('../controllers/category.controllers');
const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');


router.route('/')
.get(getCategory)
.post([authorize,admin],createCategory)


module.exports = router;