const userResolver = require('./user');
const messageResolver = require('./message');
const bugResolver = require('./bug');
const {
    GraphQLDateTime
} = require('graphql-iso-date');

const customScalarResolver = {
    Date: GraphQLDateTime
};

module.exports = [customScalarResolver, userResolver, messageResolver, bugResolver];