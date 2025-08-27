import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-convert-to-policy',
  templateUrl: './convert-to-policy.component.html',
  styleUrls: ['./convert-to-policy.component.scss'],
  providers: [DatePipe]
})
export class ConvertToPolicyComponent {
  customerDetails:any
  brokerInputValidation:Boolean = false
  isClicked:Boolean = false
  BusinessTypes:any
  BusinessTypeValue:any
  IndividualOrCorporate:any
  BrokerValue:any =''
  OfferDetails:any
  selectedPlanFile:any=''
  selectedGroupFile:any=''
  selectedPdfFile:any=''
  OfferPlans:any[]=[]
  OfferGroup:any
  removedPlans:any[]=[]
  AddedPlans:any[]=[]
  loadingDetails:boolean=false;
  formData:any = new FormData()
  InsuranceClasses:any[]=[]
  today:any = new Date()
  Before5Days:any = new Date()
  aYearFromNow:any = new Date();
  AfterInceptionYear:any = new Date();
  After1Week:any = new Date();
  After3Month:any = new Date();
  After4Month:any = new Date();
  After6Month:any = new Date();
  After8Month:any = new Date();
  After9Month:any = new Date();
  After12Month:any = new Date();
  MinExpiryDate:any = new Date()
  isLoading:boolean =false
  InsuranceClassvalue:any
  TpaIdValue:any
  OfferId:any
  FileName:any
  maxInception:any =new Date()
  periodValue: any;
  listOfTpa: any;
  MaxTpaFees:any
  AllBranches:any
  date3:String=''
  AllOfferPlans:any[]=[]
  totalAnnual:any=0;
  currentInceptionDate:any
  Dateifarrayempty:any

