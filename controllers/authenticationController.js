const {body, validationResult} = require('express-validator');
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.home_get = (req,res,next) => {
	if (req.user != undefined) {
		User.findOne({username:req.user.username,password:req.user.password}).exec((err,user)=>{
			if (err) {
				return next(err);
			}
			if (user == undefined) {
				delete req.user; //Protects Invalid Injections
				res.render("home");
				return;
			}
			res.redirect("/thread");
 		});
 		return;
	}
	res.render("home");
};
exports.sign_up_post = [
	//sanitize sign-up
	body("username","Username character must be atleast 1 or less than 25 characters").trim().isLength({min:1,max:25}).escape(),
	body("password").trim().isLength({min:8}).withMessage("password must be atleast 8 characters"),
	body("confirmpassword").trim().isLength({min:8}).custom((confirmpassword,{req}) => {
		// checks if password is the same
		if (confirmpassword !== req.body.password) {
			throw new Error("Password doesn't match");
		}
		return true;
	}),
	(req,res,next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("home",{errors:errors.array()});
			return;
		}
		User.findOne({username:req.body.username}).exec((err,result) => {
			// Checks if user already exist
			if (err) {
				return next(err);
			}
			if (result != null) {
				const error = [{msg:"This user already exist"}];
				res.render("home",{errors:error});
				return;
			}
			// Success
			bcrypt.hash(req.body.password,12,(err,hashedPassword) => {
				if (err) {
					return next(err);
				}
				const newUser = new User({
					username:req.body.username,
					password:hashedPassword,
				});
				newUser.save((err)=> {
					if (err) {
						return next(err);
					}
					res.redirect("/");
				});
			});
		});
		
	}
];
// PassportJS Automatic Login Session
exports.log_in_post = passport.authenticate('local',{
	successRedirect:"/thread",
	failureRedirect:"/"
});
// Log-out Session
exports.log_out_post = (req,res,next)=> {
	req.logout((err)=> {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
};