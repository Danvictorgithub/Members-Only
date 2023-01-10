const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const membersChatController = require('../controllers/membersChatController');
router.get("/", (req,res,next) => {
	res.render("home",{ user: req.user });
});
// Authentication Controller
router.post("/sign-up",authenticationController.sign_up_post);
router.post("/log-in",authenticationController.log_in_post);
router.get("/log-out",authenticationController.log_out_post);
// Members Chat Controller
router.get("/thread",membersChatController.members_chat_home);
module.exports = router;
