const { createClient } = require('redis');

( async () => {
    global.redis = await createClient({})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

    console.log("REDIS_CONNECTED");
})();