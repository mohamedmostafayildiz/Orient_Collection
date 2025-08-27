import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit{
  userId:any;
  constructor(private _AdminService:AdminService,private _ActivatedRoute:ActivatedRoute,private _Router:Router){
    const myQueryParam = this._ActivatedRoute.snapshot.queryParams['userId'];
    this.userId = myQueryParam
    console.log(this.userId);
    
  }


  checkUserValid(userId:any){
    localStorage.removeItem('existed')
    let Model = {
      userId:userId 
    }
    console.log(Model);
    
    this._AdminService.CheckUser(Model).subscribe( (res:any)=>{
      console.log(res.status);
      if(res.status=='true'){
        this._Router.navigate(['/ReInsuranceCompany'])
        localStorage.setItem('existed',JSON.stringify(res.status))
      }else{
        Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'User Not Found',
              })
      }
    },error=>{
      console.log(error);
    })
  }

  ngOnInit(): void {
    this.checkUserValid(this.userId)
    // localStorage.setItem('existed',JSON.stringify(true))
  }
}
