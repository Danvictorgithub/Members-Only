const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
router.get("/", (req,res,next) => {
	// setup sign-up/login errors
	if (typeof req.session.error != 'undefined') {
		let errors = req.session.error;
		delete req.session.error;
		res.render("home",{errors:errors});
	}
	res.render("home");
});
router.post("/sign-up",authenticationController.sign_up_post);
module.exports = router;
