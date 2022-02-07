import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { TimeTrackerTask } from '../model/time-tracker-task';
import { TimeTrackerTaskCategory } from '../model/TimeTrackerTaskCategory';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  url="http://localhost:3000";

  constructor(private http:HttpClient) {} 

  public getAllCategoriesById(userId:any){
    return this.http.get(`${this.url}/taskCategories/${userId}`,{
      observe:'body'
    });
  }

  public addCategory(userId:any,title:string){
    console.log('task.service.ts L22 '+title);
    return this.http.post(`${this.url}/taskCategories/${userId}`,new TimeTrackerTaskCategory(1,title),{
      observe:'body'
    });
  }

  public getAllTasksById(userId:any){
    return this.http.get(`${this.url}/tasks/${userId}`,{ observe:'body'});
  }

  public addTask(userId:number,task:TimeTrackerTask){
    console.log('taskService.ts L33 '+userId+" " + task.title);
    return this.http.post(`${this.url}/tasks/addTask/${userId}`,task,{ observe:'body'});
  }

  public deleteTask(userId:number,taskId:number)
  {
    console.log('TasksService.ts L35 '+taskId);
    return this.http.delete(`${this.url}/tasks/deleteTask/${taskId}`,{observe:'body'});
  }  

  public editTask(userId:number,task:TimeTrackerTask)
  {
    return this.http.put(`${this.url}/tasks/editTask/${userId}`,task,{ observe:'body'});
  }
  public endTask(userId:number,task:TimeTrackerTask)
  {
    return this.http.put(`${this.url}/tasks/endTask/${userId}`,task,{ observe:'body'});
  }
  
}
