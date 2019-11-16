const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config.json');
const client = new MongoClient(config.dbconnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const dbName = config.dbName;
const collectionName = config.collectionname;

const express = require('express');
const app = express();
app.get('/getallbyrepoideventtype', async (res, req) => {
    client.connect();
    console.log({
        repo: { id: parseInt(req.query.repoid) },
        type: req.query.eventtype
    });
    await client
        .db(dbName)
        .collection(collectionName)
        .find({
            'repo.id': parseInt(req.query.repoid),
            type: req.query.eventtype
        })
        .toArray(function(err, docs) {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(docs);
            client.close();
            req.send(docs);
        });
});

app.get('/getactordetailbyactorlogin', (res, req) => {
    client.connect();
    client
        .db(dbName)
        .collection(collectionName)
        .find({ 'actor.login': req.query.actorid })
        .toArray((err, docs) => {
            if (err) {
                return res.status(500).send(err);
            }
            client.close();
            req.send(docs);
        });
});

app.get('/getrepowithhighestevents', (res, req) => {
    client.connect();
    client
        .db(dbName)
        .collection(collectionName)
        .aggregate(
            [
                { $match: { 'actor.login': req.query.actorid } },
                { $project: { _id: '$repo.id' } },
                {
                    $group: {
                        _id: '$_id',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: 1 } }
            ],
            { allowDiskUse: true }
        )
        .toArray((err, docs) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (docs.length === 0) {
                return res.sendStatus(404);
            }
            client.close();
            req.send(docs[0]);
        });
});

app.get('/getrepowithtopcontributors', (res, req) => {
    client.connect();
    client
        .db(dbName)
        .collection(collectionName)
        .aggregate(
            [
                { $project: { _id: '$repo.id', user_id: '$actor.id' } },
                {
                    $group: {
                        _id: '$_id',
                        contributers: {
                            $addToSet: {
                                user_id: '$user_id',
                                count: { $sum: 1 }
                            }
                        }
                    }
                }
            ],
            { allowDiskUse: true }
        )
        .toArray((err, docs) => {
            console.log('called');
            if (err) {
                return req.status(500).send(err);
            }
            const returnValue = docs.map(res => {
                res.contributers = res.contributers[0];
                return res;
            });
            client.close();
            req.send(returnValue);
        });
});

app.delete('/deleteactor', (res, req) => {
    client.connect();
    client
        .db(dbName)
        .collection(collectionName)
        .deleteMany({ 'actor.login': req.query.actorid })
        .then(res1 => {
            client.close();
            req.send(res1.deletedCount);
        });
});

app.listen(
    config.serverport,
    () => 
    console.log('Starting Server...'),    
    console.log('Listening on port : ' + config.serverport),
    console.log('API Get: getallbyrepoideventtype'),
    console.log('API Get: getactordetailbyactorlogin'),
    console.log('API Get: getrepowithhighestevents'),
    console.log('API Get: getrepowithtopcontributors'),
    console.log('API Delete: deleteactor')
);