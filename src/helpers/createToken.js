const JWT = require('jsonwebtoken');
// *Create jwt token with payload
module.exports = async (user, secret, expiresIn) => {
    const {
        id,
        email,
        name,
        role,
    } = user;

    return await JWT.sign({
        id,
        email,
        name,
        role
    }, secret, {
        expiresIn
    });
}