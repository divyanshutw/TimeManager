import { TimeTrackerTaskStatus } from "../enum/enum";

export class TimeTrackerTask{
    _id:any;
    title:string;
    category:String;
    description:string;
    startTime:number;
    endTime:number;
    expectedCompletionTime:string;
    status:TimeTrackerTaskStatus;
    priority:number;
    efficiency:number;
    
    constructor(_id:any,title:string,category:String,description:string,startTime:number,expectedCompletionTime:string,status:TimeTrackerTaskStatus,priority:number,efficieny:number){
        this._id=_id;
        this.title=title;
        this.category=category;
        this.description=description;
        this.startTime=startTime;
        this.expectedCompletionTime=expectedCompletionTime;
        this.status=status;
        this.priority=priority;
        this.efficiency=efficieny;
    }
}