const { MongoClient } = require('mongodb');

const {
  MONGO_URI,
  MONGO_DB
} = process.env;

global.mongoDatabasePool = undefined;

if( !MONGO_URI || !MONGO_DB ) {
  console.log(`MONGO_ENVS_NOT_PROVIDED. EXITING...`);
  process.exit(1);
}

const client = new MongoClient(MONGO_URI);

(async function () {
  try {
    await client.connect();
  
    console.log(`MONGO_CONNECT_SUCCESSFULL`);
    global.mongoDatabasePool = client.db(MONGO_DB); 
  } catch (error) {
    console.log(`MONGO_CONNECT_FAILED: MONGO URI -> ${MONGO_URI}`);
    process.exit(1);
  }
})();

function mongoFind(collection, querySelector, queryProjection = {}, sortSelector = {}, skip = 0, limit = 50) {
  return new Promise(async function (resolve, reject) {
    try {
      if(isNaN(skip)) {
        skip = 0;
      }
  
      if(isNaN(limit)) {
        limit = 50;
      }
  
      if( 
        typeof sortSelector === "undefined" || 
        sortSelector === ""
      ) {
        sortSelector = {};
      }
  
      if( 
        typeof queryProjection === "undefined" || 
        queryProjection === ""
      ) {
        queryProjection = {};
      }
  
      const result = await global.mongoDatabasePool
        .collection(collection)
        .find(querySelector, queryProjection)
        .sort(sortSelector)
        .skip(skip)
        .limit(limit)
        .toArray();
  
      resolve(result);  
    } catch (error) {
      reject(error);
    }
  });
}

function mongoUpdate(collection, filter, updateData, upsertData) {
  return new Promise(async function (resolve, reject) {
    try {
      
      if(typeof upsertData === "undefined") {
        upsertData = { upsert: false };
      }

      const result = await global.mongoDatabasePool
        .collection(collection)
        .updateOne(filter, { $set: updateData }, upsertData);
      
      resolve(result);
    } catch (error) {
      resolve(error);
    }
  });
}

function mongoRemove(collection, filter) {
  return new Promise(async function (resolve, reject) {
    try {
      
      if(typeof upsertData === "undefined") {
        upsertData = { upsert: false };
      }

      const result = await global.mongoDatabasePool
        .collection(collection)
        .deleteOne(filter);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function mongoInsertOne(collection, insertData) {
  return new Promise(async function (resolve, reject) {
    try {
      const result = await global.mongoDatabasePool
      .collection(collection)
      .insertOne(insertData);

      resolve(result);
    } catch (error) {
      reject(error)
    }
  });
}

function mongoAggregate(collection, aggregatePipeline) {
  return new Promise(async function (resolve, reject) {
    try {
      if( 
        typeof aggregatePipeline === "undefined" || 
        aggregatePipeline === ""
      ) {
        queryProjection = [];
      }
  
      const result = await global.mongoDatabasePool
        .collection(collection)
        .aggregate(aggregatePipeline)
        .toArray();
  
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  "mongoFind": mongoFind,
  "mongoUpdate": mongoUpdate,
  "mongoRemove": mongoRemove,
  "mongoInsertOne": mongoInsertOne,
  "mongoAggregate": mongoAggregate
}
