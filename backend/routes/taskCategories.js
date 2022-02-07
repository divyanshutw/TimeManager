var express=require('express');
var router=express.Router();
var TaskCategory=require('../models/taskCategory');
var User=require('../models/user');

//getAllCategories
router.get('/:userId', (req,res)=>{
    const userId=req.params.userId;

    TaskCategory.find({userId:userId})
        .then((taskCatDoc)=>{
            console.log('taskCategories.js L12 '+taskCatDoc);
            return res.status(200).json({success:true,categories:taskCatDoc});
        })
        .catch((err)=>{
            console.log('taskCategories L16 '+err);
            return res.status(501).json({success:false,message:'unable to fetch categories'});
        })
})

//addCategory
router.post('/:userId', (req,res)=>{
    const userId=req.params.userId;
    const title=req.body.title;
    const taskCategory=new TaskCategory({
        title:title,
        userId:userId
    });
    console.log('taskCategories.js L28 '+taskCategory+" title "+title);

    taskCategory.save()
        .then((doc)=>{
            console.log('Category added');
            return res.status(200).json({doc,taskCategoryId:taskCategory._id});
        })
        .catch((err)=>{
            console.log('taskCategories L35 '+err);
            return res.status(501).json(doc);
        });
})

module.exports = router;