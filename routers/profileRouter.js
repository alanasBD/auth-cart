const express = require('express');
const router = express.Router();
const {
    getProfile,
    setProfile
} = require('../controllers/profile.controllers.js');
const authorize = require('../middlewares/authorize');


router.route('/')
.post(authorize,setProfile)
.get(authorize,getProfile)


module.exports = router;