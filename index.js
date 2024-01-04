const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 8000
require('./connection')
const User = require('./SchemaAndModal/UserScehama')
const bcrypt = require('bcryptjs')
const salt = 10


// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))


// Signup
app.post('/signup' ,async (req,res)=>{

    try {

        const body = req.body
        const newUser = new User({
            name:body.name,
            email:body.email,
            contact:body.contact,
            password:body.password,
            confirmpassword:body.password
        })

        if(req.body.password !== req.body.confirmpassword){
            return res.status(501).json({
                status:"Failed",
                message:"Password and confirmpassword does not match"
            })
        }

        if(body.name === '' || body.email===''  || body.contact==='' || body.password === ""  || body.confirmpassword === ''){
         return   res.status(400).json({
                status:"Failed",
                message:"Please fill all the fileds"
            })
        }
            const data = await newUser.save()

            res.status(200).json({
                status:"Success",
                data:data
            })
        
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }

})

// -------------------Login-------------
app.post('/login' , async(req,res)=>{
    try {
        const body = req.body
        // console.log(body)

        // console.log(req.body.email)
        try {
            const user = await User.find({email:req.body.email})
            // console.log(user[0].email)

            const verifyUser = await  bcrypt.compare(body.password , user[0].password)
            if(verifyUser ){
                res.status(200).json({
                    status:"Success"
                })
            }else{
                res.status(400).json({
                    status:"Failed",
                    message:"Please Check your email and password"
                })
            }

        } catch (error) {
            
            return res.status(404).json({
                status:"Failed",
                message:"Cannot find the user"
            })
        }


        // console.log(body.password)


    } catch (error) {
        res.status(404).json({
            status:"Failed",
            message:error.message
        })
    }
})


// to get all the user
app.get('/Allusers' , async (req,res)=>{
    const data = await User.find()
    res.status(200).json({
        status:"Success",
        data:data
    })
})



// Listening the server 
app.listen(PORT , ()=>{
    console.log("Server has been started")
})