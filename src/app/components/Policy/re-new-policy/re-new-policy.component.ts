import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/services/admin.service';
import { SharedService } from 'src/app/services/shared.service';

declare var $:any
@Component({
  selector: 'app-re-new-policy',
  templateUrl: './re-new-policy.component.html',
  styleUrls: ['./re-new-policy.component.scss'],
  providers: [DatePipe]
})
export class ReNewPolicyComponent implements OnInit{
  BrokerValue:any =''
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
  After1Week:any = new Date()
  After3Month:any = new Date()
  After4Month:any = new Date()
  After6Month:any = new Date()
  After8Month:any = new Date()
  After9Month:any = new Date()
  After12Month:any = new Date()
  MinExpiryDate:any
  isLoading:boolean =false
  InsuranceClassvalue:any
  TpaIdValue:any
  AllBranches:any
  OfferId:any
  loading:boolean=false
  ThePolicy:any
  PolicyId:any
  FileName:any
  validExpiry:any
  periodValue: any;
  minInceptionDate:any;
  totalAnnual:any=0;
  currentInceptionDate:any
  Dateifarrayempty:any
  constructor(private _SharedService:SharedService, public datePipe: DatePipe,private _ActivatedRoute:ActivatedRoute,private _Router:Router, private _PolicyService:PolicyService, private _ToastrService:ToastrService,private _AdminService:AdminService,){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    
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
    this.AfterInceptionYear.setDate(this.today.getDate() -5);
    // this.MinExpiryDate.setDate(this.today.getDate() -4);
    this.MainForm.get('InceptionDate')?.valueChanges.subscribe(value => {
      this.Dateifarrayempty = this.datePipe.transform(value, 'yyyy-MM-dd');
      this.currentInceptionDate = this.datePipe.transform(value, 'yyyy-MM-dd');
      // console.log(this.currentInceptionDate );
      // console.log(this.Dateifarrayempty);

      // console.log('Inception Date:', this.datePipe.transform(this.currentInceptionDate,'yyyy-MM-dd'));
    });   
  }
                ///Form
  MainForm:FormGroup = new FormGroup({
    
    'InceptionDate':new FormControl('',[Validators.required]),
    'ExpiryDate':new FormControl('',[Validators.required]),
    'IssueDate':new FormControl(this.today,[Validators.required]),
    'PaymentPeriod':new FormControl('',[Validators.required]),
    'TpaFees':new FormControl('',[Validators.required]),
    'Brokerage':new FormControl('',[Validators.required]),
    'RegNo':new FormControl('',[Validators.required]),
    'TaxNo':new FormControl('',[Validators.required]),
    'BranchId':new FormControl('',[Validators.required])
    ,
    'Settlement1':new FormControl(''),
    'Settlement2':new FormControl(''),
    'Settlement3':new FormControl(''),
    'Settlement4':new FormControl(''),
  })
    ///Add Plan Form
    PlanForm:FormGroup = new FormGroup({
      'planName':new FormControl('',[Validators.required]),
      'netPremium' :new FormControl('',[Validators.required]),
    })
    RiskForm:FormGroup = new FormGroup({
      'riskId':new FormControl('',[Validators.required]),
      'annualMaxLimit' :new FormControl('',[Validators.required]),
    })
    getRiskNameById(id: string): string {
      const risk = this.AllRisks.find((risk: { id: string; }) => risk.id == id);
      // console.log(risk);
      return risk ? risk.englishName : 'Unknown Risk';
    }
    // Show Add New Plan
    showNewPlan(){
      $("#AddPlan").toggle(500)
    }

     //////////////////////////////////// SaveUpdate //////////////// //////////////////
     SaveUpdate(){
      this.isLoading =true
      let model = Object.assign(this.MainForm.value,
        {InceptionDate:this.datePipe.transform(this.MainForm.get('InceptionDate')?.value,'yyyy-MM-dd')},
        {ExpiryDate:this.datePipe.transform(this.MainForm.get('ExpiryDate')?.value,'yyyy-MM-dd')},
        {IssueDate:this.datePipe.transform(this.MainForm.get('IssueDate')?.value,'yyyy-MM-dd')},
        // {Settlement1:this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')},
        // {Settlement2:this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')},
        // {Settlement3:this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')},
        // {Settlement4:this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')},
        {PolicyId:Number(this.PolicyId)},
        {OfferId:Number(this.OfferId)}
        )
      // console.log(model);
                  // Append Model
        for (const key of Object.keys(model)) {
          const value = model[key];
          this.formData.append(key, value);
        }
        console.log(model);
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
      
          // Iterate over risksLst and append each risk
          for (let j = 0; j < this.AddedPlans[i].risksLst.length; j++) {
              this.formData.append(`PlansToAdd[${i}].risksLst[${j}].riskId`, this.AddedPlans[i].risksLst[j].riskId);
              this.formData.append(`PlansToAdd[${i}].risksLst[${j}].annualMaxLimit`, this.AddedPlans[i].risksLst[j].annualMaxLimit);
          }
      }

    //         // OfferFile
    this.formData.append('OfferFile',this.selectedPdfFile)
    this.formData.append('PlanFile',this.selectedPlanFile)
    
