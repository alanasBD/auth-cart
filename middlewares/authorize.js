const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    let token = req.header('Authorization');
    if(!token) return res.status(401).send('Access denied!!!');

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decoded;
        res.send(decoded);
        // next();
    } catch (error) {
        return res.status(400).send('Invalid token')
    }

}