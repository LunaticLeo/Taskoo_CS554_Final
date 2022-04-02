const client = require('redis').createClient();

client.connect();

module.exports = client;
