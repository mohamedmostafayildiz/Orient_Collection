import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ListsService } from 'src/app/services/lists.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any
@Component({
  selector: 'app-Offer',
  templateUrl: './addOffer.component.html',
  styleUrls: ['./addOffer.component.scss']
})
export class AddOfferComponent implements OnInit{
   date:any = new Date()
  CustomerId:any
  policyId:any
  InsuranceClasses:any[]=[]
  insuranceClassValue:any=''
  maritalStatusVal:any=''
  MilitarySevicesVal:any=''
  BusinessTypes:any
  BusinessTypeValue:any ='0'
  brokerCustomers:any[] =[]
  BrokerValue:any =''
  SourceValue:any =''
  insuredPrev:any =''
  maritalStatusValidation:Boolean = false
  MilitarySevicesValidation:Boolean = false
  brokerInputValidation:Boolean = false
  insuredPrevValidation:Boolean = false
  MaritalsStatus:any;
  MilitaryStatus:any;
  listOfTpa:any;
  AllBranches:any
  isClicked:boolean= false
  CashedInputs:any
  constructor(private _SharedService:SharedService, private _AdminService:AdminService,private _ListsService:ListsService, private _router:Router,private _ActivatedRoute:ActivatedRoute, private _PolicyService:PolicyService){
    this.CustomerId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this._ActivatedRoute.queryParams.subscribe((data:any)=>{
      this.CashedInputs = data
      console.log(data);
      // this.SearchForm.get('Code')?.setValue(data?.Code)
      // this.SearchForm.get('InsuredName')?.setValue(data?.InsuredName)
      // this.SearchForm.get('BrokerId')?.setValue(data?.BrokerId==null?'':Number(data?.BrokerId)||data?.BrokerId==0?'':Number(data?.BrokerId))
      // this.SearchForm.get('UnderWritingYear')?.setValue(data?.UnderWritingYear)
    });
  }
  

  ///////////////// Star Pricing indivual Form ////////////// 
  OfferForm:FormGroup = new FormGroup({
    'BranchId':new FormControl('',[Validators.required]),
    'offerDate':new FormControl(this.date,[Validators.required]),
    'tpaId':new FormControl(''),
    'insuranceClass':new FormControl(1,[Validators.required]),
    'policySource':new FormControl('',[Validators.required]),
    'customerName':new FormControl('',[Validators.required]),
  })
  
