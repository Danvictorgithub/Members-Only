const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	user:{type:Schema.Types.ObjectId,ref:"User",required:true},
	title:{type:String, minLength:1,maxLength:24, required:true},
	content:{type:String,minLength:1,maxLength:128,required:true},
	date_posted:{type:Date, required:true},
});
module.exports = mongoose.model("Message",MessageSchema);