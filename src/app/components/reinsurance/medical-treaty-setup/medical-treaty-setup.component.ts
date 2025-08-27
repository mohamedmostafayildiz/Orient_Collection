import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';
declare var $:any;
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-medical-treaty-setup',
  templateUrl: './medical-treaty-setup.component.html',
  styleUrls: ['./medical-treaty-setup.component.scss'],
  providers:[DatePipe]
})
export class MedicalTreatySetupComponent {
  AllContries:any;
  AllFees:any=0;
  contryValue:any= '65';
  BusinessTypes:any
  AllReInsurCompanies:any[]=[]
  AllReInsurBrokers:any[]=[]
  InsuranceClasses:any[]=[]
  arrTest:any[]=[];
  childArr:any[]=[];
  childQS:any='';
  periodValue: any;
  childSurplusArr:any[]=[];
  subTreatiesArr:any[]=[];
  isClicked:boolean= false
  totalPercentage:number=0
  currentInceptionDate:any
  Dateifarrayempty:any
  arrDates:any[]=[]
  otherDate:any=''
  currentDate: any= new Date()
  BussnessTypes:any[]=[]
  LineOfBuss:any[]=[]
  PanalesType:any[]=[
    {id:1,name:'Leader'},
    {id:2,name:'Follower'}
  ]
  REinsuranceNames:any[]=[]
  constructor(private _ToastrService:ToastrService,private _DatePipe:DatePipe, private _ReInsuranceService:ReInsuranceService){
    this.SubTreatyXLForm.get('InceptionDate')?.valueChanges.subscribe(value => {
      this.Dateifarrayempty = this._DatePipe.transform(value, 'yyyy-MM-dd');
      this.currentInceptionDate = this._DatePipe.transform(value, 'yyyy-MM-dd');
    });   
  }
  MainForm:FormGroup = new FormGroup({
    'name':new FormControl(null,[Validators.required]),
    'type':new FormControl(null,[Validators.required]),
    'productId':new FormControl(null,[Validators.required]),
    'lineOfBusinessId':new FormControl(null,[Validators.required]),
    'from':new FormControl(null,[Validators.required]),
    'to':new FormControl(null,[Validators.required]),
    'underWritingYear':new FormControl(null,[Validators.required]),
  })
  proportionalForm:FormGroup = new FormGroup({
    'principle':new FormControl(null,[Validators.required]),
    'noticeOfCancellation':new FormControl(null),
    'lossAdviceLimit':new FormControl(null,[Validators.required]),
    'cashCall':new FormControl(null),
    'premPortfolioWithdrawal':new FormControl(null),
    'lossPortfolioWithdrawal':new FormControl(null),
    'accounting':new FormControl(null,[Validators.required]),
    'premiumReserve':new FormControl(null,[Validators.required]),
    'soaCurrency':new FormControl(null,[Validators.required]),
    'interest':new FormControl(null,[Validators.required,Validators.min(0),Validators.max(100),]),
    'profitCommission':new FormControl(null),
    'managmentExpenses':new FormControl(null,[Validators.min(0),Validators.max(100),]),
    'lossCarriedForward':new FormControl(null,[Validators.required]),
    'firstCalculation':new FormControl(null,[Validators.required]),
    'finalCalculation':new FormControl(null,[Validators.required]),
    'lossReserve':new FormControl(null,[Validators.required]),
    'premiumReservePct':new FormControl(null,[Validators.required,Validators.min(0),Validators.max(100)]),
    'lossReservePct':new FormControl(null,[ Validators.min(0),Validators.max(100),Validators.required]),
    // new Added
    'netGrossOption':new FormControl(null,[Validators.required]),
    'qoutaShareLimit':new FormControl(null,[Validators.required]),
    'treatyLimit':new FormControl(0,[Validators.required]),
    'qoutaShareCommission':new FormControl(null,[Validators.required,Validators.min(0),Validators.max(100),]),
    'surplusCommission':new FormControl(null,[Validators.required,Validators.min(0),Validators.max(100),]),
    'tax':new FormControl('',[Validators.required,Validators.min(0),Validators.max(100),]),
  },{ validators: this.LossAdviceLimitGreaterThanPriorityValidator() })
  NonproportionalForm:FormGroup=new FormGroup({
    'principle':new FormControl('',[Validators.required]),
    'noticeOfCancellation':new FormControl(''),
    'enpi':new FormControl('',[Validators.required,Validators.min(0),]),
    'mdPct': new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]),
    'priority':new FormControl('',[Validators.required,Validators.min(0),]),
    'nonPropotionalInstallments':new FormControl('',[Validators.required]),
    'settlement1':new FormControl(''),
    'settlement2':new FormControl(''),
    'settlement3':new FormControl(''),
    'settlement4':new FormControl(''),
  }, { validators: this.enpiGreaterThanPriorityValidator() })
  XlForm:FormGroup=new FormGroup({
    'brokerId':new FormControl(null),
  })
  SubTreatyForm:FormGroup = new FormGroup({
    'layersType':new FormControl('',[Validators.required]),
    'retantion':new FormControl('',[Validators.required,Validators.min(0),Validators.max(100)]),
    // 'retentionalLimit':new FormControl('',[Validators.required]),
    'noOfLines':new FormControl('',[Validators.required]),
    'treatyLimit':new FormControl('',[Validators.required]),
    'surplusLimit':new FormControl(''),
  })
  SubTreatyXLForm:FormGroup = new FormGroup({
    'layerRiskType':new FormControl('',[Validators.required]),
    'limit':new FormControl('',[Validators.required,Validators.min(0)]),
    'excess':new FormControl('',[Validators.required,Validators.min(0)]),
    'aggregate':new FormControl('',[Validators.required,Validators.min(0)]),
    'adjustableRate':new FormControl('',[Validators.required,Validators.min(0)]),
    'reinstatementNumber':new FormControl('',[Validators.min(0)]),
    'flatReInstatment':new FormControl('',[Validators.min(0)]),
    'minimumAndDeposit':new FormControl('',[Validators.required,Validators.min(0)]),
   
  })
  CompanyShareForm:FormGroup=new FormGroup({
    'panel':new FormControl('',[Validators.required]),
    'companyId':new FormControl('',[Validators.required]),
    'brokerId':new FormControl(''),
    'reinsurancLimite':new FormControl(''),
    'brokerPct':new FormControl(''),
    'companyPct':new FormControl('',[Validators.required,Validators.max(100),Validators.min(0)]),
  })
  CompanySharenonForm:FormGroup=new FormGroup({
    'panel':new FormControl('',[Validators.required]),
    'fess':new FormControl('',[Validators.max(100),Validators.min(0)]),
    'reInsuranceId':new FormControl('',[Validators.required]),
    'reInsuranceBrokerId':new FormControl(''),
    'brokerCommission':new FormControl('',[Validators.min(0),Validators.max(100)]),
    'reInsurancePct':new FormControl('',[Validators.required,Validators.min(0),Validators.max(100)]),
  }, { validators: this.enpiGreaterThanPriorityValidator() })
