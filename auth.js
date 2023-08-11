const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Replace this with your actual secret key

// Function to generate a JWT token
function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Function to verify a JWT token
function verifyToken(token) {
    try {
        const pureToken = token && token.split(' ')[1]
        return jwt.verify(pureToken, secretKey);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}

module.exports = { generateToken, verifyToken };
