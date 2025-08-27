import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  val:any='en';
  @Output() SideStatus=new EventEmitter()
  roles:any= JSON.parse(localStorage.getItem("userType")!)?.roles
  constructor(public _CookieService:CookieService, public _AuthService:AuthService, private _Router:Router, private _TranslateService:TranslateService){
    _TranslateService.addLangs(['en', 'ar'])
    if(localStorage.getItem('lang')==null){
      _TranslateService.setDefaultLang('en')
    }else{
      _TranslateService.setDefaultLang(localStorage.getItem('lang')!)
      this.val = localStorage.getItem('lang')!
    }
  }

  handleSideBar(){
    this.SideStatus.emit()
  }
  
  logOut(){
    localStorage.removeItem('MedicalToken')
    localStorage.removeItem('permissions')
    this._CookieService.delete('MedicalToken')
    // localStorage.removeItem("expiresOn");
    localStorage.removeItem('userType');
    // localStorage.removeItem('act_Nav');
    // localStorage.removeItem('act_Tab');
    this._Router.navigate(['/login']);
  }
  

  getLanguage(e:any){
    localStorage.setItem('lang',e.target.value)
    this._TranslateService.use(e.target.value)
  }
}