// validate that number > number
  enpiGreaterThanPriorityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const enpi = control.get('enpi')?.value;
      const priority = control.get('priority')?.value;
      const lossAdviceLimit = control.get('lossAdviceLimit')?.value;
      const cashCall = control.get('cashCall')?.value;

      if (enpi != null && priority != null && enpi <= priority) {
        return { enpiNotGreater: true };
      }
      if (lossAdviceLimit != null && cashCall != null && lossAdviceLimit > cashCall) {
        return { cashCall: true };
      }

      return null;
    };
  }
  LossAdviceLimitGreaterThanPriorityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {    
      const lossAdviceLimit = control.get('lossAdviceLimit')?.value;
      const cashCall = control.get('cashCall')?.value;
      if (lossAdviceLimit != null && cashCall != null && lossAdviceLimit < cashCall) {
        return { cashCall: true };
      }

      return null;
    };
  }
  //Remove 
  remove(index:number,comVal:any){
    this.AllFees=this.AllFees-=comVal;
    this.arrTest.splice(index, 1)
  }
  //////////// Submit ReInsurance Treaty setup /////////////
  
  new(){
    this.MainForm.reset();
    this.arrTest=[];
    $("#Save").show(300)
    $("#New").hide(300)
    $("#TreatySetup").hide(300)
    window.location.reload()
    this.MainForm.get('underWritingYear')?.disable()
  }
  getFrom(){
    // let date = new Date(this.Form.get('from')?.value);
    // let year = date.getFullYear();
    // this.Form.get('underWritingYear')?.setValue(year)
    const startDate = new Date(this.MainForm.get('from')?.value);
    console.log(startDate);
    
        const endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        endDate.setDate(endDate.getDate() - 1);
        this.MainForm.get('to')?.setValue(endDate);
  }
  getSelectedTreatyType(value:any){
    this.childSurplusArr= []
    if(value == '1'){
      $("#Proportional").show(300)
      $("#xl").hide(300)
    }else{
      $("#xl").show(300)
      $("#Proportional").hide(300)
    }
    
  }
  getSelectedBussType(value:any){
    console.log(value);
    
    let Exist = this.BussnessTypes.find(item=>item.id == value)
    this.LineOfBuss = Exist.lineOfBusiness
  }
  SelectedPrinciple:any
  SelectedLayer:any
  getSelectedPrincipleType(value:any){
    this.SelectedPrinciple = value
  }
  getSelectedLayerType(value:any){
    this.SelectedLayer = value
    if(this.SubTreatyForm.get('layersType')?.value=='1'){
      this.SubTreatyForm.get("noOfLines")?.disable()
      this.SubTreatyForm.get("noOfLines")?.setValue(1)

      this.SubTreatyForm.get("retantion")?.enable()
      this.SubTreatyForm.get("retantion")?.setValue('')
      $('#SurplusLimit').hide(500)
    }else{
      this.SubTreatyForm.get("retantion")?.disable()
      // this.SubTreatyForm.get("retantion")?.setValue(0)

      this.SubTreatyForm.get("noOfLines")?.enable()
      this.SubTreatyForm.get("noOfLines")?.setValue('')
      $('#SurplusLimit').show(500)
    }
  }
  
  // Selected Broker
  getSelectedBroker(brokerShare:any){
    if(this.CompanyShareForm.get('reInsuranceBrokerId')?.value!=''){
      this.CompanyShareForm.get('brokerCommission')?.setValidators([Validators.required,Validators.max(100),Validators.min(0)])
      this.CompanyShareForm.get('brokerCommission')?.updateValueAndValidity()
      brokerShare.disabled=false;
      
    }else{
      this.CompanyShareForm.get('brokerCommission')?.setValidators(null)
      this.CompanyShareForm.get('brokerCommission')?.updateValueAndValidity()
      this.CompanyShareForm.get('brokerCommission')?.setValue(null)
      brokerShare.disabled=true
    }
  }
  // View(){
  //   var item = this.arrTest.find(item=>this.CompanyShareForm.get('companyId')?.value == item.companyId)
  //   if(item==undefined){
  //     if((this.AllFees+this.SubTreatyForm.get('retantion')?.value)+this.CompanyShareForm.get("companyPct")?.value>100){
  //       this._ToastrService.show('Retantion and Total Company share can not exceed 100')
  //     }else{
  //       let company = this.AllReInsurCompanies.find(item=>item.id==this.CompanyShareForm.get("companyId")?.value);
  //         let broker = this.AllReInsurBrokers.find(item=>item.id==this.CompanyShareForm.get("brokerId")?.value);
  //         let Model=Object.assign(this.CompanyShareForm.value,{company:company.name,broker:broker?.name==undefined?'':broker?.name})
  //         this.arrTest.push(Model);
  //         this.AllFees=this.AllFees+=Number(this.CompanyShareForm.get('companyPct')?.value);
  //         this.CompanyShareForm.reset()
  //     }
      
  //   }else{
  //     this._ToastrService.show('The Company is Already Exist')
  //   }
  //   this.CompanyShareForm.get('brokerPct')?.setErrors(null)
  // }
