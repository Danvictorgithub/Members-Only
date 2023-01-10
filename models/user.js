const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {DateTime} = require("luxon");
const UserSchema = new Schema({
	username:{type:String, required:true, minLength:1,maxLength:25},
	password:{type:String, required:true, minLength:8,maxLength:64},
	member_status:{type:String,enum:["Bystander","Elite"],default:"Bystander"},
	date_joined:{type:Date,default:Date.now},
	admin:{type:Boolean,default:false},
});
UserSchema.virtual('join_date').get(function(){
	return DateTime.fromJSDate(this.date_joined).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model("User",UserSchema);