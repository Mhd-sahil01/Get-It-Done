const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");

const taskController = require("../controllers/tasks.js");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next()
        return res.redirect("/login")
}

router
    .route("/")
    .get(isLoggedIn, asyncWrap(taskController.index))
    .post(isLoggedIn, asyncWrap(taskController.renderNew));

router
    .route("/new")
    .get(taskController.createNew);

router
    .route("/isCompleted")
    .get(isLoggedIn, asyncWrap(taskController.isCompleted));

router
    .route("/:id")
    .get(taskController.renderShowPage)
    .post(asyncWrap(taskController.done));

router
    .route("/:id/edit")
    .get(asyncWrap(taskController.renderEdit))
    .put(asyncWrap(taskController.renderUpdatedPage));

router
    .route("/:id/delete")
    .delete(asyncWrap(taskController.delete));


module.exports = router;