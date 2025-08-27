import { DatePipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-setting-policy',
  templateUrl: './setting-policy.component.html',
  styleUrls: ['./setting-policy.component.scss'],
  providers:[DatePipe]
})
export class SettingPolicyComponent {
  loading:boolean=false
  AllPolices:any
  PolicyDetails:any
  PolicyId:any
  brokerCustomers:any
  PolicyGroup:any
  PolicyPlans:any
  date:any =new Date();
  CashedInputs:any
  constructor(private _Router:Router,private _ActivatedRoute:ActivatedRoute, private _PolicyService:PolicyService, private _AdminService:AdminService , private datePipe:DatePipe){
    this._ActivatedRoute.queryParams.subscribe((data:any)=>{
      this.CashedInputs = data
      console.log(data);
      this.SearchForm.get('Code')?.setValue(data?.Code)
      this.SearchForm.get('InsuredName')?.setValue(data?.InsuredName)
      this.SearchForm.get('BrokerId')?.setValue(Number(data?.BrokerId))
      this.SearchForm.get('UnderWritingYear')?.setValue(data?.UnderWritingYear)
    });
    
  }
  SearchForm:FormGroup = new FormGroup({
    'Code':new FormControl(''),
    'InsuredName':new FormControl(''),
    'BrokerId':new FormControl(''),
    'UnderWritingYear':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl('')
  })

  getAllPolices(){
    this._PolicyService.getAllPolices().subscribe((data:any)=>{
      // console.log(data);
      this.AllPolices =data;
    })
  }
  
  // Search
  Search(){
    $("#SearchResults").show(500)  //
    let Model = Object.assign(this.SearchForm.value,
      {Code:this.SearchForm.get('Code')?.value==null?'':this.SearchForm.get('Code')?.value},
      {InsuredName:this.SearchForm.get('InsuredName')?.value==null?'':this.SearchForm.get('InsuredName')?.value},
      {BrokerId:this.SearchForm.get('BrokerId')?.value==null?'':this.SearchForm.get('BrokerId')?.value},
      {UnderWritingYear:this.SearchForm.get('UnderWritingYear')?.value==null?'':this.SearchForm.get('UnderWritingYear')?.value},
      {From:this.SearchForm.get('From')?.value==null?'':this.SearchForm.get('From')?.value},
      {To:this.SearchForm.get('To')?.value==null?'':this.SearchForm.get('To')?.value}
      )
    // console.log(Model);
    // this._PolicyService.SearchPolicy(Model).subscribe(data=>{
    //   $("#SearchResults").show(500)
    //   this.AllPolices = data
    //   console.log(data);
    // },error=>{
    //   console.log(error);
    // })
    this._Router.navigate(['/PolicySetting'],{
      queryParams:{Code:Model.Code,InsuredName:Model.InsuredName,BrokerId:Model.BrokerId,
        UnderWritingYear:Model.UnderWritingYear,From:Model.From,To:Model.To}
    })
  }
  getLittleDetails(id:any){
    $("#PolicyDetails").show(500) //
    this.loading = true
    this._PolicyService.getThePolicyById(id).subscribe((data:any)=>{
      this.loading = false
      this.PolicyDetails = data;
      this.PolicyGroup = data.group
      this.PolicyPlans = data.plans
      console.log(data);
    },error=>{
      this.loading = false;
      console.log(error);
    })
  }
  //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe(data=>{
      this.brokerCustomers= data
    })
  }
  ngOnInit(){
    this.getAllPolices()
    this.getBrokerCustomers()
    
    this.SearchForm.get('From')?.setValue(new Date(this.CashedInputs.From))
    this.SearchForm.get('To')?.setValue(new Date(this.CashedInputs.To))
  }
}
