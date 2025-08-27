import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.scss']
})
export class UrlComponent {
  curentUrl:any= ''
  constructor(public _CookieService:CookieService, private _Router:Router){
    console.log(localStorage.getItem("url"));
    if(localStorage.getItem("url")==null){
      this.curentUrl = "Server"
    }else{
      this.curentUrl= localStorage.getItem("url");
    }
    
  }
  UrlValue:any='';
  
  async saveUrl(){
    await localStorage.setItem('url',this.UrlValue+'/api/');
    await localStorage.removeItem('MedicalToken');
    await this._CookieService.delete('MedicalToken');
    await localStorage.removeItem("userType");
    await this._Router.navigate(['/login']);
    window.location.reload();
  }
  async ReSetUrl(){
    await localStorage.removeItem('url')  
    await localStorage.removeItem('MedicalToken')
    await this._CookieService.delete('MedicalToken')
    await localStorage.removeItem("userType");
    await this._Router.navigate(['/login']);
    window.location.reload()
  }
}
