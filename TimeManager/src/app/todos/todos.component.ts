import { Component, OnInit } from '@angular/core';
import {Task} from 'src/app/model/task';
import { TodosService } from '../services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  userId:any;

  ngOnInit(): void {
    this.getAllTodos()
    
  }

  tasks:Task[];
  constructor(private todosService:TodosService) {
    this.tasks=[];
    const parsedJson=JSON.parse(localStorage.getItem('currentUser')|| '{}');
    this.userId=parsedJson['id'];
  }


  addTaskEventEmitter($event:any){

    this.todosService.addTask(new Task($event.taskTitle),this.userId)
    .subscribe(
      (data:any)=>{
        console.log("todosComponent.ts L30 "+data.todoId);
        var task=new Task($event.taskTitle);
        task._id=data.todoId;
        console.log("todosComponent.ts L35 "+task._id);
        this.tasks.push(task);
        console.log("tasks",this.tasks);
      },
      (err)=>{
        console.log("todosComponent.ts L33 "+err);
      }
    )
  }


  getAllTodos(){
    this.todosService.getAllTodos(this.userId)
    .subscribe(
      (data)=>{
        console.log('todosComponent.ts L18 '+data);
        var jsonData:any=data;
        this.tasks=jsonData.todos;
      },
      (err)=>{
        console.log('todosComponent.ts L23 '+err);
      }
    )
  }
}