  constructor(private _SharedService:SharedService, private _ActivatedRoute:ActivatedRoute,public datePipe: DatePipe,private _AdminService:AdminService,private _ToastrService:ToastrService, private _PolicyService:PolicyService,private _Router:Router){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    // console.log(this.OfferId);

    this.Before5Days.setDate(this.today.getDate() -5);
    this.After1Week.setDate(this.today.getDate() +7);
    this.After3Month.setDate(this.today.getDate() +90);
    this.After4Month.setDate(this.today.getDate() +120);
    this.After6Month.setDate(this.today.getDate() +180);
    this.After8Month.setDate(this.today.getDate() +240);
    this.After9Month.setDate(this.today.getDate() +270);
    this.After12Month.setDate(this.today.getDate() +365);
    this.aYearFromNow.setFullYear(this.aYearFromNow.getFullYear() + 1);
    this.AfterInceptionYear.setFullYear(this.today.getFullYear() + 1);
    this.AfterInceptionYear.setDate(this.today.getDate() -6);
    this.MinExpiryDate.setDate(this.today.getDate() -4);
    this.MainForm.get('InceptionDate')?.valueChanges.subscribe(value => {
      this.Dateifarrayempty = this.datePipe.transform(value, 'yyyy-MM-dd');
      this.currentInceptionDate = this.datePipe.transform(value, 'yyyy-MM-dd');
    });    
    
  }
              ///Form
  MainForm:FormGroup = new FormGroup({
    
    'InceptionDate':new FormControl('',[Validators.required]),
    'ExpiryDate':new FormControl('',[Validators.required]),
    'PaymentPeriod':new FormControl('',[Validators.required]),
    'brokerage':new FormControl('',[Validators.required]),
    'tpaId':new FormControl('',[Validators.required]),
    'tpaFees':new FormControl('',[Validators.required]),
    'BranchId':new FormControl('',[Validators.required]),
    'customerId':new FormControl('',[Validators.required]),
    'TaxNo':new FormControl('',[Validators.required]),
    'RegNo':new FormControl('',[Validators.required]),
    
    'Settlement1':new FormControl(''),
    'Settlement2':new FormControl(''),
    'Settlement3':new FormControl(''),
    'Settlement4':new FormControl(''),
  })
                ///Add Plan Form
    PlanForm:FormGroup = new FormGroup({
      'planName':new FormControl('',[Validators.required]),
      'netPremium' :new FormControl('',[Validators.required]),
      'totalSumInsured' :new FormControl('',[Validators.required])
    })
    RiskForm:FormGroup = new FormGroup({
      'riskId':new FormControl('',[Validators.required]),
      'annualMaxLimit' :new FormControl('',[Validators.required]),
    })
    getRiskNameById(id: string): string {
      const risk = this.AllRisks.find((risk: { id: string; }) => risk.id === id);
      // console.log(risk);
      
      return risk ? risk.englishName : 'Unknown Risk';
    }
    selectedFile:any
    uploadFile(event: any){
      // Get File Object
      this.selectedFile = event.target.files[0] ?? null;
      event.target.value='' 
    }
    getPlansOfOffer(){
      this._PolicyService.getPlansOfPolicy(this.OfferId).subscribe((data:any)=>{
        this.AllOfferPlans = data;
        // console.log(data);
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
  getBrokerVal(){
    if(this.BrokerValue== ''){
      this.brokerInputValidation= true
    }else{
      this.brokerInputValidation= false
    }
  }
  uploadGroupFile(event: any){
    this.selectedGroupFile = event.target.files[0] ?? null;
    console.log(this.selectedGroupFile);
    
    event.target.value=''
  }
  uploadPlanFile(event: any){
    this.selectedPlanFile = event.target.files[0] ?? null;
    event.target.value='' 
  }
      // Show & hide Broker Details
      getSourceVal(value:any){
        console.log(value);
        if(value==1){
          $("#BrokerFiled").show(400)
          this.brokerInputValidation= true  
          this.MainForm.get('BrokerId')?.setValidators([Validators.required])
        }else{
          $("#BrokerFiled").hide(400)
          this.MainForm.get('BrokerId')?.setValue(0)
          this.MainForm.get('BrokerId')?.clearValidators()
          this.MainForm.get('BrokerId')?.updateValueAndValidity()
  
        }
      }
        // get offer Details To Edit
  getOfferDetails(){
      this.loadingDetails=true
      this._PolicyService.getOfferById(this.OfferId).subscribe((data:any)=>{
      console.log(data);
      
      this.loadingDetails=false
      this.OfferDetails = data;
      this.OfferPlans = data.plans;
      console.log(this.OfferPlans);
      this.OfferPlans = data.plans.map((plan: {
        totalSumInsured: any;id:any; planName: any; netPremium: any; risks: { id: any; annualMaxLimit: any; }[]; }) => ({
        id:plan.id,
        planName: plan.planName,
        netPremium: plan.netPremium,
        totalSumInsured: plan.totalSumInsured,

        risksLst: plan.risks.map((risk: { id: any; annualMaxLimit: any; }) => ({
          riskId: risk.id, // Assuming englishName as riskId
          annualMaxLimit: risk.annualMaxLimit
        }))
      }));
      

      this.OfferGroup = data.customerGroups
      this.MaxTpaFees = this.OfferDetails?.tpaFees
      this.MainForm.get('BranchId')?.setValue(this.OfferDetails.branchId)

      
      this.MainForm.get('tpaFees')?.setValue(this.OfferDetails.tpaFees*100)
      this.MainForm.get('tpaId')?.setValue(this.OfferDetails.tpaId)
      this.MainForm.get('brokerage')?.setValue(this.OfferDetails.brokage*100)
      this.MainForm.get('TaxNo')?.setValue(this.OfferDetails.taxNo)
      this.MainForm.get('RegNo')?.setValue(this.OfferDetails.regNo)
      this.MainForm.get('Branch')?.setValue(this.OfferDetails.branch)
      this.MainForm.get('InceptionDate')?.setValue(this.Before5Days)
      // this.MainForm.get('InceptionDate')?.setValue(this.today)
      this.MainForm.get('ExpiryDate')?.setValue(this.AfterInceptionYear)
      this.maxInception = new Date(this.MainForm.get('ExpiryDate')?.value)
      this.maxInception.setDate(this.maxInception.getDate()-1)
    },error=>{
      this.loadingDetails=false
    })
  }

        //////////////////////////////////// SaveUpdate //////////////// //////////////////
  SaveUpdate(){
          this.isLoading =true
          let model = Object.assign(this.MainForm.value,
            {InceptionDate:this.datePipe.transform(this.MainForm.get('InceptionDate')?.value,'yyyy-MM-dd')},
            {ExpiryDate:this.datePipe.transform(this.MainForm.get('ExpiryDate')?.value,'yyyy-MM-dd')},
            {OfferId:Number(this.OfferId)},
            {tpaFees:Number(this.MainForm.get('tpaFees')?.value)/100},
            {brokerage:Number(this.MainForm.get('brokerage')?.value)/100},
            
            )
            // console.log(model);
            
                      // Append Model
            for (const key of Object.keys(model)){
              const value = model[key];
              this.formData.append(key, value);
            }
            // console.log(model);


            if(this.MainForm.get('PaymentPeriod')?.value==3){
              for(let i=0;i<this.arrDates.length;i++){
                this.formData.append('Settlements['+ i +'].settlementDate',this.arrDates[i].date)
              }
            }else{
                const settlements = [
                  this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd'),
                  this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd'),
                  this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd'),
                  this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd'),
                ].filter(date => date); // Filter out empty or null dates
                        // in case oridianly
                settlements.forEach((date, i) => {
                  this.formData.append(`Settlements[${i}].settlementDate`, date);
              });
            }


          //         /// Append removed plans
            for(let i=0;i<this.removedPlans.length;i++){
              this.formData.append('PlansToRemove['+ i +']',this.removedPlans[i])
            }
        //           ///// Append Added Plans
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

        //         // OfferFile
        this.formData.append('OfferFile',this.selectedPdfFile)
        this.formData.append('PlanFile',this.selectedPlanFile)
        this.formData.append('GroupFile',this.selectedGroupFile)
                //   //// Append group file

        for (var pair of this.formData.entries()){
          console.log(pair[0]+ ', ' + pair[1]); 
        }

          this._PolicyService.ConvertOfferToPolicy(this.formData).subscribe((res:any)=>{
            this.isLoading =false
            console.log(res);
            this._SharedService.setAlertMessage('Offer Converted To Policy Successfully');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Swal.fire('Offer Converted To Policy Successfully','','success')
            this._Router.navigate(['/groupNetPremium/'+res.policyId]);
            this.formData = new FormData()
          },error=>{
            this.isLoading =false
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
    // Show Currernt Group
  showCurrentGroup(){
    $("#currentGroup").toggle(500)
  }
   //Remove item From Table
   remove(index:number,planId:any,name:any){
    console.log(index);
    console.log(planId);
    console.log(name);
    
    var item = this.AddedPlans.find(item=>item.planName == name)
    if(item !=undefined){
      let index = this.AddedPlans.indexOf(item)
      this.AddedPlans.splice(index,1)
      // console.log(this.AddedPlans);
    }
    
    this.OfferPlans.splice(index, 1)
    // console.log(this.OfferPlans);
        //remove
    if(planId!=undefined){
    this.removedPlans.push(planId)
    }
    console.log(this.removedPlans);
  }
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
     //Remove item From Loss Participations List
    //  remove(index:number,planName:any){
    //   this.OfferPlans.splice(index, 1)
  
    //   var item = this.AddedPlans.find(item=>planName == item.PlanName)
    //   let i = this.AddedPlans.indexOf(item)
  
  
    //   this.AddedPlans.splice(i, 1)
    //   console.log(this.AddedPlans);
    // }


  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe((data:any)=>{
      this.InsuranceClasses=data;
    })
  }
  getTempleteFile(){
    this._PolicyService.GetPolicyGroupTemplateFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'groupOfPolicy.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
  uploadPdfFile(e:any){
    this.selectedPdfFile = e.target.files[0] ?? null;
    console.log(this.selectedPdfFile);
    // e.target.value='' 
  }

    /////////////////////////////////////////

  getPaymentPeriod(value:any){
    
    this.MainForm.get("Settlement1")?.setValue(this.MainForm.get('InceptionDate')?.value)
    this.periodValue=value
    if(value ==0){                // 1 
      this.totalPercentage = 100;
      $(".payment1").show(400);
      $(".OtherSettlement").hide(400);
      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement2")?.setValue('')
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
      this.arrDates=[]
    }else if(value ==1){          // 2
      this.totalPercentage = 100;
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".OtherSettlement").hide(400);
      this.arrDates=[]
      // 6
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 , 6);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(value ==2){          // 3
      this.totalPercentage = 100;
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);
      $(".OtherSettlement").hide(400);
      this.arrDates=[]
      // 3
      const Month3 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 3 , 3);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month3,'YYYY-MM-dd'))

      // 6
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 , 6);
      this.MainForm.get("Settlement3")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))

