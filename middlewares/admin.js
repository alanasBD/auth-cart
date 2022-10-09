module.exports = function(req,res,next){
    if(req.user.role !== 'admin') return res.status(403).send({
       msg: 'Forbidden',
       user:req.user
    });
    next();
}