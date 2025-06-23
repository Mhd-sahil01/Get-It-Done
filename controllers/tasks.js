const Task = require("../models/task.js");

module.exports.index = async (req, res) => {
    let allTasks = await Task.find({userID: req.user.id})
    res.render("tasks/listTask.ejs", { allTasks });
}

module.exports.renderNew = async (req, res) => {
    let { title, description } = req.body;
    let newTask = await Task.insertOne({
        title: title,
        description: description,
        userID: req.user.id,
    });
    newTask.completed = false;
    await newTask.save();   
    res.redirect("/tasks");
}

module.exports.createNew = (req, res) => {
    res.render("tasks/newTask.ejs");
}

module.exports.renderShowPage = async (req, res, next) => {
    try {
        let { id } = req.params;
        const showTask = await Task.findById(id);
        if (!showTask) {
            throw new ExpressError("Task Not Exist!");
        } else {
            res.render("tasks/showTask.ejs", { showTask })
        }
    } catch (err) {
        next(err);
    }
}

module.exports.done = async (req, res) => {
    let { id } = req.params;
    let task = await Task.findById(id);
    task.completed = true;
    await task.save();
    res.redirect("/tasks");
}

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const task = await Task.findById(id);
    if (task) {
        res.render("tasks/editTask.ejs", { task })
    }
}

module.exports.renderUpdatedPage = async (req, res) => {
    let { id } = req.params;
    let { title, description } = req.body;
    await Task.findByIdAndUpdate(id, { title: title, description: description });
    res.redirect(`/tasks`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect("/tasks");
}

module.exports.isCompleted = async (req, res) => {
    const alltasks = await Task.find({
        userID: req.user.id,
        completed: true,
    });
    if (alltasks) {
        res.render("tasks/doneTask.ejs", { alltasks })
    } else {
        res.redirect("/tasks");
    }
}