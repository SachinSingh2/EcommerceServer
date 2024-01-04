const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userScehma = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
})

userScehma.pre('save' , async function(next){
    console.log(this.password)
    this.password = await bcrypt.hash(this.password.toString() , 10)
    console.log(this.password)
    this.confirmpassword = await bcrypt.hash(this.confirmpassword.toString() , 10)
    this.confirmpassword = undefined
    next()
})

const User = mongoose.model('User' , userScehma)
module.exports = User