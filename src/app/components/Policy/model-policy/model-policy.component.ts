import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-model-policy',
  templateUrl: './model-policy.component.html',
  styleUrls: ['./model-policy.component.scss']
})
export class ModelPolicyComponent {
  code:any;
  loading:boolean=false;
  PolicyId:any;
  policyDetails:any;
  constructor(private _ActivatedRoute:ActivatedRoute,
    private _PolicyService:PolicyService,){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
    
  }
  

  // Policy Details
  getPolicyDetails(){
    this.loading = true
    this._PolicyService.getThePolicyById(this.PolicyId).subscribe((data:any)=>{
      this.loading = false;
      this.policyDetails =data;
      console.log(this.policyDetails);
    },error=>{
      this.loading = false;
      console.log(error);
    })
  }
  print(){
    window.print();
  }
  ngOnInit(){
    this.getPolicyDetails()
  }
}
