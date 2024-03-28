const { createClient } = require('redis');

const {
    REDIS_CONNECT_URL = "redis://localhost:6379",
    IS_AWS_LAMBDA = false
} = process.env;

if( !IS_AWS_LAMBDA || IS_AWS_LAMBDA === "false" ) {
    (async () => {
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
}

async function connectRedis() {
    return new Promise(async (resolve, reject) => {
        try {
            global.redis = await createClient({
                url: REDIS_CONNECT_URL
            })
                .on('error', err => {
                    console.log('Redis Client Error', err);
                    resolve(false);
                })
                .connect();

            console.log("REDIS_CONNECTED");
            resolve(true);
        } catch (error) {
            console.log(`REDIS_CONNECT_FAILED`);
            resolve(false);
        }
    });
}

async function disconnectRedis(retryCount = 0) {
    return new Promise(async (resolve, reject) => {
        try {
            global.redis.disconnect();
            global.redis = undefined;

            console.log(`REDIS_DISCONNECT_SUCCESSFUL`);
            resolve(true);
        } catch (error) {
            console.log(`REDIS_DISCONNECT_FAILED`);

            if (retryCount < 2) {
                retryCount += 1;
                return resolve(await disconnectRedis(retryCount));
            }

            resolve(false);
        }
    });
}

module.exports = {
    connectRedis,
    disconnectRedis
}