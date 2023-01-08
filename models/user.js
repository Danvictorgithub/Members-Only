const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username:{type:String, required:true, minLength:1,maxLength:25},
	password:{type:String, required:true, minLength:8,maxLength:64},
});
module.exports = mongoose.model("User",UserSchema);