require("dotenv").config();
const express = require("express");
const path = require('path');
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const logger = require('morgan');
const createError = require("http-errors");

const indexRouter = require("./routes/index");

// Mongoose Setup
const MongoDb = process.env.MONGODB_URI;
mongoose.connect(MongoDb,{useUnifiedTopology:true,useNewUrlParser:true});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"mongo connection error"));
// View Template Setup
const app = express();
app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");

// Middlewares
app.use(session({secret:process.env.SECRET_KEY, resave:false, saveUnititialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// Setup Main Routers
app.use(express.static(path.join(__dirname,"public")));
app.use("/",indexRouter);

// catch 404 and forward to error handler
app.use((req,res,next)=> {
	next(createError(404));
});

app.use((err,req,res,next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err: {};

	res.status(err.status || 500);
	res.render("error");
});

app.listen(3000, () => console.log("app listening on port 3000!"));
