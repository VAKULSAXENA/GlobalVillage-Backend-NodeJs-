const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../models/User')
const jwt=require('jsonwebtoken');

require('dotenv').config();

const nodemailer=require('nodemailer');

async function mailer(receivermail,code){

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.NodeMailer_email, // generated ethereal user
          pass: process.env.NodeMailer_password, // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: "GlobalVillage", // sender address
        to: `${receivermail}`, // list of receivers
        subject: "Email Verification", // Subject line
         text: `Your Verification code is ${code}`, // plain text body
        // html: "<b>Hello world?</b>", // html body
      });

}

router.post('/verify',(req,res)=>{
    // console.log(req.body)
    const {email}=req.body;
    console.log(email);
    if(!email){
        return res.status(422).json({error:"please add all the fields"})
    }
    else{
        User.findOne({email:email})
        .then(async(savedUser)=>{
            // console.log(savedUser);
            // return res.status(200).json({message:"Email Sent"})
            if(savedUser){
                return res.status(422).json({error:"Invalid Credentials"})
            }
            try{
                let verificationCode=Math.floor(Math.random()*(10000-1000))+1000;
                await mailer(email,verificationCode);
                return res.status(200).json({message:'Email sent',verificationCode,email});
            }
            catch(err){

            }
        })
        // return res.status(200).json({message:"Email Sent"})
    }
})

router.post('/changeusername',(req,res)=>{

    const {username,email}=req.body;

    User.find({username}).then(async(savedUser)=>{
        if(savedUser.length>0){
            return res.status(422).json({error:"Username already exists"})
        }
        else{
            return res.status(200).json({message:"Username Available"})
        }
    })

})

router.post('/signup',async(req,res)=>{
    const{username,password,email}=req.body;
    if(!username||!password||!email){
        return res.status(422).json({error:"Please add all the fields"})
    }
    else{
        const user=new User({
            username,
            email,
            password
        })

        try{
            await user.save();
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
            return res.status(200).json({message:"User Registered Successfully",token});
        }
        catch(err){
            console.log(err);
            return res.status(422).json({error:'User Not Registered'});
        }
    }
})

router.post('/forgotpassword',(req,res)=>{
    // console.log(req.body)
    const {email}=req.body;
    console.log(email);
    if(!email){
        return res.status(422).json({error:"please add all the fields"})
    }
    else{
        User.findOne({email:email})
        .then(async(savedUser)=>{
            // console.log(savedUser);
            // return res.status(200).json({message:"Email Sent"})
            if(savedUser){
                try{
                    let verificationCode=Math.floor(Math.random()*(10000-1000))+1000;
                    await mailer(email,verificationCode);
                    return res.status(200).json({message:'Email sent',verificationCode,email});
                }
                catch(err){
    
                }
                
            }
            else{
                return res.status(422).json({error:"Invalid Credentials"});
            }
          
        })
        // return res.status(200).json({message:"Email Sent"})
    }
})

router.post('/resetpassword',(req,res)=>{
    const{email,password}=req.body;

    if(!email || !password){
        return res.status(422).json({error:"please add all the fields"})
    }
    else{
        User.findOne({email:email}).then(async(savedUser)=>{
            console.log(savedUser)
            if(savedUser){
                savedUser.password=password
                savedUser.save();
                return res.json({message:"Password Changed Successfully"})
            }
            else{
                return res.status(422).json({error:"Invalid Credentials"})
            }
        })
    }
})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:'Invalid Credentials'})
    }
    else{
        User.findOne({email:email}).then((savedUser)=>{
            if(!savedUser){
                return res.status(422).json({error:'Invalid Credentials'})
            }
            else{
                const token=jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
             password===savedUser.password ? res.json({message:'sign in',token}):res.json({message:'passwordnotmatch'})
            }
        })
    }
})
module.exports=router;