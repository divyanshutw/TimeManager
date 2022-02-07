const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var schema=new Schema({
    title:{type:String,require:true},
    userId:{type:String,require:true}
});

module.exports = mongoose.model('TaskCategory',schema);