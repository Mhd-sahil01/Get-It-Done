const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport")

const userController = require("../controllers/users.js")

router
    .route("/signin")
    .get(userController.renderSignin)
    .post(asyncWrap(userController.signin));

router
    .route("/login")
    .get(userController.renderLogin)
    .post(
        passport.authenticate("local", { failureRedirect: "/login"}),
        userController.login);

router
    .route("/logout")
    .get(userController.logout);

module.exports = router;