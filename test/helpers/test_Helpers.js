const axios = require('axios');

// *Helpers func. for tests
module.exports = {
    // *Makes query to web app 
    getQuery: async (query, token = undefined) => {
        return query && token ? axios.post(process.env.API_URL,
            query, {
                headers: {
                    'authorization': token,
                },
            }) : axios.post(process.env.API_URL,
            query)
    }
}