const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '') || req.cookies.token 
    || req.body.token || req.query.token;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
// cookie only for web not mobile
    try {
        const decode=jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode);
        req.user = decode;
        //bring in information from db
    } catch (ex) {
        return res.status(403).send('Invalid token.');
    }
    return next();
}

module.exports = auth;