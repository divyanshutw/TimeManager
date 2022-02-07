import { Component, Input, OnInit } from '@angular/core';
import { TaskStatus } from '../enum/enum';
import {Task} from 'src/app/model/task'
import { TodosService } from '../services/todos.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @Input() tasks:any;
    userId:any;

  constructor(private todosService:TodosService) { 
    const parsedJson=JSON.parse(localStorage.getItem('currentUser')|| '{}');
    this.userId=parsedJson['id'];
  }

  ngOnInit(): void {
  }

  isChecked(task:Task){
    return task.status===TaskStatus.Done;
  }

  changeStatus(task:Task){

    this.todosService.editTodo(this.userId,task)
      .subscribe(
        (data:any)=>{
          console.log("taskListComponent.ts L30 "+data);
          if(task.status == TaskStatus.Active){
            task.status=TaskStatus.Done;
          }
          else{
            task.status=TaskStatus.Active;
          }
        },
        (err)=>{
          console.log("taskListComponent.ts L33 "+err);
        }
      )
    
  }

  deleteTask(task:Task){

    console.log('task-TaskListComponent.ts L49 '+task.title)
    this.todosService.deleteTodo(task._id)
    .subscribe(
      (data:any)=>{
        console.log("taskListComponent.ts L52 "+data);
          
        let index=this.tasks.findIndex((item:Task) => item['_id'] == task._id);
        this.tasks.splice(index,1);
      },
      (err)=>{
        console.log("taskListComponent.ts L59 "+err);
      }
    )

    
  }

}
