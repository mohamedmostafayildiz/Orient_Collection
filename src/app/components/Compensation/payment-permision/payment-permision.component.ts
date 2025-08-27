import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import { ClaimsService } from 'src/app/services/claims.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-payment-permision',
  templateUrl: './payment-permision.component.html',
  styleUrls: ['./payment-permision.component.scss']
})
export class PaymentPermisionComponent {
  code:any;
  loading:boolean=false;
  PolicyId:any;
  AllData:any;
  CashedInputs:any

  constructor(private _ActivatedRoute:ActivatedRoute,private _ClaimsService:ClaimsService,private _SharedService:SharedService,
    private _PolicyService:PolicyService){
      
    this._ActivatedRoute.queryParams.subscribe((data:any)=>{
      this.CashedInputs = data;
      // console.log(this.CashedInputs);
    });
  }

  

  // Policy Details
  getData(){
    this.loading = true
    this._ClaimsService.GetClaimExchangePermit(this.CashedInputs.code).subscribe((data:any)=>{
      this.loading = false;
      this.AllData =data;
      console.log(this.AllData);
    },error=>{
      this.loading = false;
      console.log(error);
    })
  }
  print(){
    window.print();
  }
  ngOnInit(){
    this._SharedService.changeData(true,'','',false,false);
    this.getData()
  }
}
