import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
declare var $:any
@Component({
  selector: 'app-plans-and-ites-benfits',
  templateUrl: './plans-and-ites-benfits.component.html',
  styleUrls: ['./plans-and-ites-benfits.component.scss']
})
export class PlansAndItesBenfitsComponent implements OnInit{

  CustomerId:any
  AllPlans:any
  BenefitsDetails:any
  loading:boolean=false
  constructor(private _PolicyService:PolicyService, private _ActivatedRoute:ActivatedRoute){
    this.CustomerId=this._ActivatedRoute.snapshot.paramMap.get('customerId')
  }



        // Get All plans
  getAviliablePlansForCustomer(){
    this.loading=true
    this._PolicyService.getAviliablePlansForCustomer(this.CustomerId).subscribe(data=>{
    this.loading=false
      this.AllPlans = data
      console.log(data);
    },error=>{
    this.loading=true
    })
  }
      // get Benefits Details
  getPlanBenefitsDetails(benefits:any){
    console.log(benefits);
    this.BenefitsDetails=benefits
    if(benefits!=null){
      $("#details").show(500)
    }
  }
  goBack(){
    window.history.back()
  }

  ngOnInit(): void {
    this.getAviliablePlansForCustomer();
  }

}
