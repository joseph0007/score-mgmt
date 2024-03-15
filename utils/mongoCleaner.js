// without redis implementation

const { CronJob } = require('cron');
const mongoCollections = require('../utils/mongoCollectionConstants');
const { mongoRemove } = require('../databases/mongo');

new CronJob(
	'0 */2 * * *', // cronTime
	async function () {
		console.log('You will see this message every second');

        try {
            await mongoRemove(mongoCollections.User, {
                otp: { $exists: true },
                verified: false
            });

        } catch (error) {
            console.error('Error in cron ', error);
        }
	},
	null,
	true,
	'system'
);

console.log("cron job started");