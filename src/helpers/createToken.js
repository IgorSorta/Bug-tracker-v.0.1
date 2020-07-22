const JWT = require('jsonwebtoken');

module.exports = async (user, secret, expiresIn) => {
    const {
        id,
        email,
        name
    } = user;

    return await JWT.sign({
        id,
        email,
        name
    }, secret, {
        expiresIn
    });
}