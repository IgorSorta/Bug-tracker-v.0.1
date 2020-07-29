const JWT = require('jsonwebtoken');
const axios = require('axios');

module.exports = {
    verifyToken: async (req) => {
        const token = req.headers["authorization"] || ''

        if (token) {
            try {
                return await JWT.verify(token, process.env.SECRET);
            } catch (error) {
                throw new Error(error);
            }
        }
    },
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