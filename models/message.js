const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DateTime} = require("luxon");
const MessageSchema = new Schema({
	user:{type:Schema.Types.ObjectId,ref:"User",required:true},
	title:{type:String, minLength:1,maxLength:24, required:true},
	content:{type:String,minLength:1,maxLength:128,required:true},
	date_posted:{type:Date, default:Date.now,required:true},
});
MessageSchema.virtual("formatted_date_posted").get(function(){
	return DateTime.fromJSDate(this.date_posted).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model("Message",MessageSchema);