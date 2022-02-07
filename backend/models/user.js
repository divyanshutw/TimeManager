const mongoose=require('mongoose');
const Schema=mongoose.Schema;
var bcrypt=require('bcrypt');

var schema=new Schema({
    email:{type:String,require:true},
    password:{type:String,require:true},
    fullname:{type:String,require:true},
    role:{type:Number,require:true},
    creation_dt:{type:Date,require:true}
} , {timestamps:true});

schema.statics.hashPassword= (password)=>{
    return bcrypt.hashSync(password,10);
}

schema.methods.isValid= (hashedPassword)=>{
    return bcrypt.compareSync(hashedPassword,this.password);
}

module.exports = mongoose.model('User',schema);