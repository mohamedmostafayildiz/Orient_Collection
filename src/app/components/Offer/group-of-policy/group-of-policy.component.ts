import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-group-of-policy',
  templateUrl: './group-of-policy.component.html',
  styleUrls: ['./group-of-policy.component.scss']
})
export class GroupOfPolicyComponent {
  PolicyId:any
  AllPolicyGroup:any
  loading:boolean = false;
  
  constructor(private _ActivatedRoute:ActivatedRoute, private _PolicyService:PolicyService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }


  getGroupOfPolicy(){
    this.loading = true
    this._PolicyService.getGroupOfPolicy(this.PolicyId).subscribe(data=>{
      this.loading = false
      this.AllPolicyGroup = data;
      console.log(data);
    },error=>
    {
      console.log(error)
      this.loading = true
    })
  }


  ngOnInit(): void {
    this.getGroupOfPolicy()
  }
}
