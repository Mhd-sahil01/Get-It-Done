const mongoose = require("mongoose");
const initData = require("./data.js");
const Task = require("../models/task.js");

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/getitdone")
}

const initDB = async function () {
    await Task.deleteMany({});
    initData.data = initData.data.map((el) => ({...el, userID:"6835619aed2405f72b62f265"}))
    await Task.insertMany(initData.data);
    console.log("data was initialized");
} 

initDB();