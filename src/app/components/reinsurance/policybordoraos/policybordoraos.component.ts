import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { ListsService } from 'src/app/services/lists.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-policybordoraos',
  templateUrl: './policybordoraos.component.html',
  styleUrls: ['./policybordoraos.component.scss'],
    providers:[DatePipe]
  
})
export class PolicybordoraosComponent {
  AllContries:any;
  FromVal = ''
  ToVal:any = ''
  contryValue:any= '65';
  pageType:any
  UYList:any[]=[]
  TreatiesList:any[]=[
    // {id:1,treatyName:'Mohamed',reinsurances:[{reInsuranceCompanyId:1,reInsuranceCompanyName:'test1'},{reInsuranceCompanyId:2,reInsuranceCompanyName:'test2'}]},
    // {id:2,treatyName:'Ali',reinsurances:[{reInsuranceCompanyId:3,reInsuranceCompanyName:'test3'},{reInsuranceCompanyId:4,reInsuranceCompanyName:'test4'}]},
  ]
  ReInsuranBrokerPeriodList:any;
  ReInsuranceBrokers:any;
  AllQuarters:any[]=[]
  pdfSrc: SafeResourceUrl | undefined;
  isClicked:boolean = false;
  constructor(private _AdminService:AdminService,private _ReInsuranceService:ReInsuranceService,private _DatePipe:DatePipe,
     private sanitizer: DomSanitizer,private _ToastrService:ToastrService, private _ListsService:ListsService,
     private _ActivatedRoute:ActivatedRoute){
      this._ActivatedRoute.queryParams.subscribe(params=>{
        this.pageType = params['paramName'];
        this.Form.reset();
        // this.TreatiesList=[]
        this.ReInsuranBrokerPeriodList=[]
        this.AllQuarters=[]
        this.ReInsuranBrokerPeriodList=''
        this.FromVal = ''
        this.ToVal = ''
        $("#DateType").hide(300)
        // $("#calculate").show(300);
        $("#viewPdf").hide(300);
        if(this.pageType=='SOA'||this.pageType=='Borderaeux'){
          this.Form.get('type')?.setValidators([Validators.required]);
          this.Form.get('type')?.updateValueAndValidity();
          this.Form.get('searchDateType')?.setValidators([Validators.required]);
          this.Form.get('searchDateType')?.updateValueAndValidity();
          // this.GetAllTreatiesNames('')
        }else{
          this.Form.get('type')?.setValidators(null)
          this.Form.get('type')?.updateValueAndValidity()
          this.Form.get('searchDateType')?.setValidators(null)
          this.Form.get('searchDateType')?.updateValueAndValidity()
        }

        if(this.pageType=='SOA'){
          this.Form.get('companyReInsuranceId')?.setValidators(null)
          this.Form.get('companyReInsuranceId')?.updateValueAndValidity()
        }else{
          this.Form.get('companyReInsuranceId')?.setValidators([Validators.required]);
          this.Form.get('companyReInsuranceId')?.updateValueAndValidity();
        }
        // Active Nav
      if(this.pageType=='SOA'){localStorage.setItem("act_Nav",'SOA')}
      else if(this.pageType=='Borderaeux'){localStorage.setItem("act_Nav",'Policy Borderaeux')}
      else if(this.pageType=='Claims'){localStorage.setItem("act_Nav",'Claims Borderaeux')}
      else if(this.pageType=='Outstanding'){localStorage.setItem("act_Nav",'Outstanding Borderaeux')}
      })
      
    }
  Form:FormGroup = new FormGroup({
    'underwritingYear':new FormControl(''),
    'TreatyId':new FormControl('',[Validators.required]),
    'companyReInsuranceId':new FormControl('',[Validators.required]),
    'brokerId':new FormControl(null),
    'period':new FormControl('',[Validators.required]),
    'searchDateType':new FormControl(null,[Validators.required]),
    'type':new FormControl("1")
  })
  // UY
  GetAllUnderWritingYears(){
    this._ReInsuranceService.GetAllUnderWritingYears().subscribe((data:any)=>{
      console.log("Years",data);
      this.UYList = data;
    })
  }
  // From And To 
  getFromAndTo(){
    this._ReInsuranceService.getFromAndTo(Number(this.Form.get('TreatyId')?.value),this.Form.get('period')?.value).subscribe((data:any)=>{
      console.log(data);
      this.FromVal = data.from
      let specificDate = new Date(data.to)
      specificDate.setDate(specificDate.getDate() - 1);
      this.ToVal= this._DatePipe.transform(specificDate,'YYYY-MM-dd')
    })
  }
  // Treaties
  GetAllTreatiesNames(year:any){
    this.ReInsuranBrokerPeriodList = ''
    this.Form.patchValue({TreatyId:'',companyReInsuranceId:'',brokerId:null,period:''})
    this._ReInsuranceService.GetAllTreatiesNames(year).subscribe((data:any)=>{
      this.TreatiesList = data;
      console.log("TreatiesList",this.TreatiesList);
      
    })
  }
  // ReInsurance , Broker , period
  GetTreatyReInsuranceAndBrokerAndPeriods(treatyName:any){
    this.ReInsuranBrokerPeriodList = ''
    this.Form.patchValue({companyReInsuranceId:'',brokerId:null,period:''})
    this._ReInsuranceService.GetTreatyReInsuranceAndBrokerAndPeriods(treatyName).subscribe((data:any)=>{
      console.log(data);
      this.ReInsuranBrokerPeriodList = data;
    },error=>{
      this._ToastrService.show('',error.error)
    })
  }

