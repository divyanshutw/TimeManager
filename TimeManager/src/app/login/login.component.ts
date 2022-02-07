import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder,FormControl,FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginServiceService } from '../services/login-service.service';
import { User } from '../model/user';
import { Member } from '../model/member';
import { UserType } from '../enum/enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  ngOnInit(): void {
  }

  userlogin = true;
  userregister = false;
  wrongEmailPassword=false;
  loginMsg:string="";
  registerForm:any;
  loginForm1:any;
  confirmPasswordMatches:boolean=false;

  currentUser:any;

  private _isLoggedIn=new BehaviorSubject<boolean>(false);
  isLoggedIn=this._isLoggedIn.asObservable();


  @Output() closeLogin:EventEmitter<boolean>;
  @Output() loginSuccess:EventEmitter<boolean>;

  //Buttons clicks functionalities 

  constructor(formBuilder:FormBuilder,private loginService:LoginServiceService, private router: Router){
    this.closeLogin=new EventEmitter();
    this.loginSuccess=new EventEmitter();

    this.loginService.user.subscribe((x:any) => this.currentUser=x);

    this.registerForm=formBuilder.group({
      fullname:['',[Validators.required,Validators.minLength(8)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      confirmPassword:['',[Validators.required,this.passValidator]]
    });
    
    //cutomValidator
    this.registerForm.controls.password.valueChanges.subscribe( (x:any) => this.registerForm.controls.confirmPassword.updateValueAndValidity())

    this.loginForm1=formBuilder.group({
      loginEmail:['',[Validators.required,Validators.email]],
      loginPassword:['',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]]
    });
  }
  user_register()
  {
    this.userlogin = false;
    this.userregister = true;
  }
  user_login()
  {
    this.userlogin = true;
    this.userregister = false;
  }

  onClickClose($event:any){
    this.closeLogin.emit(true);
  }

  onClickLogin($event:any){
    //check email and password and login
    // if(true){     //password correct

    //   this.loginService.login(this.loginForm1.value.email,this.loginForm1.value.password)
    //   .subscribe( (response:any) =>{
    //     if(response.status == false){
    //       alert(response.message);
    //       this.loginMsg=response.message;
    //       this.loginSuccess.emit(true);

    //       return false;

    //     }
    //     else{
    //       this.loginMsg=response.message;
    //       localStorage.setItem("jwtToken",response.token);
    //       this.loginSuccess.emit(true);
    //       this._isLoggedIn.next(true);
    //       return true;
    //     }
    //   })

    //   //TODO: Delete below 4 lines
    //   // localStorage.setItem("userType","admin");
    //   localStorage.setItem("jwtToken","I_am_a_randomtoken");
    //   this.loginSuccess.emit(true);
    //   this._isLoggedIn.next(true);
      


    // }
    // else{
    //   this.wrongEmailPassword=true;
    // }


    var jsonData:any;
    console.log(this.loginForm1.value);
    this.loginService.login(this.loginForm1.value)
    .subscribe(
      (data) => {
        jsonData=data;
        if(jsonData.success){
          console.log(data);
          this.loginMsg="Login successful";

          this.saveInStorage(jsonData);

          this.loginSuccess.emit(true);
          this._isLoggedIn.next(true);
          return true;
        }
        else{
          console.log("LoginComponent.ts L126 ");
          this.loginMsg=jsonData.message;

          //this.loginSuccess.emit(true);
          
          return false;
        }
        
      },
      (error) => {
        console.log("LoginComponent.ts L137 "+error.message);
        alert(error);
        this.loginMsg="Login failed";

        //this.loginSuccess.emit(true);
        
        return false;
      }
    )
  }

  saveInStorage(jsonData:any){
    localStorage.setItem("jwtToken",jsonData.token.toString());
    let role;
    if(jsonData.user.role==-1)
    role=UserType.User;
    else
    role=UserType.Admin;
    const user:User={id:jsonData.user._id,email:jsonData.user.email,password:'',fullname:jsonData.user.fullname,role:role,members:jsonData.user.members};

    // console.log("LoginComponent.ts L160 "+jsonData.user.members.length + " "+ user.members[0].id);

    localStorage.setItem('currentUser', JSON.stringify(user));
    
    
    // new User(jsonData.user._id,jsonData.user.email,'',jsonData.user.fullname,jsonData.user.role,[])
  }


  onClickRegister(){
    // if(this.registerForm.value.password !== this.registerForm.value.confirmPassword){
    //   this.confirmPasswordMatches=false;
    // }

    console.log(this.registerForm.value);
    this.loginService.submitRegister(this.registerForm.value)
    .subscribe(
      (data) => {
        this.user_login();
      },
      (error) => {
        alert('Some error in registering user')
      }
    )
  }

//custom validator for confirm password
  passValidator(control:AbstractControl){
    if(control && (control.value!==null || control.value!==undefined)){

      const confirmPassvalue=control.value;
      const passControl=control.root.get('password');

      if(passControl){
        const passValue=passControl.value;
      
        if(passValue!==confirmPassvalue || passValue===''){
          return {
            isError:true
          };
        }
      }
    }
    return null;
  }

//   checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
//   let pass = group.get('password').value;
//   let confirmPass = group.get('confirmPassword').value
//   return pass === confirmPass ? null : { notSame: true }
// }

  get fullname(){
    return this.registerForm.get('fullname');
  }

  get email(){
    return this.registerForm.get('email');
  }

  get password(){
    return this.registerForm.get('password');
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  get loginEmail(){
    return this.loginForm1.get('loginEmail');
  }
  get loginPassword(){
    return this.loginForm1.get('loginPassword');
  }
  

}
