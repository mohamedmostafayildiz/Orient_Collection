import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-editoffer',
  templateUrl: './editoffer.component.html',
  styleUrls: ['./editoffer.component.scss'],
  providers: [DatePipe]

})
export class EditofferComponent implements OnInit {
  
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[20,5,8,10,15];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  loading:boolean=false
  BusinessTypeValue:any
  BusinessTypes:any
  IndividualOrCorporate:any
  listOfTpa:any
  BrokerValue:any =''
  brokerCustomers:any =''
  OfferDetails:any
  selectedPlanFile:any=''
  selectedGroupFile:any=''
  OfferPlans:any[]=[]
  OfferGroup:any
  removedPlans:any[]=[]
  AddedPlans:any[]=[]
  loadingDetails:boolean=false;
  formData:any = new FormData()
  InsuranceClasses:any[]=[]
  cusDate:any
  FileName: any;
  isClicked:boolean = false
  totalAnnual:any=0;
  arrTest:any[]=[]
  ResetTest:any[]=[]
  AddedNewPlans:any[]=[]
  uploadPlanEvent:any=''
  OfferId:any
  AllOfferPlans:any[]=[]

  constructor(private _SharedService:SharedService, public datePipe: DatePipe,private _Router:Router, private _PolicyService:PolicyService, private _AdminService:AdminService, private _ToastrService:ToastrService, private _ActivatedRoute:ActivatedRoute,){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.OfferId=Number(this.OfferId)
    console.log(this.OfferId);
    
  }
  
  AllOffers:any              
  term:any

  getAllOffers(){
    this.loading=true;
    this._PolicyService.getAllOffers().subscribe((data:any)=>{
      console.log(data);
      this.AllOffers =data;
      this.loading=false;
    })
  }

  ///////////////>* Edit Offer *</////////////

              ///Form
  PricingIndivualForm:FormGroup = new FormGroup({
    'OfferDate':new FormControl('',[Validators.required]),
    'TpaId':new FormControl(''),
    'InsuranceClass':new FormControl('',[Validators.required]),
    'PolicySource':new FormControl('',[Validators.required]),
    'BusinessType':new FormControl('',[Validators.required]),
    'BrokerId':new FormControl(0,[Validators.required]),
  })
              ///Add Plan Form
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
    // console.log(risk);
    