  // ReInsurance Calculation Pdf
  excelUrl: string | null = null;
  FileName:any
  ReInsuranceCalculationPdf(){
    // console.log(this.Form.value);
    let object= this.TreatiesList.find(item=>item.id==this.Form.get('TreatyId')?.value)
    console.log(object);
    
    this.isClicked= true;
    let Model =Object.assign(this.Form.value,{treatyName:object.treatyName},{companyReInsuranceId:this.Form.get('companyReInsuranceId')?.value==""?null:this.Form.get('companyReInsuranceId')?.value},{BordereauxTypes:this.Form.get('type')?.value})
    console.log(Model);
    this._ReInsuranceService.ReInsuranceCalculationPdf(this.pageType,Model).subscribe((response:any)=>{
      this.isClicked= false;
      // $("#calculate").hide(300);
      console.log(response);
      
      if(this.pageType=='SOA'){
        $("#viewPdf").show(300);
        const blob = new Blob([response], { type:'application/pdf'});
        const url = URL.createObjectURL(blob);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      }else if(this.pageType=='Borderaeux'){
        let blob:Blob = response.body as Blob
        this.FileName= 'Policy Borderaeux.xlsx'
        let a= document.createElement('a');
        a.download=this.FileName
        a.href=window.URL.createObjectURL(blob)
        a.click()
      }else if(this.pageType=='Claims'){
        let blob:Blob = response.body as Blob
        this.FileName= 'Claims Borderaeux.xlsx'
        let a= document.createElement('a');
        a.download=this.FileName
        a.href=window.URL.createObjectURL(blob)
        a.click()
      }else if(this.pageType=='Outstanding'){
        let blob:Blob = response.body as Blob
        this.FileName= 'Outstanding Borderaeux.xlsx'
        let a= document.createElement('a');
        a.download=this.FileName
        a.href=window.URL.createObjectURL(blob)
        a.click()
      }

    },async error=>{
      this.isClicked= false;
      const message = await error.error.text()
      Swal.fire({icon: 'error',title: 'Oops...', text: message});
    })
  }
  getSelectedCom(){
    this.ReInsuranceBrokers = ''
    if(this.pageType=='SOA'){
      
      if(this.Form.get("companyReInsuranceId")?.value==''){
        $("#BrokerField").hide(300)
        this.Form.get("brokerId")?.setValue(null)
      }else{
        $("#BrokerField").show(300)
        let Exist =  this.ReInsuranBrokerPeriodList.companiesAndBrokers.find((item:any)=>item.reInsuranceCompanyId == this.Form.get("companyReInsuranceId")?.value)
        console.log(Exist);
        this.ReInsuranceBrokers = Exist?.reInsuranceBrokers
      }
    }
  }
  reset(){
    this.Form.reset();
    $("#viewPdf").hide(300);
    // $("#calculate").show(300);
  }
  getType(){
    if(this.Form.get('type')?.value==1){
      $("#DateType").show(300)
      this.Form.get('searchDateType')?.setValidators([Validators.required]);
      this.Form.get('searchDateType')?.updateValueAndValidity();
    }else{
      $("#DateType").hide(300)
      this.Form.get('searchDateType')?.setValue(null)
      this.Form.get('searchDateType')?.setValidators(null)
      this.Form.get('searchDateType')?.updateValueAndValidity()
    }
  }

  // getUy
  getUY(){
    this.GetAllTreatiesNames(this.Form.get("underwritingYear")?.value)
  }
  // getUy
  // getTreatyName(){
  //   this.GetTreatyReInsuranceAndBrokerAndPeriods(this.Form.get("treatyName")?.value)
  // }
  newBrokers:any[]=[]
  Periods:any[]=[]
  getTreatyName(e:any){
    console.log(e.value);
    let object = this.TreatiesList.find(item=>item.id==e.value)
    this.newBrokers=object.reInsurances
    console.log( this.newBrokers);
    this.getPeriod()
    // this.GetTreatyReInsuranceAndBrokerAndPeriods(this.Form.get("treatyName")?.value)
  }

  getPeriodTo(){
    this.getFromAndTo();
  }
   // Treaties

   TypesSAOBordereaux:any
   SOAAndBordereauxTypes(){
    this.Form.patchValue({TreatyId:'',companyReInsuranceId:'',brokerId:null,period:''})
    this._ReInsuranceService.SOAAndBordereauxTypes().subscribe((data:any)=>{
      this.TypesSAOBordereaux = data;
      console.log("this.TypesSAOBordereaux",this.TypesSAOBordereaux);
      
    })
  }
        // Get Search Date Types
  SearchDateTypes:any
  GetSearchDateTypes(){
    this._ListsService.GetSearchDateTypes().subscribe(data=>{
      this.SearchDateTypes =data;
    },error=>{
      console.log(error);
    })
  }
  getPeriod(){
    const treatyName = this.Form.get('TreatyId')?.value;
    if (!treatyName) {
      this._ToastrService.warning('Please select a treaty name first', 'Warning'); 
      return;
    }
     this._ReInsuranceService.GetAllPeriodes(treatyName).subscribe((data:any)=>{
      this.Periods =data;
      console.log("this.periods",this.Periods);
      
    },error=>{
      console.log(error);
    })
  }

  ngOnInit(){
    
    this.GetSearchDateTypes()
    this.GetAllUnderWritingYears()
    this.SOAAndBordereauxTypes()
      this.Form.get('type')?.setValue(1);

  }
}
