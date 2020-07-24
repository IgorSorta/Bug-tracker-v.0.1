const {
    v4: uuidv4
} = require('uuid');

// Generate id value
module.exports = () => {
    let id = uuidv4();

    return id;
}