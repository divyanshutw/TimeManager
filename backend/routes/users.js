var express = require('express');
var router = express.Router();
var User=require('../models/user');
var jwt=require('jsonwebtoken');
var bcrypt=require('bcrypt');


router.post('/register',(req,res,next)=>{
  // console.log('users.js 7 '+req.body.email);
  var user= new User({
    email:req.body.email,
    password:User.hashPassword(req.body.password),
    fullname:req.body.fullname,
    role:-1,
    creation_dt:Date.now()
  })
  
  user.save()
  .then((doc)=>{
    return res.status(201).json(doc);
  })
  .catch((err)=>{
    console.log("users.js L19 "+err);
    return res.status(501).json({message:'error registering user'});
  });
});

router.post('/login',(req,res,next)=>{
  console.log("users.js L27 "+req.body.loginPassword + " "+ req.body.loginEmail);
  User.findOne({
    email:req.body.loginEmail
  }).exec()
    .then( (doc)=>{
      if(doc){

        console.log('users.js L32 '+doc+ " "+req.body.loginPassword+" "+doc.password);
        bcrypt.compare(req.body.loginPassword,doc.password, (err,resbcrypt)=>{
          console.log("users.js L37 res= "+resbcrypt+" err = "+err);
          if(err){
            console.log("users.js L38 "+err);
            return res.status(501).json({message:'Invalid credentials'});
          }
          if(resbcrypt){
            console.log('users.js L41 password matched '+res);
            let token=jwt.sign({username:req.body.loginEmail},'secret', {expiresIn:'3h'});
            return res.status(200).json({success:true, message:"loginSuccess", token:token, user:doc});
          }
          else {
            // response is OutgoingMessage object that server response http request
            return res.status(200).json({success:false, message: 'password does not match'});
          }
        })
      }
      else{
        console.log("users.js L55 user not registered");
        return res.status(200).json({success:false, message: 'Email not registered'});
      }
    })
    .catch((err)=>{
      console.log("users.js L61 some internal error \n"+err);
      return res.status(501).json({message:''});
    })
})

module.exports = router;
