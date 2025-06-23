const mongoose = require("mongoose");
const schema  = mongoose.Schema;

const taskSchema = new schema({
    title: String,
    description: String,
    completed: Boolean,
    userID: {
        type: schema.Types.ObjectId,
        ref: "User"
    }
})

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;