                    // Append group file
        this.formData.append('GroupFile',this.selectedGroupFile)

        for (var pair of this.formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }

      this._PolicyService.ReNewPolicy(this.formData).subscribe((res:any)=>{
        console.log(res);
        this.isLoading =false
        this._Router.navigate(['/PolicyCalculations/'+res.policyId])
        // Swal.fire('Policy Renewed Successfully','','success')
        this._SharedService.setAlertMessage('Policy Renewed Successfully');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.clearFormData()
      },error=>{
        this.isLoading =false
        Swal.fire({icon: 'error',title:error.error,text:''})
        console.log(error);
        this.clearFormData()
      })
}
                /// Delete Form Data
  clearFormData(){
    this.formData = new FormData()
  }
  uploadPlanFile(event: any){
      this.selectedPlanFile = event.target.files[0] ?? null;
      event.target.value='' 
  }
  uploadGroupFile(event: any){
    this.selectedGroupFile = event.target.files[0] ?? null;
    event.target.value=''
  }
    // Show Currernt Group
    showCurrentGroup(){
      $("#currentGroup").toggle(500)
    }
     //Remove item From Table
     remove(index:number,planId:any,name:any){
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
      var item = this.ArrRisk?.find(item=>this.RiskForm.get('riskId')?.value == item.riskId)
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
      // Payment Period
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

        // get Policy Details By Id
        ID:any
  getThePolicyById(){
    this.loading=true;
    this._PolicyService.getThePolicyById(this.PolicyId).subscribe((data:any)=>{
      console.log(data);
      
      this.ThePolicy =data;
      this.OfferId = data.offerId
      this.ID= data.offerId
      // console.log(this.OfferId);
      // console.log(this.ID);
      
      
      this.loading=false;
      this.OfferPlans = data.plans;
      this.OfferPlans = data.plans.map((plan: {id:any; planName: any; netPremium: any; risks: { id: any; annualMaxLimit: any; }[]; }) => ({
        id:plan.id,
        planName: plan.planName,
        netPremium: plan.netPremium,
        risksLst: plan.risks.map((risk: { id: any; annualMaxLimit: any; }) => ({
          riskId: risk.id, // Assuming englishName as riskId
          annualMaxLimit: risk.annualMaxLimit
        }))
      }));
      this.OfferGroup = data.group

      let inception = new Date(data.expiryDate);
      inception.setDate(inception.getDate() + 2);
      
      this.MainForm.get('InceptionDate')?.setValue(inception)
      this.MainForm.get('TpaFees')?.setValue(data.tpaFeesPCT)
      this.MainForm.get('Brokerage')?.setValue(data.brokerage)
      this.MainForm.get('TaxNo')?.setValue(data.taxNo)
      this.MainForm.get('RegNo')?.setValue(data.regNo)
      this.MainForm.get('BranchId')?.setValue(data.branch)
      let Expiry = new Date(this.MainForm.get('InceptionDate')?.value);
      Expiry.setFullYear(Expiry.getFullYear()+1)
      this.MainForm.get('ExpiryDate')?.setValue(Expiry)
      
      // min expiry Date 
      this.MinExpiryDate =new Date()
      this.MinExpiryDate.setDate(inception.getDate());
      // console.log(data);
      // min inception Date 
      this.minInceptionDate = new Date(this.ThePolicy.expiryDate)
      this.minInceptionDate.setDate(this.MinExpiryDate.getDate())

      this.getPlansOfOffer()

    })
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

        // console.log( this.currentInceptionDate);
        // this.currentInceptionDate = new Date(this.currentInceptionDate.getDate() + 1);
        this.currentInceptionDate.setDate(this.currentInceptionDate.getDate() + 1); 

        // console.log( this.currentInceptionDate);
        
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

  checkExpiryDate(e:any){
    let NewExpiy = new Date(e.target.value)
    if(this.MainForm.get("InceptionDate")?.value >= NewExpiy){
      this.MainForm.get('ExpiryDate')?.setErrors([Validators.required])
    }else{
      this.MainForm.get('ExpiryDate')?.setErrors(null)
    }

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
      console.log("True");
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




  AllRisks:any
  GetAllRisks(){
    this._AdminService.GetAllRisks().subscribe((data:any)=>{
      this.AllRisks = data;
      console.log(data);
    },error=>{
      console.log(error)
    })
  }
  AllOfferPlans:any[]=[]
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
  AllRisk:any[]=[]
    getRiskInfo(Risk:any){
      console.log(Risk);
      
      $(".overlay").fadeIn(300)
      $(".delet").animate({right: '0px'});
      this.AllRisk = Risk
    }
    closeShowRisk(){
      $(".overlay").fadeOut(300)
      $(".delet").animate({right: '-30%'});
    }

  ngOnInit(){
    this.GetAllRisks()
    this._SharedService.changeData(true,'','',false,false);

    this.getThePolicyById()
    this.getAllBranches()
  }
  AddNewAccType(){  
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlayAddplan").fadeOut(300)
    $(".addnewplan").animate({right: '-30%'});
  }
}
