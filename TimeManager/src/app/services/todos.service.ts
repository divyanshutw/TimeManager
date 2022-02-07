import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  url="http://localhost:3000";

  constructor(private http:HttpClient) {}

  addTask(body:any,userId:any){
    return this.http.post(`${this.url}/todos/addTodo/${userId}`, body, {
      observe:'body'
    });
  }

  getAllTodos(userId:any){
    return this.http.get(`${this.url}/todos/${userId}`, {
      observe:'body'
    });
  }

  editTodo(userId:any,body:any){
    return this.http.put(`${this.url}/todos/editTodo/${userId}`, body, {
      observe:'body'
    });
  }

  deleteTodo(todoId:Number){
    console.log('TodosService.ts L35 '+todoId);
    return this.http.delete(`${this.url}/todos/deleteTodo/${todoId}`,{observe:'body'});
  }
}
