import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  constructor(private _AdminService:AdminService, public _AuthService:AuthService, public _Router:Router){
    console.log(this.roles); 
}
  roles:any= JSON.parse(localStorage.getItem("userType")!)?.roles


  redirectTo(uri: string) {
    this._Router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this._Router.navigate([uri]));
 }
 Customers(id:any){
  if(id == null){
    this.redirectTo("AllCustomers/")
  }
  this.redirectTo("AllCustomers/"+id)
 }
  ngOnInit(): void {
  }
}
