import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-plans-of-policy',
  templateUrl: './plans-of-policy.component.html',
  styleUrls: ['./plans-of-policy.component.scss']
})
export class PlansOfPolicyComponent implements OnInit{
  PolicyId:any
  AllPolicyPlans:any
  loading:boolean = false;
  
  constructor(private _ActivatedRoute:ActivatedRoute, private _PolicyService:PolicyService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }

  getPlansOfPolicy(){
    this.loading = true
    this._PolicyService.getPlansOfPolicy(this.PolicyId).subscribe(data=>{
      this.loading = false
      this.AllPolicyPlans = data;
      console.log(data);
    },error=>
    {
      console.log(error)
      this.loading = true
    })
  }


  ngOnInit(): void {
    this.getPlansOfPolicy()
  }

}
