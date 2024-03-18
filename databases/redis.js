const { createClient } = require('redis');

const {
    REDIS_CONNECT_URL = "redis://localhost:6379"
} = process.env;

( async () => {
    global.redis = await createClient({
        url: REDIS_CONNECT_URL
    })
    .on('error', err => {
        console.log('Redis Client Error', err);
        process.exit(1);
    })
    .connect();

    console.log("REDIS_CONNECTED");
})();