    return risk ? risk.englishName : 'Unknown Risk';
  }
  hideRiskTable(){
    $("#RiskTable").hide()
  }
      // get offer Details To Edit
      transformedPlans:any[]=[]
  getOfferDetailsToEdit(){
    $("#RiskTable").hide()
    
    this.resetModalWhenOpen()
    this.loadingDetails=true
    this._PolicyService.getOfferById(this.OfferId).subscribe((data:any)=>{
      console.log("offerdetailsById",data);
      
      this.loadingDetails=false
      this.OfferDetails = data;
      // this.arrTest = data.plans;
      this.OfferPlans = data.plans;

      // console.log(this.arrTest);

      this.OfferPlans = data.plans.map((plan: {
        totalSumInsured: any; id:any,planName: any; netPremium: any; risks: { id: any; annualMaxLimit: any; }[]; }) => ({
        id:plan.id,
        planName: plan.planName,
        netPremium: plan.netPremium,
        totalSumInsured: plan.totalSumInsured,
        risksLst: plan.risks.map((risk: { id: any; annualMaxLimit: any; }) => ({
          riskId: risk.id, // Assuming englishName as riskId
          annualMaxLimit: risk.annualMaxLimit
        }))
      }));
      // console.log(this.arrTest);
      
      
      this.OfferGroup = data.customerGroups
      
      this.setValuesToInputs()
    },error=>{
      this.loadingDetails=false
    })
  }
      // Set Values to Inputs
  setValuesToInputs(){
    if(this.OfferDetails.policySourceInt==1){
      $("#BrokerFiled").show()
    }else{
      $("#BrokerFiled").hide()
    }
    if(this.OfferDetails.brokerId==null||this.OfferDetails.brokerId=='null'||this.OfferDetails.brokerId==''){
    this.PricingIndivualForm.get("BrokerId")?.setValue(0)
    }else{
    this.PricingIndivualForm.get("BrokerId")?.setValue(this.OfferDetails.brokerId)
    }
    this.PricingIndivualForm.get("TpaId")?.setValue(this.OfferDetails?.tpaId)
    this.PricingIndivualForm.get("OfferDate")?.setValue(this.OfferDetails?.offerDate)
    this.PricingIndivualForm.get("InsuranceClass")?.setValue(this.OfferDetails?.insuranceClassInt)
    this.PricingIndivualForm.get("PolicySource")?.setValue(this.OfferDetails?.policySourceInt)
    this.PricingIndivualForm.get("BusinessType")?.setValue(this.OfferDetails?.businessTypeInt)
  }
      //////////////////////////////////// SaveUpdate //////////////// //////////////////
    SaveUpdate(){
      this.isClicked = true
              /// Append removed plans
        for(let i=0;i<this.removedPlans.length;i++){
          this.formData.append('PlansToRemove['+ i +']',this.removedPlans[i])
        }
              ///// Append Added Plans
        // for(let i=0;i<this.AddedPlans.length;i++){
        //   this.formData.append('PlansToAdd['+ i +'].planName',this.AddedPlans[i].planName)
        //   this.formData.append('PlansToAdd['+ i +'].annualMaxLimit',this.AddedPlans[i].annualMaxLimit)
        //   this.formData.append('PlansToAdd['+ i +'].netPremium',this.AddedPlans[i].netPremium)
        // }
        for (let i = 0; i < this.AddedPlans.length; i++) {
          this.formData.append(`PlansToAdd[${i}].planName`, this.AddedPlans[i].planName);
          this.formData.append(`PlansToAdd[${i}].netPremium`, this.AddedPlans[i].netPremium);
          this.formData.append(`PlansToAdd[${i}].totalSumInsured`, this.AddedPlans[i].totalSumInsured);
      
          // Iterate over risksLst and append each risk
          for (let j = 0; j < this.AddedPlans[i].risksLst.length; j++) {
              this.formData.append(`PlansToAdd[${i}].risksLst[${j}].riskId`, this.AddedPlans[i].risksLst[j].riskId);
              this.formData.append(`PlansToAdd[${i}].risksLst[${j}].annualMaxLimit`, this.AddedPlans[i].risksLst[j].annualMaxLimit);
          }
      }
        this.formData.append('PlanFile',this.selectedPlanFile) 
        this.formData.append('TpaId',this.PricingIndivualForm.get('TpaId')?.value==null?'':this.PricingIndivualForm.get('TpaId')?.value) 
                // Append group file
        this.formData.append('GroupFile',this.selectedGroupFile)
                // Append Object
        var Model =Object.assign(this.PricingIndivualForm.value,
        {Id:this.OfferDetails.id},
        
        {OfferDate:this.datePipe.transform(this.PricingIndivualForm.get("OfferDate")?.value, 'yyyy-MM-dd')})
        for (const key of Object.keys(Model)) {
          const value = Model[key];
          this.formData.append(key, value);
        }
        console.log(Model);
        
            // Log
        for (var pair of this.formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }

              //  Send updates

      this._PolicyService.updateOffer(this.formData).subscribe(res=>{
      this.isClicked = false
        this._Router.navigate(['/Calculations/'+this.OfferDetails.id]);
        this._SharedService.setAlertMessage('Offer Updated Successfully');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Swal.fire('Offer Updated Successfully','','success')
        this.getAllOffers()
        console.log(res);
        $("#editOffer").modal("toggle")
        this.formData = new FormData()
      },error=>{
        this.isClicked = false
        Swal.fire({icon: 'error',title:error.error,text:''})
        console.log(error);
        this.formData = new FormData()
      })
      
    }




    //get Business Types
    getBusinessTypes(){
      this._AdminService.getBusinessTypes().subscribe(data=>{
        this.BusinessTypes=data;
      })
    }
    getAllIndividualOrCorporate(){
    this._PolicyService.GetListOfIndividualAndCorporate().subscribe(data=>{
      this.IndividualOrCorporate=data;
    })
  }
  getListOfTpa(){
    this._PolicyService.getListOfTpa().subscribe(data=>{
      this.listOfTpa = data;
    })
  }
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe((data:any)=>{
      this.InsuranceClasses=data;
    })
  }
    // Show & hide Broker Details
  getSourceVal(value:any){
      console.log(value);
      if(value==1){
        $("#BrokerFiled").show(400)
        this.PricingIndivualForm.get('BrokerId')?.setValidators([Validators.required])
        this.PricingIndivualForm.get('BrokerId')?.updateValueAndValidity()
      }else{
        $("#BrokerFiled").hide(400)
        this.PricingIndivualForm.get('BrokerId')?.setValue(0)
        this.PricingIndivualForm.get('BrokerId')?.clearValidators()
        this.PricingIndivualForm.get('BrokerId')?.updateValueAndValidity()

      }
    }

  getTempleteFile(){
    this._PolicyService.getGroupTempleteFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'group templete.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
       //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe(data=>{
      this.brokerCustomers= data
    })
  }
  //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllOffers();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllOffers();
  }
  uploadPlanFile(event: any){
    this.selectedPlanFile = event.target.files[0] ?? null;
    event.target.value='' 
}
  uploadGroupFile(event: any){
  this.selectedGroupFile = event.target.files[0] ?? null;
  event.target.value=''
}
getPlansOfOffer(){
  this._PolicyService.getPlansOfPolicy(this.OfferId).subscribe((data:any)=>{
    this.AllOfferPlans = data;
    console.log(data);
    if(this.AllOfferPlans.length!=0){
      $("#proceesButton").show(400)
    }else{
      $("#proceesButton").hide(400)
    }
  },error=>
  {
    console.log(error)
  })
}
    // Show Add New Plan
  showNewPlan(){
    $("#AddPlan").toggle(500)
  }
    // Show Currernt Group
  showCurrentGroup(){
    $("#currentGroup").toggle(500)
  }
   //Remove item From Table
    //Remove item From Loss Participations List
    removee(index:number,planName:any){
      this.arrTest.splice(index, 1)
  
      var item = this.AddedNewPlans.find(item=>planName == item.PlanName)
      let i = this.AddedNewPlans.indexOf(item)
  
  
      this.AddedNewPlans.splice(i, 1)
      console.log(this.AddedNewPlans);
    }  
    remove(index:number,planId:any,name:any){
      var item = this.AddedPlans.find(item=>item.planName == name)
      if(item !=undefined){
        let index = this.AddedPlans.indexOf(item)
        this.AddedPlans.splice(index,1)
        // console.log(this.AddedPlans);
      }
      
      this.OfferPlans.splice(index, 1)
      console.log(this.OfferPlans);
          //remove
      if(planId!=undefined){
      this.removedPlans.push(planId)
      }
      console.log(this.removedPlans);
    }
  // view(){
  //   var item = this.OfferPlans.find(item=>this.PlanForm.get('PlanName')?.value == item.planName)
  //   console.log(item);
  //   if(item==undefined){
  //     let Model= {
  //     'planName':this.PlanForm.get('PlanName')?.value,
  //     'annualMaxLimit':this.PlanForm.get('AnnualMaxLimit')?.value,
  //     'netPremium':this.PlanForm.get('NetPremium')?.value,
  //     'planFile':this.selectedPlanFile,
  //     'fileName':this.selectedPlanFile.name,
  //   }
  //     this.OfferPlans.push(Model);
  //     this.AddedPlans.push(Model)
  //     console.log(this.OfferPlans);
  //     this.PlanForm.reset()
  //   }else{
  //     this._ToastrService.show('The Plan Name is Already Exist')
  //   }
    
  // }
  view(){
    var item = this.OfferPlans.find(item=>this.PlanForm.get('planName')?.value == item.planName)
    // console.log(item);
    var item2 = this.AddedPlans.find(item=>this.PlanForm.get('planName')?.value == item.planName)
    // console.log(item2);
    
    if(item==undefined&&item2==undefined){
      let Model= {
      planName:this.PlanForm.get('planName')?.value,
      // annualMaxLimit:this.PlanForm.get('AnnualMaxLimit')?.value,
      netPremium:this.PlanForm.get('netPremium')?.value,
      totalSumInsured:this.PlanForm.get('totalSumInsured')?.value,
      risksLst:this.ArrRisk

    }
    // console.log(Model);
    
      this.OfferPlans.push(Model);
      this.AddedPlans.push(Model)
       // console.log(this.OfferPlans);
    // console.log(this.AddedPlans);
      this.PlanForm.reset()
      this.ArrRisk=[]

    }else{
      this._ToastrService.show('The Plan Name is Already Exist')
    }
    
  }
  ArrRisk:any[]=[]
  viewRisk(){
    var item = this.ArrRisk.find(item=>this.RiskForm.get('riskId')?.value == item.riskId)
    if(item==undefined){
      this.ArrRisk.push(this.RiskForm.value);
      this.RiskForm.reset();
      this.CalcTotalAnnual();
    }else{
      this._ToastrService.show('The Risk is Already Exist')
    }
    // console.log(this.ArrRisk);
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
  resetModalWhenOpen(){
    this.AddedPlans =[]
    this.removedPlans = []
    this.PlanForm.reset()
    this.selectedPlanFile =''

  }
  // 
  goBack(stepper: MatStepper){
    stepper.previous();
}
AllRisk:any[]=[]
getRiskInfo(Risk:any){
  console.log(Risk);
  this.AllRisk = Risk
  $(".overlayAdd").fadeIn(300)
  $(".Addgovernmant").animate({right: '0px'});
  // this.AllRisk = Risk.risksLst
  $("#RiskTable").show(400)
  // document.getElementById('RiskTable')!.style.display = 'block';

  
}
Addrisk(item:any){
  $(".overlayAdd").fadeIn(300)
  $(".Addgovernmant").animate({right: '0px'});
}
closeShowrisk(){
  $(".overlayAdd").fadeOut(300)
  $(".Addgovernmant").animate({right: '-30%'});
}
AllRisks:any
GetAllRisks(){
  this._AdminService.GetAllRisks().subscribe((data:any)=>{
    this.AllRisks = data;
    // console.log(data);
  },error=>{
    console.log(error)
  })
}
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);

    // this._SharedService.changeData(false,'Add new offer','Offer',true,false);
    // this._SharedService.changeData(false,'Add  new partner','addCustomer',true,false);

    // this._SharedService.currentMessage.subscribe(message => {
    //   if(message){
    //     $("#filters").show(300)
    //   }else{
    //     $("#filters").hide(300)
    //   }
    // });
    this.getOfferDetailsToEdit()
    this.getAllOffers()
    this.getBusinessTypes();       
    this.getAllIndividualOrCorporate()
    this.getListOfTpa()
    this.getInsuraneClass()
    this.getBrokerCustomers()
    this.GetAllRisks()
  }
  
  // for DropDown icons
  isDropdownOpen = false;
  hoverRow: number | null = null;
toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

showDropdown() {
  this.isDropdownOpen = true;
}

hideDropdown() {
  this.isDropdownOpen = false;
}
 // New AccountType 
 USERID:any
 AddNewAccType(){  
   $(".overlayAddplan").fadeIn(300)
   $(".addnewplan").animate({right: '0px'});
 }
 closeNewAccType(){
   $(".overlayAddplan").fadeOut(300)
   $(".addnewplan").animate({right: '-30%'});
 }

}
