import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.scss']
})
export class PolicyDetailsComponent implements OnInit{
  PolicyId:any
  PolicyDetails:any
  loading:boolean=false
  constructor(private _ActivatedRoute:ActivatedRoute, private _PolicyService:PolicyService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }

  getPolicyById(){
    this.loading=true;
    this._PolicyService.getPolicyById(this.PolicyId).subscribe(data=>{
      this.loading=false;
      this.PolicyDetails = data;
      console.log(this.PolicyDetails);
      
    },error=>{
      this.loading=true;
       
     })
  }





  ngOnInit(): void {
    this.getPolicyById()
  }
}
