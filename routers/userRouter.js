const express = require('express');
const router = express.Router();
const {signUp,signIn} = require('../controllers/user.controllers');
const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');

router.route('/signup')
.post(signUp);


router.route('/signin')
.post(signIn)
.delete([authorize,admin],(req,res)=>{
    res.send('ok')
});



module.exports = router;