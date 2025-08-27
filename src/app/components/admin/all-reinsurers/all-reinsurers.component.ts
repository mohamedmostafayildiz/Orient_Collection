import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-all-reinsurers',
  templateUrl: './all-reinsurers.component.html',
  styleUrls: ['./all-reinsurers.component.scss']
})
export class AllReinsurersComponent implements OnInit{

  AllReinsurers:any
  ReInsurerId:any=null
  constructor(private _AdminService:AdminService){}
  


  getInsurerId(id:any){
    this.ReInsurerId = id
  }
  





  getAllReinsurers(){
    this._AdminService.GetAllReInsurerCustomer().subscribe(data=>{
      this.AllReinsurers = data
    })
  }


  ngOnInit(): void {
    this.getAllReinsurers()
  }
}