  SubmitOffer(){
    this.isClicked=  true
    if(this.BrokerValue=='')
      {this.BrokerValue = ''}

    let Model = Object.assign(this.OfferForm.value,
      {brokerId:this.BrokerValue},
      {businessType:Number(this.BusinessTypeValue)}, 
      )
      console.log(Model);
      this._PolicyService.AddOffer(Model).subscribe(async (res:any)=>{
        this.isClicked=  false
        this._SharedService.setAlertMessage('Offer have been Added Successfully');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Swal.fire('Good job!','Offer Added Successfully','success')
        console.log("offerAdddetails",res);
        this.policyId = res.id
        await this._router.navigate(['/Offer'],{queryParams:{
          brokerId:this.BrokerValue,BranchId:Model.BranchId,tpaId:Model.tpaId,policySource:Model.policySource,customerName:Model.customerName
        }})
        this._router.navigate(['/UploadPlansFile/'+this.policyId])
      },async error=>{
        this.isClicked=  false
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error,
        })
      })
    this.BrokerValue=String(this.BrokerValue)
  }

  ///////////////// End Pricing Form ////////////// 

    //get Business Types
    getBusinessTypes(){
      this._AdminService.getBusinessTypes().subscribe(data=>{
        this.BusinessTypes=data;
      })
    }
      typee:any='Individual'
     //get Insurance Types
     getInsuraneClass(){
      this._AdminService.getInsuraneClass().subscribe((data:any)=>{
        this.InsuranceClasses=data;
      })
    }
     //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe((data:any)=>{
      this.brokerCustomers= data;
    })
  }
  // Show & hide indivual Details
  getInsuranceClassVal(value:any){            /// In Policy not Offer
    if(value==0){
      $("#inCaseIndivual").show(400)
      this.OfferForm.get("height")?.setValidators([Validators.required])
      this.OfferForm.get("height")?.updateValueAndValidity()
      this.OfferForm.get("weight")?.setValidators([Validators.required])
      this.OfferForm.get("weight")?.updateValueAndValidity()
      this.insuredPrevValidation = true
      this.maritalStatusValidation = true
      this.MilitarySevicesValidation = true
    }else{
      $("#inCaseIndivual").hide(400)
    //height
      this.OfferForm.get("height")?.clearValidators()
      this.OfferForm.get("height")?.updateValueAndValidity()
      this.OfferForm.get("height")?.setValue('')

    //weight
      this.OfferForm.get("weight")?.clearValidators()
      this.OfferForm.get("weight")?.updateValueAndValidity()
      this.OfferForm.get("weight")?.setValue('')

    // oldInsuranceCompany
      this.OfferForm.get("oldInsuranceCompany")?.clearValidators()
      this.OfferForm.get("oldInsuranceCompany")?.updateValueAndValidity()
      this.OfferForm.get("oldInsuranceCompany")?.setValue('')

    //oldInsuranceDate
      this.OfferForm.get("oldInsuranceDate")?.clearValidators()
      this.OfferForm.get("oldInsuranceDate")?.updateValueAndValidity()
      this.OfferForm.get("oldInsuranceDate")?.setValue('')

    //insuredPrev
      this.insuredPrevValidation = false
      this.insuredPrev = ''
      this.maritalStatusValidation = false
      this.maritalStatusVal = ''
      this.MilitarySevicesValidation = false
      this.MilitarySevicesVal = ''
    }
  }
  // Show & hide Broker Details
  getSourceVal(value:any){
    console.log(value);
    if(value==1){
      $("#BrokerFiled").show(400)
      this.brokerInputValidation= true  
    }else{
      $("#BrokerFiled").hide(400)
      this.brokerInputValidation= false
      this.BrokerValue = '';
    }
  }
  getBrokerVal(){
    if(this.BrokerValue== ''){
      this.brokerInputValidation= true
    }else{
      this.brokerInputValidation= false
    }
  }
  // Marital Status
  getmaritalStatusVal(e:any){
    if(e.value!= ''){
      this.maritalStatusValidation= false
    }else{
      this.brokerInputValidation= true
    }
  }

  //Question 1
  getInsuredPrev(value:any){
    this.insuredPrevValidation = false
    this.insuredPrev=value;
    console.log(value);
    if(value=='true'){
      $("#insuredPreviousDetails").show(400);
      // oldInsuranceCompany
      this.OfferForm.get("oldInsuranceCompany")?.setValidators([Validators.required])
      this.OfferForm.get("oldInsuranceCompany")?.updateValueAndValidity()
      //oldInsuranceDate
      this.OfferForm.get("oldInsuranceDate")?.setValidators([Validators.required])
      this.OfferForm.get("oldInsuranceDate")?.updateValueAndValidity()
    }else if(value=='false'){
      $("#insuredPreviousDetails").hide(400)

      // oldInsuranceCompany
      this.OfferForm.get("oldInsuranceCompany")?.clearValidators()
      this.OfferForm.get("oldInsuranceCompany")?.updateValueAndValidity()
      this.OfferForm.get("oldInsuranceCompany")?.setValue('')
      //oldInsuranceDate
      this.OfferForm.get("oldInsuranceDate")?.clearValidators()
      this.OfferForm.get("oldInsuranceDate")?.updateValueAndValidity()
      this.OfferForm.get("oldInsuranceDate")?.setValue('')
    }
    
  }

  getListOfTpa(){
    this._PolicyService.getListOfTpa().subscribe(data=>{
      this.listOfTpa = data;
    })
  } 
  IndividualOrCorporate:any
  // Get Corporate  & Indivudual
  getAllIndividualOrCorporate(){
    this._PolicyService.GetListOfIndividualAndCorporate().subscribe(data=>{
      this.IndividualOrCorporate=data;
    })
  }
  getAllBranches(){
    this._PolicyService.getAllBranches().subscribe(data=>{
      this.AllBranches = data
    })
  }
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);
    this.getInsuraneClass();
    this.getAllBranches();
    this.getBusinessTypes();
    this.getBrokerCustomers();
    this.getListOfTpa()
    this.getAllIndividualOrCorporate()

    this.OfferForm.get('customerName')?.setValue(this.CashedInputs.customerName)
    this.OfferForm.get('BranchId')?.setValue(this.CashedInputs.BranchId==null?'': Number(this.CashedInputs.BranchId))
    this.OfferForm.get('tpaId')?.setValue(this.CashedInputs.tpaId==null?'': Number(this.CashedInputs.tpaId))
    this.OfferForm.get('policySource')?.setValue(this.CashedInputs.policySource==null?'':Number(this.CashedInputs.policySource))
    if(Number(this.CashedInputs.brokerId)>0){
      this.BrokerValue =Number(this.CashedInputs.brokerId)
    }else{
      this.BrokerValue =''
    }
    console.log(this.BrokerValue);

    if(this.CashedInputs.policySource==undefined){
      $("#BrokerFiled").hide(300)
    }else if (this.CashedInputs.policySource=='1')
    $("#BrokerFiled").show(500)
  }
}