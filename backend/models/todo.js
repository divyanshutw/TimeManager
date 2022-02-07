const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var schema=new Schema({
    title:{type:String, require:true},
    status:{type:Number, require:true},
    userId:{type:String,require:true},
    creation_dt:{type:Date,require:true}
} , {timestamps:true});


module.exports=mongoose.model('Todo',schema);
