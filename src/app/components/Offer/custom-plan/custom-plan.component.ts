import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-custom-plan',
  templateUrl: './custom-plan.component.html',
  styleUrls: ['./custom-plan.component.scss']
})
export class CustomPlanComponent implements OnInit{
  PlanId:any
  Contries:any
  AllPlans:any
  BenefitsOfPlan:any[]=[]
  arr:any[]=[]
  PlanName:any=''
  AnnualMaxLimit:any=''
  loading:boolean =false
  customerId:any
  CustomerId:any
  PolicyId:any
  Type:any
  CoverageValTest:any
  arrTest:any[]=[]
  constructor(private _Router:Router,private _ActivatedRoute:ActivatedRoute ,private _AdminService:AdminService,private _PolicyService:PolicyService){
    this.CustomerId = this._ActivatedRoute.snapshot.paramMap.get('customerId');
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('policyId');
    this.Type = this._ActivatedRoute.snapshot.paramMap.get('type');
  }
  
  detectChanges(event:any,itemm:any,id:any){
    if(event.checked==true){
      // this.arr.push(Number(event.source.id))
      let item =this.arrTest.find(item=>item.id==id)
      console.log(item);
      if(item==undefined){
        console.log("Undefind");
        this.arrTest.push(itemm) /// Attention
        this.formTest.reset()
        console.log(this.arrTest);
        
      }
      
    }else if(event.checked==false){
      // let index =this.arr.indexOf(Number(event.source.id))
      // this.arr.splice(index,1)
      let item =this.arrTest.find(item=>item.id==id)
      let i = this.arrTest.indexOf(item)
      this.arrTest.splice(i,1)
      console.log(this.arrTest);
    }
    // console.log(this.arr);
    // console.log(this.arrTest);
    
  }
  // get Coverage Test 
  formTest:FormGroup=new FormGroup({
    coverage:new FormControl('')
  })
  getCoverageTest(event:any,index:any){
   
    this.arrTest[index].coverage =this.formTest.get('coverage')?.value
    // console.log(this.formTest.get('coverage')?.value);
    console.log(this.arrTest);
    
    
  }

  getAnnual(plan:any){
    this.AnnualMaxLimit = plan
  }

  getPlanIdValue(value:any){
    $("#CustomFields").show(400)
    this.arr=[];
    this.PlanId =value;
    this.getBenefitsOfPlan()
  }

  getAllPalns(){
    this._AdminService.getTpaPlans().subscribe(data=>{
      this.AllPlans = data
      console.log(data);
    })
  }
  getBenefitsOfPlan(){
    this.loading=true
    this._AdminService.getBenefitsOfPlan(this.PlanId).subscribe((data:any)=>{
      this.arrTest=[];   //
      this.loading=false
      this.BenefitsOfPlan =data;
      console.log(data);
    
      for(var i=0; i<this.BenefitsOfPlan.length;i++){
       this.customerId=this.BenefitsOfPlan[0]?.customerId
       this.arr.push(this.BenefitsOfPlan[i]?.id);

      //  start 
      var Model = {
        id:this.BenefitsOfPlan[i].id,
        coverage:this.BenefitsOfPlan[i].coverage
      }
      this.arrTest.push(Model)
      // End
      }
     
      console.log(this.arrTest);

      // console.log(this.arr);
    },error=>{
    this.loading=true
    })
  }
        // Submit Customized Plan
  submitCustomPlan(){
    let Model={
      benefitsIds:this.arr,
      customerId:Number(this.CustomerId),
      planName:this.PlanName,
      annualMaxLimit:this.AnnualMaxLimit,
      planId:Number(this.PlanId)
    }
    console.log(Model);
    this._PolicyService.AddCustomizedPlan(Model).subscribe((res:any)=>{
      console.log(res);
      Swal.fire('Great!', res.planName+" Customized Successfully", "success");
      if(this.Type=='individual'){
        this._Router.navigate(['/SelectPlanToPolicy/individual/'+this.CustomerId+'/'+this.PolicyId])
      }else{
        this._Router.navigate(['/SelectPlanToPolicy/family/'+this.CustomerId+'/'+this.PolicyId])
      }

    },error=>{
      console.log(error);
    })
    
  }
  ngOnInit(): void {
    this.getAllPalns();
  }

}
