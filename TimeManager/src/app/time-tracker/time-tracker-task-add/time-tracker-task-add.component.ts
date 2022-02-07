import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeTrackerTaskStatus } from 'src/app/enum/enum';
import { Task } from 'src/app/model/task';
import { TimeTrackerTask } from 'src/app/model/time-tracker-task';
import { TimeTrackerTaskCategory } from 'src/app/model/TimeTrackerTaskCategory';
import { TaskService } from 'src/app/services/task.service';


@Component({
  selector: 'app-time-tracker-task-add',
  templateUrl: './time-tracker-task-add.component.html',
  styleUrls: ['./time-tracker-task-add.component.css'],
  providers:[DatePipe]
})
export class TimeTrackerTaskAddComponent implements OnInit {

  addTaskForm:any;
  isNewTask:boolean;
  isTaskFromTodo:boolean;
  newTask=new TimeTrackerTask(-3,'','','',0,"",TimeTrackerTaskStatus.Active,0,0);
  userId:number;
  categories:TimeTrackerTaskCategory[]=[];
  currentCategory:TimeTrackerTaskCategory;
  timeError:string="";
  mode:string="add";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,formBuilder:FormBuilder,private taskService:TaskService,public datepipe: DatePipe,private dialogRef: MatDialogRef<TimeTrackerTaskAddComponent>) { 
    this.isNewTask=data['task']._id==-1;
    this.isTaskFromTodo=data['task']._id==-2;

    if(this.isTaskFromTodo)
    this.newTask.title=data['task'].title;
    else if(!this.isNewTask){   //Task is neither from todo nor is a new task....means an active task is being edited;
      this.newTask=data['task'];
      this.mode='edit'    //Editing current task
    }
    this.userId=data['userId'];
    console.log("task id ",data['task']._id);

    if(!this.isNewTask){
      
    }

    this.addTaskForm=formBuilder.group({
      taskTitle:['',[Validators.required]],
      taskCategory:['',[Validators.required]],
      taskDescription:['',[Validators.required]],
      expectedCompletionTime:['',[Validators.required]],
      priority:['',[Validators.required, Validators.pattern("^[0-9]*$")]]
    });

    
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  formatDateTime(dateVal:any) : number{
    const date=dateVal.substring(0,4)+dateVal.substring(5,7)+dateVal.substring(8,10)+dateVal.substring(11,13)+dateVal.substring(14,16);
    return date;
  }

  onClickSubmit(){
    if(this.mode=='add'){
      const dateVal=this.addTaskForm.value.expectedCompletionTime;
      const date=this.formatDateTime(dateVal);
      
      const curTime=this.datepipe.transform(Date.now(),'yyyyMMddhhmm');
      console.log(curTime);
      if(date<Number(curTime))
      this.timeError="Invalid expected completion time";

      else{
        console.log('TimeTrackerTaskAddComponent.ts L75 '+Date.now() + " " + this.addTaskForm.value.expectedCompletionTime);
        const task=new TimeTrackerTask(0,this.addTaskForm.value.taskTitle,this.addTaskForm.value.taskCategory.title,this.addTaskForm.value.taskDescription,Date.now(),this.addTaskForm.value.expectedCompletionTime,TimeTrackerTaskStatus.Active,this.addTaskForm.value.priority,0);
        this.taskService.addTask(this.userId,task).subscribe( (data:any) => {
          task._id=data.taskId;
          console.log('TimeTrackerTaskAddComponent.ts L77 '+task.category);
          this.dialogRef.close({event:"success",data:{task:task,userId:this.userId}});
        },
        (err)=>{
          console.log('TimeTrackerTaskAdd L82 addTask failed');
          alert('Unable to add task');
        })
      }
    }
    
    //'editing task
    else{

      const task=new TimeTrackerTask(this.newTask._id,this.addTaskForm.value.taskTitle,this.addTaskForm.value.taskCategory.title,this.addTaskForm.value.taskDescription,Date.now(),this.addTaskForm.value.expectedCompletionTime.toString(),TimeTrackerTaskStatus.Active,this.addTaskForm.value.priority,0);

      this.taskService.editTask(this.userId,task).subscribe((data:any)=>{
        this.dialogRef.close({event:"success",data:{task:task,userId:this.userId}});
      },
      (err)=>{
        console.log('TimeTrackerTaskAddComponent.ts L101 '+err);
        alert('unable to update data');
      }
      )
    }
  }

  getAllCategories(){
    this.taskService.getAllCategoriesById(this.userId).subscribe( (data:any) => {
      if(data.success){
        console.log('TimeTrackerTaskCategory L90 '+data.categories.length+" \ncatArray= "+data.categories+ "\n "+data.categories[0]._id + data.categories[0].title);
        for(let i=0;i<data.categories.length;i++){
          this.categories.push(new TimeTrackerTaskCategory(data.categories[i]._id,data.categories[i].title));
          console.log('TimeTrackerTaskCategory L93 '+this.categories[i].title);
        }
        this.categories=data.categories;
        console.log('TimeTrackerTaskAddCompionent.ts L91 '+data.categories.size+" \ndata= "+this.categories[1].title);
      }
      else{
        console.log('TimeTrackerTaskAdd L100 getAllCategories failed');
        alert('Unable to get categories');
      }
    },
    (err)=>{
      console.log('TimeTrackerTaskAdd L105 '+err);
    })
    
    // this.categories=[new TimeTrackerTaskCategory(1,'Project'),new TimeTrackerTaskCategory(2,'Assignment'),new TimeTrackerTaskCategory(3,'Self study')];
  }

  timeChange(event:any){
    const date=this.formatDateTime(event.target.value);
    // const curTime=this.getCurTime();

    // 202202041557 202201061758
    const curTime=this.datepipe.transform(Date.now(),'yyyyMMddHHmm');
    console.log("TimeTrackerTaskAddComponent.ts L134 "+date+" "+curTime);
    if(Number(date)<Number(curTime)){
      this.timeError="Invalid expected completion time";
    }
    else
    this.timeError="";
  }

  getCurTime(){
    const curTime=new Date();
    const yr=Number(curTime.getFullYear());
    const mnth=Number(curTime.getMonth());
    const dt=Number(curTime.getDate());
    const hr=Number(curTime.getHours());
    const mn=Number(curTime.getMinutes());
    return (yr*100000000 + mnth*1000000 + dt*10000 + hr*100 + mn);
  }

  get taskTitle(){
    return this.addTaskForm.get('taskTitle');
  }
  get taskCategory(){
    return this.addTaskForm.get('taskCategory');
  }
  get taskDescription(){
    return this.addTaskForm.get('taskDescription');
  }
  get expectedCompletionTime(){
    return this.addTaskForm.get('expectedCompletionTime');
  }
  get priority(){
    return this.addTaskForm.get('priority');
  }

}