      // 9
      const Month9 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 9 , 9);
      this.MainForm.get("Settlement4")?.setValue(this.datePipe.transform(Month9,'YYYY-MM-dd'))

      // Other
    }else if(value ==3){  
      this.totalPercentage = 100;        
      $(".payment1").hide(400);
      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      $(".OtherSettlement").show(400);
      this.MainForm.get("Settlement1")?.setValue('')
      this.MainForm.get("Settlement2")?.setValue('')
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
      this.otherDate = this.currentInceptionDate
      
    }
  }

  checkExpiryDate(){
    this.maxInception = ''
    this.maxInception = new Date(this.MainForm.get('ExpiryDate')?.value)
    this.maxInception.setDate(this.maxInception.getDate()-1)
  }

  getInception(e:any){
    let NewExpiy = new Date(e.target.value)
    NewExpiy.setFullYear(NewExpiy.getFullYear() + 1)
    NewExpiy.setDate(NewExpiy.getDate()-1)
    this.MainForm.get('ExpiryDate')?.setValue(NewExpiy)

    this.MainForm.get("Settlement1")?.setValue(this.MainForm.get('InceptionDate')?.value)
    this.periodValue
    if(this.periodValue ==0){                // 1 
      $(".payment1").show(400);

      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement2")?.setValue('')
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(this.periodValue ==1){          // 2
      $(".payment1").show(400);
      $(".payment2").show(400);
      // 6
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 , 6);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(this.periodValue ==2){          // 3
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);
      // 3 Mon
      const Month3 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 3 , 3);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month3,'YYYY-MM-dd'))
      
      // 6 Mon
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 ,6);
      this.MainForm.get("Settlement3")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))
      
      // 9 mon
      const Month9 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 9 ,9);
      this.MainForm.get("Settlement4")?.setValue(this.datePipe.transform(Month9,'YYYY-MM-dd'))


    }
        // Check if incption > expiry
    if(this.MainForm.get('InceptionDate')?.value>this.MainForm.get('ExpiryDate')?.value){
      this._ToastrService.show('','Inception Date Must be Before Inception')
      this.MainForm.get('InceptionDate')?.setErrors([Validators.required])
    }
  }

  getListOfTpa(){
    this._PolicyService.getListOfTpa().subscribe(data=>{
      this.listOfTpa = data;
      // console.log(data);
    })
  }
  getTpaCustomer(id:any){
    this.MainForm.get('tpaFees')?.setValue('')
    this._AdminService.getFeesOfTpa(id).subscribe((data:any)=>{
      this.MainForm.get('tpaFees')?.setValue(data?.fees*100)
      this.MaxTpaFees = data.fees
  })
    
  }
  getAllBranches(){
    this._PolicyService.getAllBranches().subscribe(data=>{
      // console.log(data);
      this.AllBranches = data
      
    })
  }
  

  addMonths(date : Date, months : number, count:number) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    const diffDate = this.getMonthDifference(newDate , date);
    if(diffDate > count)
    {
      // console.log("True");
      newDate.setMonth(newDate.getMonth() -1);
      newDate.setDate(this.getLastDayOfMonth(newDate));
    }
    return newDate;
  }
  getMonthDifference(startDate : Date, endDate : Date) {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
  
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
  
    return Math.abs((endYear - startYear) * 12 + (endMonth - startMonth));
  }
  
  getLastDayOfMonth(date : Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
  
  // Get Corporate  & Indivudual
  getAllIndividualOrCorporate(){
    this._PolicyService.GetListOfIndividualAndCorporate().subscribe(data=>{
      this.IndividualOrCorporate=data;
    })
  }
  getCustomerId(){
    this._AdminService.getCustomerById(this.MainForm.get('customerId')?.value).subscribe((data:any)=>{
      console.log(data);
      this.customerDetails = data
      this.MainForm.get('TaxNo')?.setValue(data.taxNo)
      this.MainForm.get('RegNo')?.setValue(data.regNo)
    })
  }


  arrDates:any[]=[]
  otherDate:any=''
  percentage: any;
  // viewDates(){
  //   if(this.arrDates.length<12){
  //     this.datePipe.transform(this.otherDate,'yyyy-MM-dd')
  //     this.arrDates.push(this.datePipe.transform(this.otherDate,'yyyy-MM-dd'));
  //     console.log(this.arrDates);
  //     this.otherDate = ''
  //   }else{
  //       this._ToastrService.show("Settlements can not be more than '12' ")
  //   }
    
  // }
  viewDates() {
    if (this.arrDates.length < 12) {
      const formattedDate = this.datePipe.transform(this.otherDate, 'yyyy-MM-dd');
      if (formattedDate && this.percentage !== null) {
        // const Total = this.totalPercentage + this.percentage;
        // console.log(Total);
        this.arrDates.push({ date: formattedDate});
        this.updateCurrentInceptionDate();
          this.otherDate = '';

        // if (Total <= 100) {
        //   this.arrDates.push({ date: formattedDate, percentage: this.percentage });
        //   this.calculateTotalPercentage();
        //   this.otherDate = '';
        //   this.percentage = null; // Reset the percentage to null
        //   this.updateCurrentInceptionDate();

        // } else {
        //   this._ToastrService.show('Total percentage cannot be more than 100%');
        // }
      }
      this.checkPercentageLimit()
    } else {
      this._ToastrService.show("Settlements cannot be more than '12'");
    }
  }

   //Remove item From Dates Arr
   removeDate(index:number){
    this.arrDates.splice(index, 1)
    this.calculateTotalPercentage();
    this.updateCurrentInceptionDate();
  }
    // Method to calculate the total percentage
    totalPercentage:number=0
    calculateTotalPercentage() {
      this.totalPercentage = this.arrDates.reduce((acc, item) => acc + item.percentage, 0);
    }
    updateCurrentInceptionDate() {
      if (this.arrDates.length > 0) {
        const highestDate = this.arrDates.reduce((prev, current) => (prev.date > current.date ? prev : current)).date;
        // this.currentInceptionDate = highestDate;
        this.currentInceptionDate = new Date(highestDate);

        console.log( this.currentInceptionDate);
        // this.currentInceptionDate = new Date(this.currentInceptionDate.getDate() + 1);
        this.currentInceptionDate.setDate(this.currentInceptionDate.getDate() + 1); 

        console.log( this.currentInceptionDate);
        
      } else {
        this.currentInceptionDate = this.Dateifarrayempty ;
      }
    }
  
    checkPercentageLimit() {
      if (this.totalPercentage > 100) {
        this._ToastrService.show('Total percentage exceeds 100%');
      } 
      // else {
      //   this.warningMessage = '';
      // }
    }
  checkTax(){
    if(this.MainForm.get("taxNo")?.value==null){
    }else{
      if(String(this.MainForm.get("taxNo")?.value).length<9){
        this.MainForm.get("taxNo")?.setErrors({incorrect:true})
      }else if(String(this.MainForm.get("taxNo")?.value).length==9){
        this.MainForm.get("taxNo")?.setErrors(null)
      }else if(String(this.MainForm.get("taxNo")?.value).length>9){
        this._ToastrService.show("Tax number can not be more than 9")
        this.MainForm.get("taxNo")?.setErrors({incorrect:true})
      }
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this._SharedService.changeData(true,'','',false,false);
    this.getAllIndividualOrCorporate();       
    this.getBusinessTypes();       
    this.getInsuraneClass()
    this.getOfferDetails()
    this.getListOfTpa()
    this.getAllBranches()
    this.getPlansOfOffer()
    this.GetAllRisks()
    this.checkPercentageLimit()
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

    // ShowRisk(){  
    //   $(".overlay").fadeIn(300)
    //   $(".delet").animate({right: '0px'});
    // }
    AllRisk:any[]=[]
    getRiskInfo(Risk:any){
      $(".overlay").fadeIn(300)
      $(".delet").animate({right: '0px'});
      this.AllRisk = Risk
    }
    closeShowRisk(){
      $(".overlay").fadeOut(300)
      $(".delet").animate({right: '-30%'});
    }
}
