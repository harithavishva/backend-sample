var express = require('express');
var router = express.Router();
const {UserModel} = require('../schemas/userSchema')
const mongoose = require('mongoose')
const {dbUrl} = require('../common/dbConfig')
const {hashPassword,hashCompare, createToken, validate,roleAdminGaurd} = require('../common/auth')
mongoose.connect(dbUrl)

/* GET users listing. */
//GET
// wil give next,actually called as middleware
//router.get('/', async function(req, res) {
  //   res.send(email="haritha@gmail.com");
router.get('/',validate,roleAdminGaurd,async function(req, res) {
try {
  let users = await UserModel.find()
  res.status(200).send({
    users,
    message:"User Data fetch Successfully"
  })
} catch (error) {
  res.status(500).send({
    message:"Internal Server Error",
    error
  })
}
});

//GETBY ID
router.get('/:id', async function(req, res) {
  
  //   res.send(email="haritha@gmail.com");
  try {
    let user = await UserModel.findOne({_id:req.params.id});
    res.status(200).send({
      user,
      message:"User Data fetch Successfully"
    })
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
  });

//POST(ADD)
router.post('/signup',async(req,res)=>{
  
try {
  let user = await UserModel.findOne({email:req.body.email})
  if(!user)
  {
  // let user = await UserModel.create(req.body)
  let hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword
  //same
  let user = await UserModel.create(req.body)
  res.status(201).send({
    message:"User Signup Successfully"
    //hashedPassword
  })
}
  else
  {
    res.status(400).send({message:"User Already Exists"})
  }
} catch (error) {
  res.status(500).send({
    message:"Internal Server Error",
    error
  })
}
});
//POST(ANOther)
router.post('/login',async(req,res)=>{
  
  try {
    
    let user = await UserModel.findOne({email:req.body.email})
    if(user)
    {
    // let user = await UserModel.create(req.body)
    //let hashedPassword = await hashPassword(req.body.password)
    //req.body.password = hashedPassword
    //same
    //let user = await UserModel.create(req.body)

    //verifying the password
    if(await hashCompare(req.body.password,user.password)){
      //create the token
      let token = await createToken({
        name: user.name,
        email: user.email,
        id:user._id,
        role:user.role
      })
    res.status(201).send({
      message:"User login Successfully",
      token
      //hashedPassword
    })
  }
  else{
    res.status(402).send({message:"Invaid Credentials"})
  }
  }
    else
    {
      res.status(400).send({message:"User does not Exists"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
  });
//PUT(UPDATE)
router.put('/:id',async(req,res)=>{
  
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    if(user)
    {
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.password
      
    await user.save()
    // let user = await UserModel.updateOne({_id:req.params.id},req.body)
    res.status(201).send({
      message:"User updated Successfully"
    })
  }
    else
    {
      res.status(400).send({message:"User doesn't Exists"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
  });
//DELETE
router.delete('/:id',async(req,res)=>{
  
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    if(user)
    {
    let user = await UserModel.deleteOne({_id:req.params.id})
    res.status(201).send({
      message:"User deleted Successfully"
    })
  }
    else
    {
      res.status(400).send({message:"User doesn't Exists"})
    }
  } catch (error) {
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
  });

module.exports = router;
