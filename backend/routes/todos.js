var express=require('express');
var router=express.Router();
var Todo=require('../models/todo');
var User=require('../models/user');


//get all todos
router.get('/:userId', (req,res,next)=>{
    const userId=req.params.userId;
    /*creation_dt:{
                $gte: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1),
                $lt: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
            }*/

    console.log("dates "+new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()));
    User.findOne({
        id:userId
    }).exec()
    .then((doc)=>{
        Todo.find({userId:userId})
            .then((todosDoc)=>{
                console.log("todos.js L24 "+todosDoc);
                return res.status(200).json({success:true,todos:todosDoc})
            })
            .catch((err)=>{
                console.log("todos.js L26 "+err);
                return res.status(501).json({success:false,message:'Unable to find todos'});
            })
    })
    .catch((err)=>{
        console.log("todos.js L17 "+err);
        return res.status(501).json({success:false,message:'Unable to find user'});
    })
});


//add todo
router.post('/addTodo/:userId', (req,res)=>{
    const userId=req.params.userId;
    const todo=new Todo({
        userId:userId,
        title:req.body.title,
        status:req.body.status,
        creation_dt:new Date()
    });
    console.log("todos.js L45 "+todo);

    User.findOne({
        id:userId
    }).exec()
    .then((doc)=>{
        console.log('todso.js L55 '+doc);

        todo.save()
            .then((doc)=>{
                console.log('todo added');
                return res.status(201).json({doc,todoId:todo._id});
            })
            .catch((err)=>{
                console.log("todos.js L55 "+err);
                return res.status(501).json({success:false,message:'Unable to save todo'});
            })
    })
    .catch((err)=>{
        console.log("todos.js L53 "+err);
        return res.status(501).json({success:false,message:'Unable to find user'});
    })
})

//edit todo
router.put('/editTodo/:userId', (req,res)=>{
    const userId=req.params.userId;
    const todo=req.body;
    console.log('todos.js L81 '+todo._id);

    if(todo.status===1)
    todo.status=2;
    else
    todo.status=1;

    console.log('todos.js L86  status chenged');
    Todo.findByIdAndUpdate(todo._id,todo, { useFindAndModify: false })
        .then((doc)=>{
            console.log('todo updated');
            return res.status(201).json(doc);
        })
        .catch((err)=>{
            console.log("todos.js L107 "+err);
            return res.status(501).json({success:false,message:'Unable to update todo'});
        });
    console.log('todos.js L96 end updtating todo');
})

//delete todo
router.delete('/deleteTodo/:todoId',(req,res)=>{
    const todoId=req.params.todoId;
    console.log('todos.js L107 '+todoId);

    Todo.findByIdAndDelete(todoId)
        .then((doc)=>{
            console.log('todo deleted');
            return res.status(201).json(doc);
        })
        .catch((err)=>{
            console.log("todos.js L112 "+err);
            return res.status(501).json({success:false,message:'Unable to delete todo'});
        });
})

module.exports = router