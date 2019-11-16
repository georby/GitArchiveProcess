const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config.json');
const client = new MongoClient(config.dbconnection, {useNewUrlParser: true, useUnifiedTopology: true});
const fs = require('fs');
const dbName = config.dbName;


function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

client.connect(async err => {
    const d = fs.readFileSync(config.datasourcepath).toString()
        .split('\n')
        .filter(res => !!res.trim())
        .map(res => JSON.parse(res))
        .map(res => res);

    const map = groupBy(d, d => d.type);

    map.forEach(async (e, data) => {
        console.log(data);
        try {
            await client.db(dbName)
                .collection(config.collectionname)
                .insertMany(e);
        } catch (e) {
            console.log(data, 'failed');
        }
        console.log(data, 'done');
    });
});