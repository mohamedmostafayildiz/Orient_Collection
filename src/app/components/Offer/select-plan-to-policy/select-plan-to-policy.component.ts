import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-select-plan-to-policy',
  templateUrl: './select-plan-to-policy.component.html',
  styleUrls: ['./select-plan-to-policy.component.scss']
})
export class SelectPlanToPolicyComponent implements OnInit{

  CustomerId:any
  PolicyId:any
  Type:any
  PlanId:any=''
  AllPlans:any
  BenefitsDetails:any
  FamilyPersons:any
  loading:boolean=false
  PolicyGroup:any
  PolicyPlans:any
  isClicked:boolean = false;
  constructor(private _ActivatedRoute:ActivatedRoute ,private _PolicyService:PolicyService,private _Router:Router){
    // this.CustomerId = this._ActivatedRoute.snapshot.paramMap.get('customerId');
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
    // this.Type = this._ActivatedRoute.snapshot.paramMap.get('type');
  }


        //incase has Family
        // get Plans of family ( by policy Id )
  FianlArr:any[]=[]

  getPlanSelectedAndPersonIdTest(planId:any, PersonId:any){
    let Model = {
      planId:Number(planId),
      personId:PersonId
  }
  
    let exisit = this.FianlArr.find(item=>item.personId==PersonId)
    let index =this.FianlArr.indexOf(exisit)
    // console.log(exisit);
    // console.log(index);
    if(exisit==undefined){
    this.FianlArr.push(Model)
    }else{
      this.FianlArr.splice(index,1)
      this.FianlArr.push(Model)
    }
    console.log(this.FianlArr);
  }



        // Submit Assign plan To Customer
  SubmitAssignPlanToCustomer(){
    let Model={
      policyId:Number(this.PolicyId),
      planId:Number(this.PlanId)
    }
    this._PolicyService.AssignPlanToCustomer(Model).subscribe((res:any)=>{
      console.log(res);
      
      Swal.fire(
        'Good job!',
        res.planName+' Assigned Successfully',
        'success'
      )
    },error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
    })
    
  }
  // Assign plan To Family Persons
  // SubmitAssignPlanToFamily(){
  //   this._PolicyService.AssignPlanToFamily(this.FianlArr).subscribe(res=>{
  //     console.log(res);
  //     Swal.fire(
  //       'Good job!',
  //       ' Assigned Successfully',
  //       'success'
  //     )
  //   },error=>{
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: error.error,
  //     })
  //   })
  // }
      // Get Family persons By Policy Id
  getFamilyPersonsByPolicyId(){
    this._PolicyService.getFamilyPersonsByPolicyId(this.PolicyId).subscribe(data=>{
      this.FamilyPersons=data
    })
  }


      // Get All plans
  getAviliablePlansForCustomer(){
    this.loading=true
    this._PolicyService.getAviliablePlansForCustomer(this.CustomerId).subscribe(data=>{
    this.loading=false
      this.AllPlans = data
      // console.log(data);
    },error=>{
    this.loading=true
    })
  }
      // get Benefits Details
  getPlanBenefitsDetails(benefits:any){
    // console.log(benefits);
    this.BenefitsDetails=benefits
    console.log((this.BenefitsDetails));
    
    if(benefits!=null){
      $("#details").show(500)
    }
  }

  // Assign Plan To Group
  AssignPlanToGroup(){
    this.isClicked =true
    this._PolicyService.AssignPlanToGroup(this.FianlArr).subscribe(res=>{
      this.isClicked = false
      console.log(res);
      Swal.fire(
        'Your Plans Assigned Succesfully',
        '',
        'success'
      )
      this._Router.navigate(['/OfferCalculations/'+this.PolicyId])
    },error=>{
      this.isClicked = false
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.error,
        text: '',
      })
    })
  }
  // Get Group Of Policy
  getGroupOfPoilcy(){
    this.loading=true
    this._PolicyService.getGroupOfPoilcy(this.PolicyId).subscribe(data=>{
      this.loading = false
      console.log(data);
      this.PolicyGroup = data;
    },error=>{
      this.loading = false
    })
  }
  // Get Plans Of Policy
  getPlansOfPoilcy(){
    this._PolicyService.getPlansOfPoilcy(this.PolicyId).subscribe(data=>{
      this.PolicyPlans = data;
      console.log(this.PolicyPlans);
    })
  }
  ngOnInit(): void {
    this.getGroupOfPoilcy()
    this.getPlansOfPoilcy()
  }
}
