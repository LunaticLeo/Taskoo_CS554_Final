const client = require('redis').createClient();

client.connect();

client.flushAll();

module.exports = client;
