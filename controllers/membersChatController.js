exports.members_chat_home = (req,res,next) => {
	console.log(req.user);
	res.render("memberschat");
};