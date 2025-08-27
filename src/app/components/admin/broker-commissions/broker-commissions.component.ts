import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-broker-commissions',
  templateUrl: './broker-commissions.component.html',
  styleUrls: ['./broker-commissions.component.scss']
})
export class BrokerCommissionsComponent implements OnInit{
  customerId:any
  customerName:any
  customerCommissions:any
  loading:boolean=false
  constructor(private _ActivatedRoute:ActivatedRoute, private _AdminService:AdminService){
    this.customerId= this._ActivatedRoute.snapshot.paramMap.get('id')
    this.customerName= this._ActivatedRoute.snapshot.paramMap.get('name')
  }


  getCommissionsOfCustomer(){
    this._AdminService.getCommissionsOfCustomer(this.customerId).subscribe(data=>{
      this.customerCommissions=data;
      console.log(data);
    })
  }





  ngOnInit(): void {
     this.getCommissionsOfCustomer();
  }

}
