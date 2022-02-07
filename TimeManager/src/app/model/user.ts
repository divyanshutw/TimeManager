import { UserType } from "../enum/enum";
import { Member } from "./member";

export class User {
    id: number;
    email: string;
    password: string;
    fullname: string;
    role: UserType;
    token?: string;
    members: Member[];
    // constructor(id:number,email:string,password:string,fullname:string,role:UserType,members:Member[]){
    //     this.id=id;
    //     this.email=email;
    //     this.password=password;
    //     this.fullname=fullname;
    //     this.role=role;
    //     this.members=members;
    // }
}