import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, OnChanges   } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';


import { TimeTrackerTaskStatus } from 'src/app/enum/enum';
import { Member } from 'src/app/model/member';
import { TimeTrackerTask } from 'src/app/model/time-tracker-task';
import { TimeTrackerTaskCategory } from 'src/app/model/TimeTrackerTaskCategory';
import { TaskService } from 'src/app/services/task.service';
import { TimeTrackerCategoryAddComponent } from '../time-tracker-category-add/time-tracker-category-add.component';
import { TimeTrackerTaskAddComponent } from '../time-tracker-task-add/time-tracker-task-add.component';
import { Task } from 'src/app/model/task';

@Component({
  selector: 'app-time-tracker-task-list',
  templateUrl: './time-tracker-task-list.component.html',
  styleUrls: ['./time-tracker-task-list.component.css']
})
export class TimeTrackerTaskListComponent implements OnInit {

  @Input() member:Member;

  activeTasksDataSource!:MatTableDataSource<any>;
  completedTasksDataSource!:MatTableDataSource<any>;
  activeTasksDisplayedColumns:string[]=['title','category','description','startTime','endTime','expectedCompletionTime','status','priority','efficiency','edit','delete'];

  completedTasksDisplayedColumns:string[]=['title','category','description','startTime','endTime','expectedCompletionTime','status','priority','efficiency','delete'];

  allTasks:TimeTrackerTask[]=[];
  categories:TimeTrackerTaskCategory[]=[];
  activeTasks:TimeTrackerTask[]=[];
  completedTasks:TimeTrackerTask[]=[];

  @ViewChild('paginator') paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;

  constructor(private taskService:TaskService, public addCategoryDialog:MatDialog,public addTaskDialog:MatDialog, private changeDetectorRefs: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    console.log("TimeTrackerTaskListComponent.ts L44 "+this.member.id);
    this.getAllCategoriesById(this.member.id);
    this.getAllTasksById(this.member.id);

  }

  ngOnChanges(){
    console.log("TimeTrackerTaskListComponent.ts L44 cahnged "+this.member.id);
    this.getAllCategoriesById(this.member.id);
    this.getAllTasksById(this.member.id);
  }

  public getAllCategoriesById(memberId:number){
    // this.taskService.getAllCategoriesById(this.member.id).subscribe((data:any) => {
    //   //TODO: fetch categories from API and save in this.categories and parse json
    //   this.categories=data;
    // });

    // //Dummy data
    // const category1=new TimeTrackerTaskCategory(1,'category1');
    // const category2=new TimeTrackerTaskCategory(2,'category2');
    // this.categories=[category1,category2];
  }

  public getAllTasksById(memberId:number){
    this.taskService.getAllTasksById(this.member.id).subscribe( (data:any) => {
      if(data.success){
        this.allTasks=[];

        console.log('TimeTrackerTaskListComponent.ts L62 '+data.tasks.length );

        data.tasks.forEach((task:any)=>{
          var backendTask=new TimeTrackerTask(task._id,task.title,task.category,task.description,task.startTime,task.expectedCompletionTime,task.status,task.priority,task.efficiency);
          backendTask.endTime=task.endTime;
          
          this.allTasks.push(backendTask);
          this.segregateTasks();
          this.matInit();
        })
      }
      else{
        console.log('TimeTrackerTaskListComponent.ts L65 Unable to get tasks');
        alert('Unable to get tasks');
      }
      // this.allTasks=data;

    });


    //Dummy data
    //   const task1=new TimeTrackerTask(1,'task1','desc1','category1',Date.now(),Date.now(),
    //   TimeTrackerTaskStatus.Active,2,40);
    //   task1.endTime=Date.now();
    //   const task2=new TimeTrackerTask(2,'task1','desc1','category1',Date.now(),Date.now(),TimeTrackerTaskStatus.Active,2,80);
    //   const task3=new TimeTrackerTask(3,'task1','desc1','category1',Date.now(),Date.now(),TimeTrackerTaskStatus.Done,2,80);
    //   task3.endTime=Date.now();
    //   const task4=new TimeTrackerTask(4,'task1','desc1','category1',Date.now(),Date.now(),TimeTrackerTaskStatus.Delayed,2,80);
    //   const task5=new TimeTrackerTask(5,'task1','desc1','category1',Date.now(),Date.now(),TimeTrackerTaskStatus.Delayed,2,80);
    //   this.allTasks=[task1,task2,task3,task4,task5];

    //   this.segregateTasks();
    //   this.matInit();

  }

