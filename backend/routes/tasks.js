var express=require('express');
var router=express.Router();
var Task=require('../models/task');
var User=require('../models/user');
var moment = require('moment'); 

//getAllTasksById
router.get('/:userId', (req,res,next)=>{
    const userId=req.params.userId;
    console.log("task.js L9 " + userId);
    Task.find({userId:userId})
        .then((tasksDoc)=>{
            console.log("tasks.js L12 "+tasksDoc);
            return res.status(200).json({success:true,tasks:tasksDoc})
        })
        .catch((err)=>{
            console.log("tasks.js L16 "+err);
            return res.status(501).json({success:false,message:'Unable to find tasks'});
        });
})

//addTask
router.post('/addTask/:userId', (req,res)=>{
    console.log("tasks.js L23 "+req.params.userId+" "+req.body.expectedCompletionTime);
    // var exCT=req.body.expectedCompletionTime;
    // exCT=exCT.substring(0,4)+exCT.substring(5,7)+exCT.substring(8,10)+exCT.substring(11,13)+exCT.substring(14,16);
    // console.log('tasks.js L26 '+exCT);
    const userId=req.params.userId;
    const task=new Task({
        userId:userId,
        title:req.body.title,
        category:req.body.category,
        description:req.body.description,
        startTime:req.body.startTime,
        expectedCompletionTime:req.body.expectedCompletionTime,
        status:req.body.status,
        priority:req.body.priority,
        efficiency:0,
        creation_dt:new Date(),
        userId:userId
    });
    console.log("tasks.js L36 "+task.title);

    task.save()
        .then((doc)=>{
            console.log('task added');
            return res.status(201).json({doc,taskId:task._id});
        })
        .catch((err)=>{
            console.log("tasks.js L44 "+err);
            return res.status(501).json({success:false,message:'Unable to save task'});
        })
})

//editTask
router.put('/editTask/:userId', (req,res)=>{
    const userId=req.params.userId;
    const task=req.body;
    console.log('tasks.js L57 '+task.expectedCompletionTime);

    // var exCT=req.body.expectedCompletionTime;
    // exCT=exCT.substring(0,4)+exCT.substring(5,7)+exCT.substring(8,10)+exCT.substring(11,13)+exCT.substring(14,16);
    // task.expectedCompletionTime=exCT;

    console.log('tasks.js L86  edited');
    Task.findByIdAndUpdate(task._id,task, { useFindAndModify: false })
        .then((doc)=>{
            console.log('task updated');
            return res.status(201).json(doc);
        })
        .catch((err)=>{
            console.log("tasks.js L70 "+err);
            return res.status(501).json({success:false,message:'Unable to update task'});
        });
    console.log('tasks.js L73 end updtating task');
})

//updateEndTime
router.put('/endTask/:userId', (req,res)=>{
    const userId=req.params.userId;
    const task=req.body;
    console.log('tasks.js L80 '+task.expectedCompletionTime + ' ' + task.endTime + ' ' + task.startTime);

    // var exCT=req.body.expectedCompletionTime;
    // exCT=exCT.substring(0,4)+exCT.substring(5,7)+exCT.substring(8,10)+exCT.substring(11,13)+exCT.substring(14,16);
    // task.expectedCompletionTime=exCT;

    task.endTime=Date.now();
    task.status=2;

    //TODO:calculate efficiency
    console.log("tasks.js L92");
    
    let st=new Date(task.startTime);
    st=Number(st.getFullYear()*100000000 + (st.getMonth()+1)*1000000 + st.getDate()*10000 + st.getHours()*100 + st.getMinutes());
    let exct=Number(task.expectedCompletionTime.substring(0,4)+task.expectedCompletionTime.substring(5,7)+task.expectedCompletionTime.substring(8,10)+task.expectedCompletionTime.substring(11,13)+task.expectedCompletionTime.substring(14,16));
    let curDate=new Date();
    const et=Number(curDate.getFullYear()*100000000 + (curDate.getMonth()+1)*1000000 + curDate.getDate()*10000 + curDate.getHours()*100 + curDate.getMinutes());
    let eff=(exct-st)/(et-st)*100;
    if(eff<1)
    eff*=100;
    eff=(Math.round( eff * 100) / 100).toFixed(2);;

    console.log('tasks.js L96 '+ st + ' ' + exct + ' ' + et + ' eff= '+eff);

    task.efficiency=eff;


    console.log('tasks.js L86  ended');
    Task.findByIdAndUpdate(task._id,task, { useFindAndModify: false })
        .then((doc)=>{
            console.log('task ended');
            return res.status(201).json({success:true,task:task});
        })
        .catch((err)=>{
            console.log("tasks.js L93 "+err);
            return res.status(501).json({success:false,message:'Unable to end task'});
        });
    console.log('tasks.js L96 end updtating task');

})

//deleteTask
router.delete('/deleteTask/:taskId',(req,res)=>{
    const taskId=req.params.taskId;
    console.log('tasks.js L107 '+taskId);

    Task.findByIdAndDelete(taskId)
        .then((doc)=>{
            console.log('task deleted');
            return res.status(201).json(doc);
        })
        .catch((err)=>{
            console.log("tasks.js L112 "+err);
            return res.status(501).json({success:false,message:'Unable to delete task'});
        });
})

module.exports=router;