require("dotenv").config();
const User = require('../models/user');
const Message = require("../models/message");
const {body,validationResult} = require('express-validator');
exports.members_chat_home = (req,res,next) => {
	//Checks if User session is active
	if (req.user == undefined) {
		const error = new Error("No Login Session");
		error.status = 404;
		return next(error);
	}
	User.findOne({username:req.user.username,password:req.user.password}).exec((err,user)=>{
		if (err) {
			return next(err);
		}
		//Invalidates Fake User Injections
		if (!user) {
			const error = new Error("Invalid Login Session");
			error.status = 404;
			return next(error);
		}
		//Changes view to non-Member
		if (user.member_status != 'Elite') {
			res.render("bystander");
			return;
		}
		// Shows Member Chat Thread
		Message.find({}).populate({path:"user",select:"username"}).exec((err,messages)=>{
			const sessionError = req.session.error;
			delete req.session.error;
			res.render("memberschat",{messages:messages,errors:sessionError});
		});
 	});
	// res.render("memberschat");
};
exports.user_info = (req,res,next)=> {
	//Checks if User session is active
	if (req.user == undefined) {
		const error = new Error("User Not Found");
		error.status = 404;
		return next(error);
	}
	User.findOne({username:req.user.username,password:req.user.password}).exec((err,user)=>{
		if (err) {
			return next(err);
		}
		// Updates View to User Info
		const sessionError = req.session.error;
		delete req.session.error;
		res.render("user",{user:user,errors:sessionError});
 	});
};
exports.secret_key = [
	body('secretcode').equals(process.env.SECRET_CODE).escape(),
	(req,res,next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			//redirects with error message
			req.session.error = errors.array();
			res.redirect("/user");
			return;
		}
		// Updates User Member Status
		const eliteUser = new User({
			_id:req.user.id,
			date_joined:req.user.date_joined,
			admin:req.user.admin,
			member_status:"Elite",
		});
		User.findByIdAndUpdate(req.user.id,eliteUser,{},(err,user)=>{
			if(err) {
				return next(err);
			}
			res.redirect("/user");
		});
	}
];
exports.add_post = [
	body("title").trim().isLength({min:1}).withMessage("Title is required").isLength({max:24}).withMessage("Title must be atmost 24 characters").escape(),
	body("content").trim().isLength({min:1}).withMessage("Content is required").isLength({max:128}).withMessage("Content must be atmost 128 characters").escape(),
	(req,res,next) => {
		const errors = validationResult(req);
		const newMessage = new Message({
			user:req.user.id,
			title:req.body.title,
			content:req.body.content,
		});
		//Form Failure
		if(!errors.isEmpty()) {
			req.session.error = errors.array();
			res.redirect("/thread");
			return;
		}
		User.findById(req.user.id).exec((err,user)=> {
			if (err) {
				return next(err);
			}
			//Invalidates Injections
			if (user.member_status != 'Elite') {
				const error = new Error("Invalid POST Request");
				error.status = 404;
				return next(error);
			}
			//Creates new post in Database
			newMessage.save((err,newMessage)=> {
			if (err) {
				return next(err);
			}
			res.redirect("/thread");
			});
		});
	}
];
exports.delete_post = (req,res,next) => {
	User.findById(req.user.id).exec((err,user)=>{
		if (err) {
			return next(err);
		}
		if (!user.admin) {
			const error = new Error("Invalid POST Request");
			error.status = 404;
			return next(error);
		}
		Message.findByIdAndRemove(req.body.postid,(err) => {
			if (err) {
				return next(err);
			}
			res.redirect("/thread");
		});
	});
};