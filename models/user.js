const mongoose =require("mongoose");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    Email :{
        type : String,
        required: true,
    },
});

UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);