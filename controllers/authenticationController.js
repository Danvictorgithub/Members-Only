const {body, validationResult} = require('express-validator');
const User = require("../models/user");
const bcrypt = require('bcryptjs');
exports.sign_up_post = [
	body("username","Username character must be atleast 1 or less than 25 characters").trim().isLength({min:1,max:25}).escape(),
	body("password").trim().isLength({min:8}).withMessage("password must be atleast 8 characters"),
	body("confirmpassword").trim().isLength({min:8}).custom((confirmpassword,{req}) => {
		if (confirmpassword !== req.body.password) {
			throw new Error("Password doesn't match");
		}
		return true;
	}),
	(req,res,next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.session.error = errors.array();
			// res.render("home",{errors:errors.array()});
			res.redirect("/");
			delete req.session.error;
			return;
		}
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
	}
];