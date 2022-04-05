const { MongoClient, ObjectID } = require('mongodb');	// require the mongodb driver
const config = require('./config/default');
const { v4: uuidv4 } = require('uuid');

const mongodbPassword = process.env.MONGO_PASSWORD || require('./config/password').dbPassword;
const mongodbUrl = config.mongodbUrl_0 + mongodbPassword + config.mongodbUrl_1;
const mongodbName_data = config.mongodbName_data;
const mongodbName_device = config.mongodbName_device;

/**
 * Uses mongodb v3.6+ - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.6/api/)
 * Database wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our cpen322 app.
 */
function Database(mongoUrl, dbName){
    if (!(this instanceof Database)) return new Database(mongoUrl, dbName);
    this.connected = new Promise((resolve, reject) => {
        MongoClient.connect(
            mongoUrl,
            {
                useNewUrlParser: true
            },
            (err, client) => {
                if (err) reject(err);
                else {
                    console.log('[MongoClient] Connected to ' + mongoUrl + '/' + dbName);
                    resolve(client.db(dbName));
                }
            }
        )
    });
    this.status = () => this.connected.then(
        db => ({ error: null, url: mongoUrl, db: dbName }),
        err => ({ error: err })
    );
}

Database.prototype.getDevices = function(){
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            db.collection('devices').find({}).toArray((err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            })
        })
    )
}

Database.prototype.addDevice = function(device){
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            let deviceWithId = {"name": device, _id: uuidv4()};
            db.collection('devices').insertOne(deviceWithId, function (err) {
                if (err) reject(err);
                else resolve("Device added successfully!");
            });
        })
    )
}

Database.prototype.deleteDevice = function(id){
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            db.collection('devices').deleteOne({"name": id}, function (err) {
                if (err) reject(err);
                else resolve("Device deleted successfully!");
            });
        })
    )
}

Database.prototype.getData = function(deviceId) {
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            db.collection(deviceId).find({}).toArray((err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            })
        })
    )
}

Database.prototype.addData = function(deviceId, data) {
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            let dataWithId = {...data, _id: uuidv4()};
            db.collection(deviceId).insertOne(dataWithId, function (err) {
                if (err) reject(err);
                else resolve('Data added successfully!');
            });
        })
    )
}

// TODO: clear all old data in all collections
Database.prototype.deleteOldData = function(device, time){
    return this.connected.then(db =>
        new Promise((resolve, reject) => {
            db.collection(device).remove({time: {$lt: time}}, function (err) {
                    if (err) reject(err);
                    else resolve("Old data deleted successfully!");
                });
            })
        );
}


const db_data = new Database(mongodbUrl, mongodbName_data);
const db_device = new Database(mongodbUrl, mongodbName_device);

module.exports = {db_data, db_device};