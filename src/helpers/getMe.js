const JWT = require('jsonwebtoken');
const {
    AuthenticationError
} = require('apollo-server-express');

module.exports = async (req) => {
    const token = req.headers["authorization"] || ''

    if (token) {
        try {
            return await JWT.verify(token, process.env.SECRET);
        } catch (error) {
            throw new AuthenticationError('Token expired. Sign in again.');
        }
    }
};