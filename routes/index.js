const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
router.get("/", (req,res,next) => {
	res.render("home",{ user: req.user });
});
router.post("/sign-up",authenticationController.sign_up_post);
module.exports = router;
