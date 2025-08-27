import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { AuthService } from 'medical/src/app/services/auth.service';
import { AuthService } from '../services/auth.service'; 


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  _JwtHelperService =new JwtHelperService()
  token:any = localStorage.getItem("MedicalToken");

  constructor( private _Router:Router,private _AuthService:AuthService){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        // if(this._JwtHelperService.isTokenExpired(this.token)){
        //   return false;
        // }else{
        //   this._Router.navigate(['/login'])
        //   localStorage.removeItem('TOKEN')
        //   localStorage.removeItem("expiresOn");
        //   return true
        // }
        if(this._AuthService.isLoggedIn()){
          return true
        }else{
          this._Router.navigate(['/login'])
          localStorage.removeItem('MedicalToken')
          localStorage.removeItem("expiresOn");
          return false
        }

      }
  }
  
