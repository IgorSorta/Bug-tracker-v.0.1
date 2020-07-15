const userResolver = require('./user');
const messageResolver = require('./message');
const bugResolver = require('./bug');

module.exports = [userResolver, messageResolver, bugResolver];