  checkDelayed(expectedTime:string){
    const dateVal=this.formatDateTime(expectedTime);
    let curDate=new Date();
    const curDateNum=Number(curDate.getFullYear()*100000000 + (curDate.getMonth()+1)*1000000 + curDate.getDate()*10000 + curDate.getHours()*100 + curDate.getMinutes());
    console.log(curDateNum +" " +dateVal+(curDateNum>Number(dateVal)));

    if(curDateNum>Number(dateVal))
    return TimeTrackerTaskStatus.Delayed;
    else
    return TimeTrackerTaskStatus.Active;
  }
  formatDateTime(dateVal:any) : number{
    const date=dateVal.substring(0,4)+dateVal.substring(5,7)+dateVal.substring(8,10)+dateVal.substring(11,13)+dateVal.substring(14,16);
    return date;
  }

  segregateTasks(){
    this.activeTasks=[];
    this.completedTasks=[];

    var j=0;var k=0;
    for (var i in this.allTasks){
      if(this.allTasks[i].status===TimeTrackerTaskStatus.Active || this.allTasks[i].status===TimeTrackerTaskStatus.Delayed){
          this.allTasks[i].status=this.checkDelayed(this.allTasks[i].expectedCompletionTime)
          this.activeTasks[j++]=this.allTasks[i];
        }
      else
        this.completedTasks[k++]=this.allTasks[i];
      console.log(this.allTasks[i]._id);
    }

    this.activeTasks.sort(this.sortByPriority);
  }

  matInit(){
    this.completedTasksDataSource=new MatTableDataSource(this.completedTasks);
    this.activeTasksDataSource=new MatTableDataSource(this.activeTasks);
    
    console.log("TimeTrackerTaskListComponent.ts L132 "+this.completedTasksDataSource.sort);

    this.completedTasksDataSource.paginator=this.paginator;
    this.completedTasksDataSource.sort=this.sort;
  }

  sortByPriority( a:TimeTrackerTask, b:TimeTrackerTask ) {
  if ( a.priority < b.priority ){
    return 1;
  }
  if ( a.priority > b.priority ){
    return -1;
  }
  return 0;
}

  filterData($event:any){
    this.completedTasksDataSource.filter=$event.target.value;
  }

  ngAfterViewInit(){
    // this.completedTasksDataSource.sort=this.sort;
    // this.completedTasksDataSource.paginator=this.paginator;
  }

  endTask(task:TimeTrackerTask){

    this.taskService.endTask(this.member.id,task).subscribe((data:any)=>{
      console.log('TimeTrackerTaskListComponent.ts L129 '+data.success+" "+data.task._id);
      if(data.success)    //Task edit successful
      {

        var backendTask=new TimeTrackerTask(data.task._id,data.task.title,data.task.category,data.task.description,data.task.startTime,data.task.expectedCompletionTime,data.task.status,data.task.priority,data.task.efficiency);
          backendTask.endTime=data.task.endTime;

        console.log('TimeTrackerTaskListComponent.ts L132 '+data.success+" "+backendTask._id);
        // this.activeTasks.forEach((element,index)=>{
        //   if(element._id===backendTask._id) 
        //   delete this.activeTasks[index];
        // });
        // this.completedTasks.push(backendTask);
        // this.completedTasksDataSource.data=this.completedTasks;

        this.activeTasks=[];this.completedTasks=[];
        console.log("no. of active tasks ",this.activeTasks.length);
        console.log("no. of completed tasks ",this.completedTasks.length);

        // this.activeTasksDataSource=new MatTableDataSource(this.activeTasks);
        // this.completedTasksDataSource=new MatTableDataSource(this.completedTasks);

        this.getAllCategoriesById(this.member.id);
        this.getAllTasksById(this.member.id);      
      }
      else{
        console.log('TimeTrackerTaskListComponent.ts L140 ');
        alert('unable to endtask');
      }
    },
    (err)=>{
      console.log('TimeTrackerTaskListComponent.ts L145 '+err);
      alert('unable to endtask');
    }
    )

    console.log('end task called ',task._id);
    // task.endTime=Date.now();
    // task.status=TimeTrackerTaskStatus.Done;
    

    // //TODO: delete below code
    // this.activeTasks.forEach((element,index)=>{
    //       if(element._id==task._id) 
    //       this.activeTasks.splice(index,1);
    //     });
    // this.completedTasks.unshift(task);

    

    

    

  }

