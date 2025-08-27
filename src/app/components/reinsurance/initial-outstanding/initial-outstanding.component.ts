import { DatePipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
declare var $:any
@Component({
  selector: 'app-initial-outstanding',
  templateUrl: './initial-outstanding.component.html',
  styleUrls: ['./initial-outstanding.component.scss'],
  providers:[DatePipe]
})
export class InitialOutstandingComponent {
  loading:boolean=false
  AllPolices:any
  PolicyDetails:any
  PolicyId:any
  brokerCustomers:any
  PolicyGroup:any
  PolicyPlans:any
  date:any =new Date();
  CashedInputs:any
  Model:any
  BrokerIdVal:any=''
  isClicked:boolean = false
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)
  constructor(private _Router:Router,private _ActivatedRoute:ActivatedRoute, private _PolicyService:PolicyService, private _AdminService:AdminService , private datePipe:DatePipe){
    this._ActivatedRoute.queryParams.subscribe((data:any)=>{
      this.CashedInputs = data;
      console.log(data);
      this.SearchForm.get('Code')?.setValue(data?.Code)
      this.SearchForm.get('InsuredName')?.setValue(data?.InsuredName)
      this.SearchForm.get('BrokerId')?.setValue(data?.BrokerId==null?'':Number(data?.BrokerId)||data?.BrokerId==0?'':Number(data?.BrokerId))
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


  InnerModelSeaerch(){
    $("#SearchResults").show(500)  //
    this.Model = Object.assign(this.SearchForm.value,
      {Code:this.SearchForm.get('Code')?.value==null?'':this.SearchForm.get('Code')?.value},
      {InsuredName:this.SearchForm.get('InsuredName')?.value==null?'':this.SearchForm.get('InsuredName')?.value},
      {BrokerId:this.BrokerIdVal==null?'':this.BrokerIdVal},
      {UnderWritingYear:this.SearchForm.get('UnderWritingYear')?.value==null?'':this.SearchForm.get('UnderWritingYear')?.value},
      {From:this.SearchForm.get('From')?.value=='Invalid Date'?'':this.SearchForm.get('From')?.value==null?'':this.datePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd")},
      {To:this.SearchForm.get('To')?.value=='Invalid Date'?'':this.SearchForm.get('To')?.value==null?'':this.datePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")}
      )
    console.log(this.Model);
    
  }
  // Search
  Search(){
    $("#PolicyDetails").hide(500) //
    this.isClicked = true
    this.InnerModelSeaerch()
    this._PolicyService.SearchPolicy(this.Model).subscribe(data=>{
    this.isClicked = false
      $("#SearchResults").show(500)
      this.AllPolices = data
      console.log(data);
    },error=>{
      this.isClicked = false
      console.log(error);
    })
    this._Router.navigate(['/InitialOutstanding'],{
      queryParams:{Code:this.Model.Code,InsuredName:this.Model.InsuredName,BrokerId:this.BrokerIdVal,
        UnderWritingYear:this.Model.UnderWritingYear,From:this.Model.From,To:this.Model.To}
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
    localStorage.setItem("act_Nav",'Initial Outstanding')
    this.getBrokerCustomers()
    
    this.SearchForm.get('From')?.setValue(new Date(this.CashedInputs.From))
    this.SearchForm.get('To')?.setValue(new Date(this.CashedInputs.To))
    this.SearchForm.get('Code')?.setValue(this.CashedInputs.Code)
    this.SearchForm.get('InsuredName')?.setValue(this.CashedInputs.InsuredName)
    this.SearchForm.get('UnderWritingYear')?.setValue(this.CashedInputs.UnderWritingYear)
    if(Number(this.CashedInputs.BrokerId)>0){
      this.BrokerIdVal =Number(this.CashedInputs.BrokerId)
    }else{
      this.BrokerIdVal =''
    }
    this.Search()

  }
  
}
