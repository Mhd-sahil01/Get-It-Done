const User = require("../models/user.js");

module.exports.renderSignin = (req, res) => {
    res.render("users/signin.ejs");
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.signin = async(req, res) => {
    try{
        let {username, password} = req.body;
        const newUser = new User({username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            res.redirect("/tasks");
        })
    } catch(err) {
        res.redirect("/signin");
    }
}

module.exports.login = async(req, res) => {
    res.redirect("/tasks");
}

module.exports.logout = async(req, res) => {
    req.logOut((err) => {
        if(err) {
           return next(err);
        }
        res.redirect("/login");
    })
}