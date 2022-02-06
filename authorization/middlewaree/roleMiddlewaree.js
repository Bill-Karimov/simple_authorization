const jwt = require('jsonwebtoken');
const {secret} = require('../Controllers/config');

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json('User are not exist');
            }
            const {role: userRole} = jwt.verify(token, secret);
            let hasRole = false;
            userRole.forEach(r => {
                if (role.includes(r)) {
                    hasRole = true;
                }
                if (!hasRole) {
                    return res.status(403).json({message: "you don't have a permission"});
                }
            });
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json('User are not exist');
        }
    }
};