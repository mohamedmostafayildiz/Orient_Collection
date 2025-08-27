import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
  isAurher:any
  // Permissions:any[]=JSON.parse(localStorage.getItem("permissions")!)
  constructor( private _AuthService:AuthService ,private _Router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    const isAutherized =JSON.parse(localStorage.getItem("permissions")!).includes(route.data[0])
    if(!isAutherized){
      Swal.fire({
        icon: 'error',
        title: '403',
        text: 'You Are Not Allowed To Access That Details',
      })
      this._Router.navigate(['/Forbidden'])
      
    }
    return isAutherized
  }
  
}
