import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allbenefits',
  templateUrl: './allbenefits.component.html',
  styleUrls: ['./allbenefits.component.scss']
})
export class AllbenefitsComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;
  AllPlans:any;
  loading:boolean=false
  planId:any
  planName:any
  AllBenefits:any
  BenefitPrices:any
  BenefitName:any
  AgesOfTpa:any;
  benefitNameAdd:any;
  benefitIdAdd:any;
  ageValue:any=''
  priceValue:any='';
  constructor(private _AdminService:AdminService ,private _ActivatedRoute:ActivatedRoute){
    this.planId=this._ActivatedRoute.snapshot.paramMap.get('PlanId')
    this.planName =this._ActivatedRoute.snapshot.paramMap.get('planName');
    console.log(this.planName);
  }
  

  getBenefitsOfPlan(){
    this.loading=true;
    this._AdminService.getBenefitsOfPlan(this.planId).subscribe(data=>{
      this.loading=false;
      this.AllBenefits =data;
      console.log(data);
      
    })
  }
  getBenefitPrices(benefitPrices:any,benefitName:any){
    this.BenefitPrices= benefitPrices;
    this.BenefitName = benefitName;
  }
  getAgesOfTpa(CustomerTpaId:any, benefitName:any, benefitId:any){
    console.log(CustomerTpaId);
    this.benefitNameAdd = benefitName
    this.benefitIdAdd=benefitId
    
    this._AdminService.GetAgesOfTpa(CustomerTpaId).subscribe(data=>{
      this.AgesOfTpa=data;
      console.log(this.AgesOfTpa);
    })
  }
  savePricing(){
    let Model ={
      price:this.priceValue,
      tpaAgeId:this.ageValue,
      benefitId:this.benefitIdAdd
    }
    console.log(Model);
    this._AdminService.AddPriceOfBenefit(Model).subscribe(res=>{
      console.log(res);
      Swal.fire(
        'Good job!',
        'The Price To Benefit Added Successfully',
        'success'
      )
      document.getElementById("closeAddPrice")?.click();
      this.getBenefitsOfPlan();
    },error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
    })
    
  }

                //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getBenefitsOfPlan()
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getBenefitsOfPlan()
  }

  ngOnInit(): void {
    this.getBenefitsOfPlan();
  }
}
