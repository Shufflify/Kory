const redis = require('redis');

let client = redis.createClient();
client.on('connect', () => console.log('connected to redis playlist cache'));