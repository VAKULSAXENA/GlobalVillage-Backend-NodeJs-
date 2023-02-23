const mongoose=require('mongoose');
const bcrypt=require('bcrypt');


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    profilepic:{
        type:String,
        default:''
    },
    posts:{
        type:Array,
        default:[]
    }
})



module.exports=mongoose.model('User',userSchema);