const mongoose=require("mongoose")

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    operations:{
        type:String,
        required:true
    },
    Result:{
        type:String,
        required:true
    }
})

module.exports = new mongoose.model("Users_calc_details",UserSchema);