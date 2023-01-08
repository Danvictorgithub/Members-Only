const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
router.get("/", (req,res,next) => {
	console.log(req.session.error);
	res.render("home",{errors:req.session.error});
	// req.session.error = undefined;
});
router.post("/sign-up",authenticationController.sign_up_post);
module.exports = router;
