  
const admin = require('firebase-admin');
const getToken = (req) => {
    if(req.header('Authorization')){
        return req.header('Authorization').split('Bearer ')[1];
    }
    return null;
}
exports.verifyUser = async (req,res,next) => {    
    try {
        const idToken = getToken(req);
        if(!idToken){
            throw new Error("ID Token not found!");
        } else {   
            const token = await admin.auth().verifyIdToken(idToken,true)
            req.token = token;
            req.user = token;
            next();
        }
    } catch(e) {
        next(new Error("Unauthorized access"));
        console.error(e);
    }
}