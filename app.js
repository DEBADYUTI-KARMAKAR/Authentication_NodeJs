require("dotenv").config();
require("./config/database").connect();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('./model/user');
const auth = require('./middleware/auth');

const app=express();
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Hello World');
});

/*
Register user

get all information
check mandatory fields
already registered
takecare of password
generate token or success message

*/

app.post("/register", async (req, res) => {
    try{
        const {firstname,lastname,email,password}=req.body;
    if(!(firstname && lastname && email && password)){
        res.status(400).send("All input is required");
    }
    const existingUser = await User.findOne({email}); // Promise
    if(existingUser){
        res.status(401).send("User already exist. Please login");
    }
    const myEncryptedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        firstname,
        lastname,
        email:email.toLowerCase(),
        password:myEncryptedPassword
    });

    //token
    const token = jwt.sign(
        {user_id: user._id,email},
        process.env.SECRET_KEY,
        {
            expiresIn:"2h"
        }
    )
    user.token = token;

    //update or not in db
    

    //handle password situation
    user.password = undefined;


    // send token or send just success message and redirect.
    res.status(201).json(user);
    }catch(err){
        console.log(err);
    }

});

/*

get all information
check mandatory fields
get user from db
compare and verify password
give token or other information to the user
*/

app.post("/login", async (req, res) => {
    try{
        const {email,password}=req.body;
        if(!(email && password)){
            res.status(400).send("All input is required");
        }

        const user = await User.findOne({email});
        
        if(user && (await bcrypt.compare(password,user.password))){
            //token
            const token = jwt.sign(
                {user_id: user._id,email},
                process.env.SECRET_KEY,
                {
                    expiresIn:"2h"
                }
            )
            user.token = token;
            //update or not in db
            
            //handle password situation
            user.password = undefined;
            // send token or send just success message and redirect.
           // res.status(200).json(user); 

           //if you want to use cookie
           const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
           };
           res.status(200).cookie('token', token, options).json({
            status: true,
            token,
            user,
           });
        }
        res.status(400).send("Invalid Credentials");
    }catch(error){
        console.log(error);
    }

});

/*
Protecting routes
check for token presence
verify the token
extract information from payload
next()

*/

app.get("/dahsboard",auth,(req,res)=>{
    res.send("Welcome to secreat information");
})


module.exports=app;