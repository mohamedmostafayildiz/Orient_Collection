import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-upload-plans-file',
  templateUrl: './upload-plans-file.component.html',
  styleUrls: ['./upload-plans-file.component.scss']
})
export class UploadPlansFileComponent implements OnInit{
  selectedFile:any=''
  isClickedDocumnet:boolean=false
  OfferId:any
  AllOfferPlans:any[]=[]
  AllPolicyExisit:boolean = false
  loading:boolean = false;
  arrTest:any[]=[]
  AddedNewPlans:any[]=[]
  uploadPlanEvent:any=''
  formData:any = new FormData()
  totalAnnual:any=0;
  constructor(public _location: Location,private _ToastrService:ToastrService,
    private _PolicyService:PolicyService, private _ActivatedRoute:ActivatedRoute,private _SharedService:SharedService,
    private _Router:Router, private _AdminService:AdminService){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.OfferId=Number(this.OfferId)
  }


  PlanForm:FormGroup = new FormGroup({
    planName:new FormControl('',[Validators.required]),
    netPremium :new FormControl('',[Validators.required]),
    totalSumInsured :new FormControl('',[Validators.required]),
  })
  RiskForm:FormGroup = new FormGroup({
    riskId:new FormControl('',[Validators.required]),
    annualMaxLimit :new FormControl('',[Validators.required]),
  })
  getRiskNameById(id: string): string {
    const risk = this.AllRisks.find((risk: { id: string; }) => risk.id === id);
    return risk ? risk.englishName : 'Unknown Risk';
  }

  uploadFile(event: any){
    // Get File Object
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value='' 
}

  getPlansOfOffer(){
    this._PolicyService.getPlansOfPolicy(this.OfferId).subscribe((data:any)=>{
      this.AllOfferPlans = data;
      console.log(data);
      if(this.AllOfferPlans && this.AllOfferPlans.length !== 0){
        $("#proceesButton").show(400)
      }else{
        $("#proceesButton").hide(400)
      }
    },error=>
    {
      console.log(error)
    })
  }

  aftersubmit:boolean=false
        ///////// Save Files ///////////////////
  SavePlans(){
    this.isClickedDocumnet=true
              /// Append
    console.log(this.arrTest);
    
    for(let i=0;i<this.arrTest.length;i++){
      this.formData.append('Plans['+ i +'].planName',this.arrTest[i].planName)
      this.formData.append('Plans['+ i+ '].netPremium',Number(this.arrTest[i].netPremium))
      this.formData.append('Plans['+ i+ '].totalSumInsured',Number(this.arrTest[i].totalSumInsured))
      for(let x=0;x<this.arrTest[i].risksLst.length;x++){
        this.formData.append('Plans['+ i +'].risksLst['+x+'].riskId',this.arrTest[i].risksLst[x].riskId)
        this.formData.append('Plans['+ i +'].risksLst['+x+'].annualMaxLimit',this.arrTest[i].risksLst[x].annualMaxLimit)
      }
    
    }this.formData.append('OfferId',this.OfferId);
    this.formData.append('PlanFile',this.selectedFile)
    // Log Enteries
    for (var pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

    this._PolicyService.AddPlansToOffer(this.formData).subscribe(res=>{
      this.aftersubmit=true
      this.arrTest = []
      this.AddedNewPlans = []
      $(".remove").hide(400)
      this.closeNewAccType()
      this._SharedService.setAlertMessage('Plan Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Plan Added Successfully','','success')
      this.isClickedDocumnet=false
      console.log("AddedPlans",res);
      this.clearFormData()
      this.getPlansOfOffer()
    },error=>{
      Swal.fire({icon: 'error',title:error.error,text:''}  )
      this.isClickedDocumnet=false
      console.log(error);
      this.clearFormData()
    })
    this.formData = new  FormData()
  }
            /// Delete Form Data
  clearFormData(){
    for(let i=0;i<this.arrTest.length;i++){
      this.formData.delete('PlansToAdd['+ i +'].planName')
      this.formData.delete('PlansToAdd['+ i+ '].annualMaxLimit')
      this.formData.delete('PlansToAdd['+ i+ '].netPremium')
    }
    this.formData.delete('OfferId');
    this.formData.delete('PlanFile');
  }
  view(){
    var item = this.arrTest.find(item=>this.PlanForm.get('planName')?.value == item.planName)
    var item2 = this.AllOfferPlans?.find(item=>this.PlanForm.get('planName')?.value == item.planName)
    if(item==undefined&&item2==undefined){
      let Model= {
        'planName':this.PlanForm.get('planName')?.value,
        'netPremium':this.PlanForm.get('netPremium')?.value,
        'totalSumInsured':this.PlanForm.get('totalSumInsured')?.value,
        'risksLst':this.ArrRisk
      }
      console.log(this.ArrRisk);

      this.arrTest.push(Model);
      this.AddedNewPlans.push(Model);
      this.PlanForm.reset()
      this.uploadPlanEvent='';
      this.ArrRisk=[]
      this.CalcTotalAnnual()
      
    }else{
      this._ToastrService.show('The Plan Name is Already Exist')
    }
    console.log(this.AddedNewPlans);
  }
  ArrRisk:any[]=[]
  viewRisk(){
    var item = this.ArrRisk.find(item=>this.RiskForm.get('riskId')?.value == item.riskId)
    if(item==undefined){
      this.ArrRisk.push(this.RiskForm.value);
      console.log(this.ArrRisk);
      
      this.RiskForm.reset();
      this.CalcTotalAnnual();
    }else{
      this._ToastrService.show('The Risk is Already Exist')
    }
    console.log(this.ArrRisk);
  }
  CalcTotalAnnual(){
    this.totalAnnual = 0;
    for(let i =0;i<this.ArrRisk.length ;i++){
      this.totalAnnual += Number(this.ArrRisk[i].annualMaxLimit)
    }
  }
  removeRisk(index:number){
    this.ArrRisk.splice(index, 1)
    this.CalcTotalAnnual();
  }
   //Remove item From Loss Participations List
   remove(index:number,planName:any){
    this.arrTest.splice(index, 1)

    var item = this.AddedNewPlans.find(item=>planName == item.PlanName)
    let i = this.AddedNewPlans.indexOf(item)


    this.AddedNewPlans.splice(i, 1)
    console.log(this.AddedNewPlans);
  }

 
  AllRisks:any
  GetAllRisks(){
    this._AdminService.GetAllRisks().subscribe((data:any)=>{
      this.AllRisks = data;
      console.log(data);
    },error=>{
      console.log(error)
    })
  }
  AddNewAccType(){  
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlayAddplan").fadeOut(300)
    $(".addnewplan").animate({right: '-30%'});
  }
  AllRisk:any
  getRiskInfo(Risk:any){
    $(".overlay").fadeIn(300)
    $(".delet").animate({right: '0px'});
    this.AllRisk = Risk
  }
  // ShowRisk(){  
  //   $(".overlay").fadeIn(300)
  //   $(".delet").animate({right: '0px'});
  // }
  closeShowRisk(){
    $(".overlay").fadeOut(300)
    $(".delet").animate({right: '-30%'});
  }

  ngOnInit(): void {
    this.getPlansOfOffer()
    this.GetAllRisks()
  }
}
