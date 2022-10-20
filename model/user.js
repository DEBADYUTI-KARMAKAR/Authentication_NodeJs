const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstNamne:{
        type:String,
        default:null
    },
    lastNamne:{
        type:String,
        default:null
    },
    email:{
        type:String,
        unique:true,
        requires:true
        
    },
    password:{
        type:String
    },
    token:{
        type:String
    }
});

module.exports=mongoose.model('user',userSchema);