const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const membersChatController = require('../controllers/membersChatController');
router.get("/", authenticationController.home_get);
// Authentication Controller
router.post("/sign-up",authenticationController.sign_up_post);
router.post("/log-in",authenticationController.log_in_post);
router.get("/log-out",authenticationController.log_out_post);
// Members Chat Controller
router.get("/thread",membersChatController.members_chat_home);
router.get("/user",membersChatController.user_info);
router.post("/secret-code",membersChatController.secret_key);
router.post("/add-post",membersChatController.add_post);
router.post("/delete-post",membersChatController.delete_post);
module.exports = router;