  editActiveTask(task:TimeTrackerTask){
    console.log(task.title);
    let dialogRef=this.addTaskDialog.open(TimeTrackerTaskAddComponent,{data: {task:new TimeTrackerTask(task._id,task.title,task.category,task.description,task.startTime,task.expectedCompletionTime,task.status,task.priority,task.efficiency),
    userId:this.member.id}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result.event){
        console.log('TimeTrackerTaskListComponent.ts L165 '+result+" "+result.data+" "+result.event + " " + result.data.task._id);

        for(let i=0;i<this.activeTasks.length;i++){
          if(this.activeTasks[i]._id===result.data.task._id){
            this.activeTasks[i]=result.data.task;
            this.activeTasksDataSource=new MatTableDataSource(this.activeTasks);
          }
        }

        this.activeTasks.sort(this.sortByPriority);

        // this.activeTasks.unshift(result.data.task);
        
      }
    })
  }

  deleteActiveTask(task:TimeTrackerTask){
    console.log('delete active task called ',task._id);

    this.taskService.deleteTask(this.member.id,task._id).subscribe((data:any) => {
      if(true)    //Task deletion successful
      {
        this.activeTasks.forEach((element,index)=>{
          if(element._id==task._id) 
          this.activeTasks.splice(index,1);
        })
      }
    })

    //TODO: delete below code
    this.activeTasks.forEach((element,index)=>{
          if(element._id==task._id) 
          this.activeTasks.splice(index,1);
    })

    this.activeTasksDataSource=new MatTableDataSource(this.activeTasks);
  }

  deleteCompletedTask(task:TimeTrackerTask){
    console.log('delete completed task called ',task._id);

    this.taskService.deleteTask(this.member.id,task._id).subscribe((data:any) => {
        console.log("taskListComponent.ts L52 "+data);
          
        this.completedTasks.forEach((element,index)=>{
          if(element._id==task._id) 
          this.completedTasks.splice(index,1);
        })
        this.completedTasksDataSource=new MatTableDataSource(this.completedTasks);
      },
      (err)=>{
        console.log("taskListComponent.ts L59 "+err);
      }
    )

    // //TODO: delete below code
    // this.completedTasks.forEach((element,index)=>{
    //       if(element._id==task._id) 
    //       this.completedTasks.splice(index,1);
    // })

    // this.completedTasksDataSource=new MatTableDataSource(this.completedTasks);

  }


  onClickAddCategory(){
    let dialogRef=this.addCategoryDialog.open(TimeTrackerCategoryAddComponent,{data: this.member});

    dialogRef.afterClosed().subscribe( result=> {
      console.log("result of closeing dialog ",result);
    });
  }

  onClickAddTask(){
    let dialogRef=this.addTaskDialog.open(TimeTrackerTaskAddComponent,{data: {task:new TimeTrackerTask(-1,'','','',0,"",TimeTrackerTaskStatus.Active,0,0),
    userId:this.member.id}
  });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("TimeTrackerTaskListComponent.ts L240 "+result.event);

      if(result.event)
      console.log("TimeTrackerTaskListComponent.ts L243 "+result+" "+result.data+" "+result.event);

      this.activeTasks.unshift(result.data.task);
      this.activeTasks.sort(this.sortByPriority);
      this.activeTasksDataSource=new MatTableDataSource(this.activeTasks);

    })
  }
}
