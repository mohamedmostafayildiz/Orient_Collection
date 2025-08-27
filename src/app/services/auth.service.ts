import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
      token:any = localStorage.getItem("MedicalToken");
      httpOptions:any = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' +this.token
          }).set("ngrok-skip-browser-warning", "true")
      };
  // baseUrl="http://97.74.82.75:1213/api/";
  // baseUrl="https://6f67-197-36-128-161.ngrok-free.app/api/"
  baseUrl:any
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private _HttpClient:HttpClient, private _Router:Router,private _CookieService:CookieService) {
    // this.user = this.getUser(localStorage.getItem('TOKEN')!)
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
   }
  _JwtHelperService =new JwtHelperService()
  logInForm(Model:any){
    // this.user = this.getUser(localStorage.getItem('TOKEN')!) 
    return this._HttpClient.post(this.baseUrl+'Users/Login' , Model );
  }
  signUp(Model:any){
    return this._HttpClient.post(this.baseUrl+'users/adduser' , Model ,this.httpOptions)
  }
  getAllUsers(){
    return this._HttpClient.get(this.baseUrl+'users/getAll' ,this.httpOptions);
  }
    //    Edit Uster
  EditUser(Model:any){
      return this._HttpClient.put(this.baseUrl+'Users/EditUser',Model ,this.httpOptions)
  }
    //    Delete Uster
  DeleteUser(id:any){
      return this._HttpClient.delete(this.baseUrl+'Users/DeleteUser?id='+id ,{responseType:'text',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")})
  }
    //    Change Password
changePassword(body:any){
  return this._HttpClient.post(this.baseUrl+'Users/changePassword' ,body,{responseType:'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  getRoles(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetUsersRoles' ,this.httpOptions)
  }
  redirectTo(uri: string) {
    this._Router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this._Router.navigate([uri]));
 }
 isLoggedIn(){
  // var token = localStorage.getItem("MedicalToken");
  // var token = this._CookieService.get('MedicalToken')
  // return !this._JwtHelperService.isTokenExpired(token);
  // return JSON.parse(token); 
  // return !!localStorage.getItem("MedicalToken")
   return JSON.parse(localStorage.getItem("existed")!)
  //  console.log(JSON.parse(localStorage.getItem("existed")!));
   
  }


  // GetPermissionsForUser
  GetPermissionsForUser(userId:any){
    return this._HttpClient.get(this.baseUrl+'Permission/GetPermissionsForUser?UserId='+userId ,this.httpOptions)
  }

  // ManagePermissions
  ManagePermissions(body:any){
    return this._HttpClient.post(this.baseUrl+'Permission/ManagePermissions',body ,this.httpOptions)
  }
}