AllPanels:any[]=[]
isFollower:boolean=true
retaionmmain:any
  View(){
    this.retaionmmain = 100
    // this.retaionmmain = 100-this.SubTreatyForm.get('retantion')?.value
    console.log(this.retaionmmain);
    var item = this.AllPanels.find(item=>item.companyId==this.CompanyShareForm.get('companyId')?.value)
    if(item==undefined){
      if(this.CompanyShareForm.get('companyPct')?.value>this.retaionmmain){
      this._ToastrService.show(`The Percentage must be less than ${this.retaionmmain}%`);
      }else{
         let rawModel = this.CompanyShareForm.value;
        let Model = Object.fromEntries(
          Object.entries(rawModel).map(([key, value]) => [key, value === '' ? null : value])
        );
        //  let Model=Object.assign(this.CompanyShareForm.value)
      console.log(Model);
      this.AllPanels.push(Model)
      }
    }else{
      this._ToastrService.show('The Company is Already Exist')
    }
   
    const companyNameValue = this.CompanyShareForm.get('reinsurancLimite')?.value;
    this.CompanyShareForm.reset(); 
    this.CompanyShareForm.get('reinsurancLimite')?.setValue(companyNameValue);
    console.log(this.CompanyShareForm.value);

    this.isFollower=false
    this.updateLeaderState()
  }
  LeaderTotal:number=0
  FowlloerTotal:number=0
  ViewNonpropo(){
    console.log(this.CompanySharenonForm.status);
    this.retaionmmain = 100
    console.log(this.retaionmmain);
    var item = this.AllPanels.find(item=>item.reInsuranceId==this.CompanySharenonForm.get('reInsuranceId')?.value)
    if(item==undefined){
      if(this.CompanySharenonForm.get('reInsurancePct')?.value>this.retaionmmain){
      this._ToastrService.show(`The Percentage must be less than ${this.retaionmmain}%`);
      }else{
        let rawModel = this.CompanySharenonForm.value;
        let Model = Object.fromEntries(
          Object.entries(rawModel).map(([key, value]) => [key, value === '' ? null : value])
        );
      console.log(Model);
      this.AllPanels.push(Model)
      }
      // set totoal
      if(this.CompanySharenonForm.get('panel')?.value==1){
         this.Result1=(this.CompanySharenonForm.get('fess')?.value/100)*this.totoalofmimanddeposit
          console.log("this.Result1",this.Result1);
          this.Result2=this.Result1+this.totoalofmimanddeposit
          console.log("this.Result2",this.Result2);
          this.LeaderTotal = this.Result2 * (this.CompanySharenonForm.get('reInsurancePct')?.value/100);
          console.log("this.LeaderTotal",this.LeaderTotal);
          console.log("this.Result2",this.Result2);
      }
      else if(this.CompanySharenonForm.get('panel')?.value==1 && this.CompanySharenonForm.get('reInsurancePct')?.value==100){
        this.Result2=this.totoalofmimanddeposit
      }else{
       
      // }
      // if(this.CompanySharenonForm.get('panel')?.value==1){
      //     this.LeaderTotal = this.Result2 * (this.CompanySharenonForm.get('reInsurancePct')?.value/100);
      //           console.log("this.LeaderTotal",this.LeaderTotal);
      //           console.log("this.Result2",this.Result2);
      // }else{
          this.FowlloerTotal = this.totoalofmimanddeposit * (this.CompanySharenonForm.get('reInsurancePct')?.value/100);
        }
      
    }else{
      this._ToastrService.show('The Company is Already Exist')
    }
   
    const companyNameValue = this.CompanySharenonForm.get('reinsurancLimite')?.value;
    this.CompanySharenonForm.reset(); 
    // this.CompanySharenonForm.markAsPristine();
    // this.CompanySharenonForm.markAsUntouched();
    // this.CompanySharenonForm.updateValueAndValidity({ emitEvent: false });
  
    this.CompanySharenonForm.get('reinsurancLimite')?.setValue(companyNameValue);
    this.isFollower=false
    this.updateLeaderState()
  }
  checkIfLeaderWithFullShareExists(): boolean {
  return this.AllPanels.some(item => item.panel === 1 && item.reInsurancePct === 100);
}
  checkIfLeaderWithFullShareExists2(): boolean {
  return this.AllPanels.some(item => item.panel === 1 && item.companyPct === 100);
}
  checkIfLeader(): boolean {
  return this.AllPanels.some(item => item.panel === 1 );
}

  getPanelName(panalid:string){
    let object = this.PanalesType.find(item=>item.id==panalid)    
    return object?.name
  }
  leaderAlreadyExists: boolean = false;
  updateLeaderState(): void {
  this.leaderAlreadyExists = this.AllPanels.some(item => item.panel === 1);
  console.log(this.leaderAlreadyExists);
}
checkIfLeaderExist(): boolean {
  console.log("this.AllPanels.some(item => item.panel === 1)")
  return this.AllPanels.some(item => item.panel === 1);
}
  AddNew(){
    // this.CompanyShareForm.reset()
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    this.CompanyShareForm.get('reinsurancLimite')?.disable()
    this.calculatereinsuranceLimite();
  }
  closeAddNew(){
    const companyNameValue = this.CompanyShareForm.get('reinsurancLimite')?.value;
    this.CompanyShareForm.reset(); 
    this.CompanyShareForm.get('reinsurancLimite')?.setValue(companyNameValue);
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
    this.CompanyShareForm.get('reinsurancLimite')?.enable()

  }
  AddNewnon(){
    // this.CompanyShareForm.reset()
    $(".overlayEditNon").fadeIn(300)
    $(".EditgovernmantNon").animate({right: '0px'});
  }
  closeAddNewnon(){
    this.CompanyShareForm.reset()
    $(".overlayEditNon").fadeOut(300)
    $(".EditgovernmantNon").animate({right: '-30%'});
  }
  viewSubtrireas(){
    $(".overlay").fadeIn(300)
    $(".delet").animate({right: '0px'});
  }
  closeSubtrireas(){
    $(".overlay").fadeOut(300)
    $(".delet").animate({right: '-30%'});
  }
  GetAllProducts(){
    this._ReInsuranceService.GetAllProductsWithLineOfBussiness().subscribe((data:any)=>{
      console.log("data",data);
      this.BussnessTypes = data;
    })
  }
  GetAllReInsurCompanies(){
    this._ReInsuranceService.GetAllReInsuranceCompanies().subscribe((data:any)=>{
      this.AllReInsurCompanies = data;
      console.log(data);
    })
  }
  GetAllReInsurBrokers(){
    this._ReInsuranceService.GetAllReInsuranceBrokers().subscribe((data:any)=>{
      this.AllReInsurBrokers = data;
    })
  }
  AllLayerRiskType:any[]=[
    {id:1,name:'Risk'},
    {id:2,name:'Risk & Cat'},
    {id:3,name:'Cat'},
  ]
  getAllLayerRiskType(){
    this._ReInsuranceService.getAllLayerRiskType().subscribe((data:any)=>{
      this.AllLayerRiskType = data;
    })
  }
  totoalofmimanddeposit:number=0

  Addchild(){
    console.log(this.CompanyShareForm.value);
    console.log(this.SubTreatyForm.value);
    const reinsurancevalue = this.CompanyShareForm.get('reinsurancLimite')?.value || 0
    const treatliimt = this.SubTreatyForm.get('treatyLimit')?.value || 0
    const surplislimit = this.SubTreatyForm.get('surplusLimit')?.value || 0
     console.log(reinsurancevalue);
     console.log(treatliimt);
     console.log(surplislimit);
    this.SubTreatyXLForm.get('excess')?.enable();
    console.log(this.SubTreatyForm.status);
    console.log(this.SubTreatyForm.value);
    if(this.MainForm.get('type')?.value==1){
      let Model = Object.assign(this.SubTreatyForm.value)
      if(this.SubTreatyForm.get('layersType')?.value=='1'){
        this.childQS = Object.assign(Model,{noOfLines:1})
      }else{
        let M = Object.assign(Model,{retantion:0})
        this.childSurplusArr.push(M)
      }
       const tereatylimitfull =reinsurancevalue + treatliimt + surplislimit
       this.proportionalForm.get('treatyLimit')?.setValue(tereatylimitfull)
      // this.SubTreatyForm.reset()
      this.SubTreatyForm.get('Profit Commission')?.setValue('')
      this.SubTreatyForm.get('noOfLines')?.setValue('')
      this.SubTreatyForm.get('tax')?.setValue('')
      // this.arrTest =[]
      this.AllFees=0
    }else{
      let M
      // if(this.arrDates.length>0){
        // M = Object.assign(this.SubTreatyXLForm.value,{other:this.arrDates});
        console.log(this.SubTreatyXLForm.value);
         let rawModel = this.SubTreatyXLForm.value;
        let model = Object.fromEntries(
          Object.entries(rawModel).map(([key, value]) => [key, value === '' ? null : value])
        );
        M = Object.assign(model);
       const limit = this.SubTreatyXLForm.get('limit')?.value || 0;
       const excess = this.SubTreatyXLForm.get('excess')?.value || 0;
       const minimumAndDeposit = this.SubTreatyXLForm.get('minimumAndDeposit')?.value || 0;
       const newExcess = limit + excess;
       this.SubTreatyXLForm.get('excess')?.setValue(newExcess);
       this.totoalofmimanddeposit=this.totoalofmimanddeposit+minimumAndDeposit
       console.log("this.totoalofmimanddeposit",this.totoalofmimanddeposit)
      // }else[
      //   M = Object.assign(this.SubTreatyXLForm.value,{other:''})
      // ]
      this.childSurplusArr.push(M)
      const companyNameValue = this.SubTreatyXLForm.get('excess')?.value;
      this.SubTreatyXLForm.reset(); 
      this.SubTreatyXLForm.get('excess')?.setValue(companyNameValue);
      this.SubTreatyXLForm.get('excess')?.disable();
      

      console.log(this.childSurplusArr);
    }
    
  }
  useRecommendedShare(){
    this.AllFees = 0;
    if(this.childQS!=''){
      this.arrTest =this.childQS.share
      console.log(this.arrTest);
      
      for(let i=0;i<this.arrTest.length;i++){
        this.AllFees = this.AllFees+= this.arrTest[i]?.reInsurancePct
      }
    }else if(this.childSurplusArr.length!=0){
      this.arrTest = this.childSurplusArr[0].share
      console.log(this.arrTest);
      for(let i=0;i<this.arrTest.length;i++){
        this.AllFees = this.AllFees+= this.arrTest[i]?.reInsurancePct
      }
    }
    
  }
  removeQS(){
    this.childQS = ''
  }
  removeSurplus(index:any){
    const deletedItem = this.childSurplusArr[index];
    const currentExcess = this.SubTreatyXLForm.get('excess')?.value || 0;
    const deletedLimit = deletedItem.limit || 0;
    const updatedExcess = currentExcess - deletedLimit;
    this.SubTreatyXLForm.get('excess')?.setValue(updatedExcess >= 0 ? updatedExcess : 0);
    this.childSurplusArr.splice(index, 1);
    this.NonproportionalForm.get('priority')?.enable();

    const deletedminanddeposit = deletedItem.minimumAndDeposit||0;
    this.totoalofmimanddeposit=this.totoalofmimanddeposit-deletedminanddeposit
    console.log("this.totoalofmimanddeposit",this.totoalofmimanddeposit)

  }
  removeleaderorfollower(index:any){
    this.AllPanels.splice(index, 1);
    this.Result1=0
    this.Result2=0
    this.LeaderTotal=0
    if(this.AllPanels.length==0){
      this.leaderAlreadyExists=false
    }
  }
  onPriorityFocus() {
  if (this.childSurplusArr.length > 0) {
    this._ToastrService.warning('You cannot make changes while entries exist in layer table.', 'Warning');
    this.NonproportionalForm.get('priority')?.disable();
  } else {
    this.NonproportionalForm.get('priority')?.enable(); // allow editing
  }
}
  getCompanyName(id:any){
    let item =  this.AllReInsurCompanies.find(item=>item.id == id)
    return item?.name
  }
  getCompanyNameNon(id:any){
    let item =  this.AllReInsurCompanies.find(item=>item.id == id)
    return item?.name
  }
  getBrokerName(id:any){
    let item =  this.AllReInsurBrokers.find(item=>item.id == id)
    return item?.name || '--'
  }
  treatySetupName: string = '';
  SubmitReInsurTreatySetup(){
    this.MainForm.get('underWritingYear')?.enable()
    this.proportionalForm.get('treatyLimit')?.enable();
    this.isClicked=true
    let rawModel = this.proportionalForm.value;
    let model = Object.fromEntries(
      Object.entries(rawModel).map(([key, value]) => [key, value === '' ? null : value])
    );
    const updatedProportional = {
      ...model,
      share: this.AllPanels
    };
    let Model
    if(this.MainForm.get('type')?.value=='1'){
      if(this.childQS != ''){
        Model =Object.assign(this.MainForm.value,{proportional:updatedProportional},{
          subTreaties:this.childSurplusArr.concat(this.childQS)
        })
      }else{
        Model =Object.assign(this.MainForm.value,{proportional:updatedProportional},{
          subTreaties:this.childSurplusArr
        })
      }
     
    }
    console.log("proposional Modal",Model);

    this._ReInsuranceService.AddTreaty(Model).subscribe((res:any)=>{
      console.log(res);
      this.treatySetupName=res.name
      console.log("this.treatySetupName",this.treatySetupName);
      
      this.isClicked = false;
      Swal.fire('Good job!','Treaty Added Successfully','success');
      $("#Save").hide(300)
      $("#New").show(300)
      // $("#TreatySetup").show(300)
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  SubmitNonProfossionalReInsurTreatySetup(){
    this.MainForm.get('underWritingYear')?.enable()
    this.isClicked=true
    for (let i = 1; i <= 4; i++) {
    const date = this.NonproportionalForm.get(`settlement${i}`)?.value;
    if (date) {
      this.arrDates.push({
        dueDate: date
      });
    }
  }
   let rawModel = this.NonproportionalForm.value;
        let model = Object.fromEntries(
          Object.entries(rawModel).map(([key, value]) => [key, value === '' ? null : value])
        );
   let Model = Object.assign(this.MainForm.value, {
    nonPropotionalDto: Object.assign(model, {
      layers: this.childSurplusArr,
      placements: this.AllPanels,
      settlements: this.arrDates
    })
  });
      
    console.log(Model);

    this._ReInsuranceService.AddNonProTreaty(Model).subscribe((res:any)=>{
      console.log(res);
      this.treatySetupName=res.name
      console.log("this.treatySetupName",this.treatySetupName);
      this.MainForm.reset()
      this.NonproportionalForm.reset()
      this.SubTreatyXLForm.reset()
      this.childSurplusArr = []
      this.AllPanels = []
      this.arrDates = []
      this.isClicked = false;
      Swal.fire('Good job!','Treaty Added Successfully','success');
      $("#Save").hide(300)
      $("#New").show(300)
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  // Custom Validator to ensure at least one field is filled
  atLeastOneFieldValidator(form: AbstractControl): ValidationErrors | null {
    const aggregateLimit = form.get('aggregateLimit')?.value;
    const noOfReinstatements = form.get('noOfReinstatements')?.value;

    if (!aggregateLimit && !noOfReinstatements) {
      return { atLeastOneRequired: true };
    }
    return null; // No error if one field is filled
  }

  // Getter for easy access in template
  get aggregateLimit() {
    return this.SubTreatyXLForm.get('aggregateLimit');
  }

  get noOfReinstatements() {
    return this.SubTreatyXLForm.get('noOfReinstatements');
  }
  getPaymentPeriod(value:any){
    
    this.NonproportionalForm.get("settlement1")?.setValue(this._DatePipe.transform(this.currentDate,'YYYY-MM-dd'))
    this.periodValue=value
    if(value ==0){                // 1 
      this.arrDates=[]
      this.totalPercentage = 100;
      $(".payment1").show(400);
      $(".OtherSettlement").hide(400);
      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.NonproportionalForm.get("settlement2")?.setValue('')
      this.NonproportionalForm.get("settlement3")?.setValue('')
      this.NonproportionalForm.get("settlement4")?.setValue('')
    }else if(value ==1){          // 2
      this.arrDates=[]
      this.totalPercentage = 100;
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".OtherSettlement").hide(400);
      // 6
      const Month6 = this.addMonths(new Date(this.currentDate), 6 , 6);
      this.NonproportionalForm.get("settlement2")?.setValue(this._DatePipe.transform(Month6,'YYYY-MM-dd'))

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.NonproportionalForm.get("settlement3")?.setValue('')
      this.NonproportionalForm.get("settlement4")?.setValue('')
    }else if(value ==2){          // 3
      this.arrDates=[]
      this.totalPercentage = 100;
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);
      $(".OtherSettlement").hide(400);
      // 3
      const Month3 = this.addMonths(new Date(this.currentDate), 3 , 3);
      this.NonproportionalForm.get("settlement2")?.setValue(this._DatePipe.transform(Month3,'YYYY-MM-dd'))

      // 6
      const Month6 = this.addMonths(new Date(this.currentDate), 6 , 6);
      this.NonproportionalForm.get("settlement3")?.setValue(this._DatePipe.transform(Month6,'YYYY-MM-dd'))

      // 9
      const Month9 = this.addMonths(new Date(this.currentDate), 9 , 9);
      this.NonproportionalForm.get("settlement4")?.setValue(this._DatePipe.transform(Month9,'YYYY-MM-dd'))

      // Other
    }else if(value ==3){  
      this.totalPercentage = 100;        
      $(".payment1").hide(400);
      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      $(".OtherSettlement").show(400);
      this.NonproportionalForm.get("settlement1")?.setValue('')
      this.NonproportionalForm.get("settlement2")?.setValue('')
      this.NonproportionalForm.get("settlement3")?.setValue('')
      this.NonproportionalForm.get("settlement4")?.setValue('')
      this.otherDate = this.currentInceptionDate
      
    }
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
  viewDates() {
    if (this.arrDates.length < 12) {
      const formattedDate = this._DatePipe.transform(this.otherDate, 'yyyy-MM-dd');
      if (formattedDate) {
        this.arrDates.push({ date: formattedDate});
        this.updateCurrentInceptionDate();
          this.otherDate = '';
      }
    } else {
      this._ToastrService.show("Settlements cannot be more than '12'");
    }
  }
  //Remove item From Dates Arr
  removeDate(index:number){
    this.arrDates.splice(index, 1)
    this.updateCurrentInceptionDate();
  }
  updateCurrentInceptionDate() {
    if (this.arrDates.length > 0) {
      const highestDate = this.arrDates.reduce((prev, current) => (prev.date > current.date ? prev : current)).date;
      this.currentInceptionDate = new Date(highestDate);
      this.currentInceptionDate.setDate(this.currentInceptionDate.getDate() + 1); 
    } else {
      this.currentInceptionDate = this.Dateifarrayempty;
    }
  }
  validateLossLimit() {
  const lossValue = this.MainForm.get('lossAdviceLimit')?.value;
  const cashValue = this.MainForm.get('cashCall')?.value;

  if (lossValue && cashValue && lossValue > cashValue) {
    this._ToastrService.warning('Loss Advice Limit must not be greater than Cash Call', 'Warning');
  }
}

calculateRetentionalLimit() {
  const quotationLimit = this.proportionalForm.get('qoutaShareLimit')?.value || 0;
  const retantion = this.SubTreatyForm.get('retantion')?.value || 0;

  if (quotationLimit != null && retantion != null) {
    const result = quotationLimit * (retantion/100);
    this.SubTreatyForm.get('treatyLimit')?.setValue(result);
  }
}
calculateSurplusLomit() {
  const quotationLimit = this.proportionalForm.get('qoutaShareLimit')?.value || 0;
  const noOfLinesLimit = this.SubTreatyForm.get('noOfLines')?.value || 0
   if (quotationLimit != null && noOfLinesLimit != null) {
    const result = quotationLimit * noOfLinesLimit;
    this.SubTreatyForm.get('surplusLimit')?.setValue(result);
  }

}
calculatereinsuranceLimite(){
  const quotationLimit = this.proportionalForm.get('qoutaShareLimit')?.value
  const RetaionMain = (100 - this.SubTreatyForm.get('retantion')?.value)
   if (RetaionMain != null && quotationLimit != null) {
    const result = quotationLimit * (RetaionMain/100);
    this.CompanyShareForm.get('reinsurancLimite')?.setValue(result);
  }
}
  setZeroIfEmpty(controlName: string) {
    const control = this.SubTreatyForm.get(controlName);
    if (control && (control.value === null || control.value === '')) {
      control.setValue(0);
    }
  }
  Result1:number=0
  Result2:number=0
  ngOnInit(){
    this.SubTreatyForm.get('treatyLimit')?.disable();
    this.SubTreatyForm.get('retantion')?.disable();
    this.SubTreatyForm.get('treatyLimit')?.disable();
    this.SubTreatyForm.get('surplusLimit')?.disable();
    this.CompanyShareForm.get('reinsurancLimite')?.disable();
    this.CompanySharenonForm.get('reinsurancLimite')?.disable();
    this.SubTreatyXLForm.get('excess')?.disable();
    this.proportionalForm.get('treatyLimit')?.disable();

    this.GetAllProducts()
    this.GetAllReInsurCompanies()
    this.GetAllReInsurBrokers()
    // this.getAllLayerRiskType()
    this.updateLeaderState()
    this.MainForm.get('from')?.valueChanges.subscribe((dateValue: string) => {
      if (dateValue) {
        const year = new Date(dateValue).getFullYear(); 
        this.MainForm.get('underWritingYear')?.disable()
        this.MainForm.get('underWritingYear')?.setValue(year.toString());
      }
    });
    // this.proportionalForm.get('lossAdviceLimit')?.valueChanges.subscribe((lossvalue: number) => {
    //   console.log("ppppp");
      
    //   const cashValue = this.proportionalForm.get('cashCall')?.value;
    //   if (lossvalue > cashValue) {
    //     this._ToastrService.warning('Loss Advice Limit must not be greater than Cash Call', 'Warning');
    //   }
    // });

    // this.proportionalForm.get('cashCall')?.valueChanges.subscribe((cashvalue: number) => {
    //   const lossValue = this.proportionalForm.get('lossAdviceLimit')?.value;
    //   if (lossValue > cashvalue) {
    //     this._ToastrService.warning('Loss Advice Limit must not be greater than Cash Call', 'Warning');
    //   }
    // });
     this.proportionalForm.get('quotationLimit')?.valueChanges.subscribe(value => {
      this.calculateRetentionalLimit();
    });

    this.SubTreatyForm.get('retantion')?.valueChanges.subscribe(value => {
    this.calculateRetentionalLimit();
        // this.calculatereinsuranceLimite();

   });

     this.SubTreatyForm.get('noOfLines')?.valueChanges.subscribe(value => {
      if(this.SubTreatyForm.get('layersType')?.value != 1){
        this.calculateSurplusLomit();
      }
   });

    this.NonproportionalForm.get('priority')?.valueChanges.subscribe(value => {
      this.SubTreatyXLForm.get('excess')?.setValue(value);
   });
  //   this.CompanySharenonForm.get('fess')?.valueChanges.subscribe(value => {
  //     this.Result1=(value/100)*this.totoalofmimanddeposit
  //     console.log("this.Result1",this.Result1);
  //     this.Result2=this.Result1+this.totoalofmimanddeposit
  //     console.log("this.Result2",this.Result2);
      
  //  });
  //  i want to handel that one appear and the other disappear
  const aggregate = this.SubTreatyXLForm.get('aggregate');
  const reinstatement = this.SubTreatyXLForm.get('reinstatementNumber');
  const reinstatementDetail = this.SubTreatyXLForm.get('flatReInstatment');
  aggregate?.valueChanges.subscribe(val => {
    if (val != null && val !== '') {
      // Hide reinstatement, make aggregate required
      aggregate.setValidators([Validators.required, Validators.min(0)]);
      reinstatement?.clearValidators();
      reinstatement?.setValue(null, { emitEvent: false }); // prevent infinite loop
    } else {
      // Both required if both empty
      aggregate.setValidators([Validators.required, Validators.min(0)]);
      reinstatement?.setValidators([Validators.required, Validators.min(0)]);
    }
    aggregate.updateValueAndValidity({ emitEvent: false });
    reinstatement?.updateValueAndValidity({ emitEvent: false });
  });

  reinstatement?.valueChanges.subscribe(val => {
    if (val != null && val !== '') {
      // Hide aggregate, make reinstatement required
      reinstatement.setValidators([Validators.required, Validators.min(0)]);
      reinstatementDetail?.setValidators([Validators.required]);
      aggregate?.clearValidators();
      aggregate?.setValue(null, { emitEvent: false }); // prevent infinite loop
    } else {
      // Both required if both empty
      reinstatement.setValidators([Validators.required, Validators.min(0)]);
      aggregate?.setValidators([Validators.required, Validators.min(0)]);

      reinstatementDetail?.clearValidators();
      reinstatementDetail?.setValue('', { emitEvent: false });
    }
    reinstatement.updateValueAndValidity({ emitEvent: false });
    aggregate?.updateValueAndValidity({ emitEvent: false });
    reinstatementDetail?.updateValueAndValidity({ emitEvent: false });

  });

    const BrokerValue = this.CompanySharenonForm.get('reInsuranceBrokerId');
    const brokerCommissionValue = this.CompanySharenonForm.get('brokerCommission');
     BrokerValue?.valueChanges.subscribe(val => {
    if (val != null && val !== '') {
      // Hide reinstatement, make aggregate required
      brokerCommissionValue?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      // Both required if both empty
      brokerCommissionValue?.clearValidators();
      brokerCommissionValue?.setValue(null, { emitEvent: false }); // prevent infinite loop
    }
    brokerCommissionValue?.updateValueAndValidity({ emitEvent: false });
  });

    const panelValue = this.CompanySharenonForm.get('panel');
    const fessvalue = this.CompanySharenonForm.get('fess');
     panelValue?.valueChanges.subscribe(val => {
    if (val == 1) {
      // Hide reinstatement, make aggregate required
      fessvalue?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      // Both required if both empty
      fessvalue?.clearValidators();
      fessvalue?.setValue(null, { emitEvent: false }); // prevent infinite loop
    }
    fessvalue?.updateValueAndValidity({ emitEvent: false });
  });




   const BrokerProposValue = this.CompanyShareForm.get('brokerId');
    const brokerproposCommissionValue = this.CompanyShareForm.get('brokerPct');
     BrokerProposValue?.valueChanges.subscribe(val => {
    if (val != null && val !== '') {
      // Hide reinstatement, make aggregate required
      brokerproposCommissionValue?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      // Both required if both empty
      brokerproposCommissionValue?.clearValidators();
      brokerproposCommissionValue?.setValue(null, { emitEvent: false }); // prevent infinite loop
    }
    brokerproposCommissionValue?.updateValueAndValidity({ emitEvent: false });
  });



    const profitcommisionValue = this.CompanySharenonForm.get('profitCommission');
    const managmentfesssValue = this.CompanySharenonForm.get('managmentExpenses');
     profitcommisionValue?.valueChanges.subscribe(val => {
    if (val != null && val !== '') {
      // Hide reinstatement, make aggregate required
      managmentfesssValue?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      // Both required if both empty
      managmentfesssValue?.clearValidators();
      managmentfesssValue?.setValue(null, { emitEvent: false }); // prevent infinite loop
    }
    managmentfesssValue?.updateValueAndValidity({ emitEvent: false });
  });




  }
}

