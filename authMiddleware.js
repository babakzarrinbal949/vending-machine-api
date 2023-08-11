const { verifyToken } = require('./auth');

function authenticate(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    const user = verifyToken(token);

    console.log(user);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
}

module.exports = authenticate;
