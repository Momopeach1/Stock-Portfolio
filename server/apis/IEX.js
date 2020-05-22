const axios = require('axios');

module.exports = axios.create({
  baseURL:'https://cloud.iexapis.com/stable',
  params: { token: process.env.API_KEY}
});