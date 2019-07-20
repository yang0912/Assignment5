const collection = "todo";
const uuidv4 = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;

let dbName = 'cpsc';
let connectionURL = "mongodb+srv://test:test1234@sandbox-qkh5y.mongodb.net/test?retryWrites=true&w=majority"

let db = null;
function Todo() {
    MongoClient.connect(connectionURL, { useNewUrlParser: true }, function (err, client) {
        if (err !== null) console.log(err);
        client.connect(err => {
            if (err !== null) console.error(err);
            else db = client.db(dbName);
        });
    });
}

Todo.prototype.loadTodoList  = async () => {
    let condition = {};
    let todoList = await find(collection, condition);
    let result = {todo: [], done: []};
    for (let todo of todoList) {
        let toPush = todo["done"]? result["done"] : result["todo"];
        todo = {...todo, id: todo._id};
        toPush.push(todo);
    }
    return Promise.resolve(result);
}

Todo.prototype.addItem  = async (text, detail) => {
    let data = {"text": text, "detail": detail, "done": false};
    await add(collection, data);
}

Todo.prototype.changeStatus  = async (uuid) => {
    let condition = {"_id": uuid};
    let items = await find(collection, condition);
    await update(collection, condition, {done: !items[0].done});
}

Todo.prototype.deleteItem  = async ( uuid) => {
    let condition = {"_id": uuid};
    await dbDelete(collection, condition);
}


function connect(collectionName, callback) {
    return new Promise(function (fulfill, reject) {
        const collection = db.collection(collectionName);
        callback(collection).then((data) => {
            fulfill(data);
        }).catch((err) => {
            reject(err);
        });
    });
}

let find  = async (collection, condition) => {
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            collection.find(condition).toArray(function (err, docs) {
                if (err !== null) {
                    console.log(err);
                    reject(err);
                }
                if (!(docs instanceof Array)) {
                    docs = [docs]
                }
                fulfill(docs);
            });
        })
    }
    return await connect(collection, callback);
}

let add  = async (collection, data) => {
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            data._id = uuidv4();
            collection.insertOne(data, function (err, col) {
                if (err) {
                    reject(err);
                }
                fulfill({});
            })
        });
    }
    await connect(collection, callback);
}

let dbDelete  = async (collection, condition) => {
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            collection.deleteOne(condition, function (err, obj) {
                if (err) {
                    reject(err);
                }
                fulfill({});
            })
        });
    }
    await connect(collection, callback);
}


let update  = async (collection, condition, toUpdate) => {
    let callback = (collection) => {
        return new Promise(function (fulfill, reject) {
            let data = { $set: toUpdate };
            collection.updateOne(condition, data, null, function (err, col) {
                if (err) {
                    reject(err);
                }
                fulfill({});
            });
        })
    }
    await connect(collection, callback);
}

module.exports = Todo;