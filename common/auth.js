const brcypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//SAlT
const saltRounds = 10
//we can give secretkey
// const secretkey = "AFhAJSyIOJH@#$TYUUA"

const hashPassword = async(password)=>{
let salt = await brcypt.genSalt(saltRounds)
console.log(salt)
let hashedPassword = await brcypt.hash(password,salt)
return hashedPassword
}


const hashCompare = async(password,hashedPassword)=>{
return await brcypt.compare(password,hashedPassword)
}

//creating Token
//another way
//const createToken = async({name,email,id,role})=>{

const createToken = async(payload)=>{
    console.log(payload)
 let token = await jwt.sign(payload,process.env.secretkey,{expiresIn:'2m'})
 return token
}
//middleware- inbetween req nd response validate
const validate = async(req,res,next)=>{
    //console.log(req.headers.authorization.split(" ")[1])
    //Time based Authentication
if(req.headers.authorization)
{
//if(true){
   //next()
   let token = req.headers.authorization.split(" ")[1]
   let data = await jwt.decode(token)
   //console.log(data.exp)
   if(Math.floor((+new Date())/1000) < data.exp)
   next()
   else 
       res.status(402).send({message:"Token Expired"})
}
else
{
    res.status(400).send({message:"Token not Found"})
}
}
//roleAuthentication
const roleAdminGaurd = async(req,res,next)=>
{
    if(req.headers.authorization)
    {
    //if(true){
       //next()
       let token = req.headers.authorization.split(" ")[1]
       let data = await jwt.decode(token)
       //console.log(data.exp)
       if(data.role==='admin')
       next()
       else 
           res.status(401).send({message:"Only Admins are Allowed"})
    }
    else
    {
        res.status(400).send({message:"Token not Found"})
    }
}

module.exports={hashPassword,hashCompare,createToken,validate,roleAdminGaurd}