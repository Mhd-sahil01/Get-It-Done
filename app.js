if (process.env.NODE_EVN != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const taskRouter = require("./routes/tasks.js");
const userRouter = require("./routes/users.js");

const dbUrl = process.env.ATLAS_DB;

connectDb()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })

async function connectDb() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=> {
    console.log("error in the monogo session");
})

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res)=> {
    res.render("root.ejs");
})

app.use("/tasks", taskRouter);
app.use("/", userRouter);

app.all("*all", (req, res, next) => {
    next(new ExpressError("404 Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { message = "OOPs somthing went wrong" } = err;
    res.render("error/error.ejs", { message });
});

app.listen(3000, () => {
    console.log("server is listening to port 8080");
});