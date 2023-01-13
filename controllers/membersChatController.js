require("dotenv").config();
const User = require('../models/user');
const {body,validationResult} = require('express-validator');
exports.members_chat_home = (req,res,next) => {
	if (req.user == undefined) {
		const error = new Error("No Login Session");
		error.status = 404;
		return next(error);
	}
	User.findOne({username:req.user.username,password:req.user.password}).exec((err,user)=>{
		if (err) {
			return next(err);
		}
		if (!user) {
			const error = new Error("Invalid Login Session");
			error.status = 404;
			return next(error);
		}
		if (user.member_status != 'Elite') {
			res.render("bystander");
			return;
		}
		res.render("memberschat");
 	});
	// res.render("memberschat");
};
exports.user_info = (req,res,next)=> {
	if (req.user == undefined) {
		const error = new Error("User Not Found");
		error.status = 404;
		return next(error);
	}
	User.findOne({username:req.user.username,password:req.user.password}).exec((err,user)=>{
		if (err) {
			return next(err);
		}
		res.render("user",{user:user,errors:req.session.error});
		delete req.session.error;
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
	body("title"),body("content")
];