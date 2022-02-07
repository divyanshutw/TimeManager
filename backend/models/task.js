const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var schema=new Schema({
    title:{type:String,require:true},
    category:{type:String,require:true},
    description:{type:String,require:true},
    startTime:{type:Number,require:true},
    endTime:{type:Number,require:true},
    expectedCompletionTime:{type:String,require:true},
    status:{type:Number,require:true},
    priority:{type:String,require:true},
    efficiency:{type:String,require:true},
    userId:{type:String,require:true}
});

module.exports = mongoose.model('Task',schema);