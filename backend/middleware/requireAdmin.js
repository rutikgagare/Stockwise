const requireAdmin = async (req, res, next) =>{
    console.log('req.user in requireAdmin: ', req.user);
    try{
        if(req.user.role === "admin"){
            next();
        }
        else{
            throw Error('Requested user do not have admin access');
        }
    }catch(error){
        res.status(401).json({error:"Request is not authorized"});
    }
}

module.exports = requireAdmin