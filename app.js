require("dotenv").config();
require("./config/database").connect();
const express = require('express');
const bcrypt = require('bcrypt');

const User = require('./model/user');
const app=express();
app.use(express.json());

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
    const {firstName,lastName,email,password}=req.body;
    if(!(firstName && lastName && email && password)){
        res.status(400).send("All input is required");
    }
    const existingUser = await User.findOne({email}); // Promise
    if(existingUser){
        res.status(401).send("User already exist. Please login");
    }
    const myEncryptedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        firstName,
        lastName,
        email:email.toLowerCase(),
        password:myEncryptedPassword
    });
    return res.status(201).json(user);
});




module.exports=app;