const MongoClient = require("mongodb").MongoClient
const mongodbUrl = "mongodb://localhost:27017/"
var database = undefined
var collection = undefined

module.exports = {
    async connect(cbFn) {
        try {
            database = await MongoClient.connect(mongodbUrl, {useNewUrlParser: true})
            collection = database.db("chat_app_mb")
            cbFn()
        } catch (error) {
            console.log("error with connecting db :", error)
        }
    },
    async insertMessage(objToPass) {
        try {
            await collection.collection("messages").insertOne(objToPass)
        } catch (error) {
            console.log("error inserting message :", error)
        }
    },
    async getAllMessage() {
        try {
            return collection.collection("messages").find({}).toArray()
        } catch (error) {
            console.log("error getting messages :", error)
        }
    }
}