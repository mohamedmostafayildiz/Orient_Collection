import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AppendixService } from 'src/app/services/appendix.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-endorsment',
  templateUrl: './endorsment.component.html',
  styleUrls: ['./endorsment.component.scss'],
  providers : [DatePipe]
})
export class EndorsmentComponent {
  loading:boolean= false
  PolicyDetails:any;
  PolicyGroup:any=[]
  EditableGroup:any[]=[]
  CategoryEditGroup:any[]=[]
  GroupToRemove:any=[]
  PolicyPlans:any=[]
  CategoryEdit:any[]=[]
  PolicyId:any;
  AppendType:any
  selectedGroupFile:any
  formData:any = new FormData()
  BusinessTypes: any;
  InsuranceClasses: any;
  isClicked:boolean =false
  FileName:any
  brokerCustomers:any
  testModal:any[]=[]
  CurrentDate:any =new Date()
  base64File:any
  term:any
  EndorsmentDateVAl:any =new Date()
  inValidRemoveDate:boolean= false
  ErrorCurrentDateFormat:any
  PumpArr:any
  netPremiumVal:any
  constructor(private _SharedService:SharedService,private _ToastrService:ToastrService ,private _AdminService:AdminService,private _PolicyService:PolicyService,public _DatePipe:DatePipe,private _Router:Router,private _ActivatedRoute:ActivatedRoute ,private _AppendixService:AppendixService){
    this._ActivatedRoute.paramMap.subscribe((param:ParamMap)=>{
      this.PolicyId = param.get('id')
    })
    this.CurrentDate= this._DatePipe.transform(this.CurrentDate,'YYYY-MM-dd')
}
TechnicalForm:FormGroup= new FormGroup({
  insured:new FormControl('',[Validators.required,Validators.minLength(2)]),
  brokerId:new FormControl('',[Validators.required]),
  policySource:new FormControl('',[Validators.required])
})
  // Appendex Value
  getAppendexVal(Value:any){
    this.EditableGroup = Array.from(this.PolicyGroup);
    this.CategoryEditGroup = Array.from(this.PolicyGroup);
    this.AppendType = Value
    if(Value=='Add'){                 // Add
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#CancelFromBeginning').hide(600)
      $('#Cancel').hide(600)
      $('#Pump').hide(600)

      $('#AddAppendix').show(600)
    }else if(Value=='Remove'){        // Remove
      $('#CancelFromBeginning').hide(600)
      $('#AddAppendix').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)
      $('#Pump').hide(600)

      $('#Delete').show(600)
      
    }else if(Value=='Technical'){     // Technical
      $('#CancelFromBeginning').hide(600)
      $('#Delete').hide(600)
      $('#AddAppendix').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)
      $('#Pump').hide(600)


      $('#Technical').show(600)
      this.TechnicalForm.get('insured')?.setValue(this.PolicyDetails.insuredName)
      
      this.TechnicalForm.get('policySource')?.setValue(this.PolicyDetails.policySource)
      if(this.PolicyDetails.policySource=="Direct"){
        $('#bokerField').hide(300)
        this.TechnicalForm.get('brokerId')?.clearValidators()
        this.TechnicalForm.get('brokerId')?.updateValueAndValidity()
      }else{
        $('#bokerField').show(300)
        this.TechnicalForm.get('brokerId')?.setValue(this.PolicyDetails.brokerId)
        this.TechnicalForm.get('brokerId')?.setValidators([Validators.required])
        this.TechnicalForm.get('brokerId')?.updateValueAndValidity()
      }

    }else if(Value=='CategoryEdit'){  // CategoryEdit
      $('#CancelFromBeginning').hide(600)
      $('#AddAppendix').hide(600)
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#Cancel').hide(600)
      $('#Pump').hide(600)

      $('#CategoryEdit').show(600)
    }else if(Value=='CancelFromBeginning'){// CancelFromBeginning
      $('#AddAppendix').hide(600)
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)
      $('#Pump').hide(600)

      $('#CancelFromBeginning').show(600)
    }else if(Value=='Cancel'){        // Cancel
      $('#CancelFromBeginning').hide(600)
      $('#AddAppendix').hide(600)
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Pump').hide(600)

      $('#Cancel').show(600)
    }else if(Value=='Pump'){        // Pump
      $('#CancelFromBeginning').hide(600)
      $('#AddAppendix').hide(600)
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)

      $('#Pump').show(600)
    }
  }
  uploadGroupFile(event: any){
    this.selectedGroupFile = event.target.files[0];
    event.target.value='' 
  }
  
  ///////////////////////=> Add <=///////////////////////////
  SubmitAppendix(){
    this.isClicked = true
    this.formData.append('EndorsementType',this.AppendType)
    this.formData.append('UpdatePolicyDto.Id',this.PolicyId)
    this.formData.append('EndorsementDate',this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'))
  if(this.AppendType=='Add'){
    this.formData.append('UpdatePolicyDto.GroupFile',this.selectedGroupFile)
  }else if(this.AppendType=='Remove'){
    for(let i=0;i<this.testModal.length;i++){
      this.formData.append('UpdatePolicyDto.GroupToRemove['+ i+ '].id',this.testModal[i].id)
      this.formData.append('UpdatePolicyDto.GroupToRemove['+ i+ '].removeDate',this.testModal[i].date)
      this.formData.append('UpdatePolicyDto.GroupToRemove['+ i+ '].hasClaims',this.testModal[i].hasClaims)
  }


  }else if(this.AppendType=='Technical'){
      this.formData.append('UpdatePolicyDto.InsuredName',this.TechnicalForm.get('insured')?.value);
      this.formData.append('UpdatePolicyDto.PolicySource',this.TechnicalForm.get('policySource')?.value);
      this.formData.append('UpdatePolicyDto.BrokerId',this.TechnicalForm.get('brokerId')?.value);
  }else if(this.AppendType=='CategoryEdit'){
    for(let i=0;i<this.CategoryEdit.length;i++){
      this.formData.append('UpdatePolicyDto.ChangePlanDto['+ i +'].planId',this.CategoryEdit[i].planId)
      this.formData.append('UpdatePolicyDto.ChangePlanDto['+ i+ '].customerId',this.CategoryEdit[i].customerId)
    }
  }else if(this.AppendType=='Pump'){
    this.formData.append('UpdatePolicyDto.NetPremium',this.netPremiumVal)
  }
  for (var pair of this.formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }
  this._AppendixService.AddPolicyAppendix(this.formData).subscribe( async (res:any)=>{
    this.isClicked = false
    ///// Add ////
    if(this.AppendType=='Add'){
      console.log(res);
      // Swal.fire({title:'New Group Members Added Successfullly',icon:'success',timer:4000,timerProgressBar:true})
      const queryParams: any = {};
      const navigationExtras: NavigationExtras = {queryParams};
      queryParams.myArray =JSON.stringify(res);
      await this._Router.navigate(['/EndorsmentPrem',this.PolicyId,
      this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),'Add'],navigationExtras)
    }
    ///////// Remove ////////
    else if(this.AppendType=='Remove'){
       let Model ={
        'endorsementGroups':res,
        'policyId':this.PolicyId,
        'type':'Remove',
        'endorsementDate':this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),
        'policySource':null,
        'brokerId':null,
        'insuredName':null
      }
      this._PolicyService.UpdatePolicyGroupPremiumEndor(Model).subscribe(res2=>{
        // Swal.fire({icon: 'success',title: 'Group Details Edited Successfully',showConfirmButton: false,})
        console.log(res2);
        const queryParams: any = {};
        const navigationExtras: NavigationExtras = {queryParams};
        queryParams.myArray =JSON.stringify(Object.assign({data:res2,file:res}));
        this._Router.navigate(['/CancleUpdate',this.PolicyId,this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),'Remove'],navigationExtras)
  
        this.isClicked= false
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title:error.error,text:''})
        this.isClicked= false
      })
    }
    
    /////// Technical ////////////
    else if(this.AppendType=='Technical'){
      let Model ={
        'endorsementGroups':res,
        'policyId':this.PolicyId,
        'type':'Technical',
        'endorsementDate':this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),
        'policySource':this.TechnicalForm.get('policySource')?.value,
        'brokerId':this.TechnicalForm.get('brokerId')?.value,
        'insuredName':this.TechnicalForm.get('insured')?.value,
      }
      console.log(Model);
      this._PolicyService.UpdatePolicyGroupPremiumEndor(Model).subscribe(res2=>{
        // Swal.fire({icon: 'success',title: 'Group Details Edited Successfully',showConfirmButton: false,})
        console.log(res2);
        const queryParams: any = {};
        const navigationExtras: NavigationExtras = {queryParams};
        queryParams.myArray =JSON.stringify(Object.assign({data:res2}));
        this._Router.navigate(['/CancleUpdate',this.PolicyId,this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),'Technical'],navigationExtras)
  
        this.isClicked= false
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title:error.error,text:''})
        this.isClicked= false
      })

    }
    ///////// Category Edit //////////
    else if(this.AppendType=='CategoryEdit'){
      // Swal.fire({title:'Category Edited Successfully',icon:'success',timer:4000,timerProgressBar:true})
      console.log(res);
      // Swal.fire({title:'New Group Members Added Successfullly',icon:'success',timer:4000,timerProgressBar:true})
      const queryParams: any = {};
      const navigationExtras: NavigationExtras = {queryParams};
      queryParams.myArray =JSON.stringify(res);
      await this._Router.navigate(['/EndorsmentPrem',this.PolicyId,
        this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),'CategoryEdit'],navigationExtras)
    }
    ////// Cancel From Beginning /////////////
    else if(this.AppendType=='CancelFromBeginning'){
      Swal.fire({title:'Policy Canceled Successfully',icon:'success',timer:4000,timerProgressBar:true})
    }
    //////////// Cancel /////////////
    else if(this.AppendType=='Cancel'){
      // await this._Router.navigate(['/CancleUpdate/'+this.PolicyId+'/'+res.endorsement.id])
      // Swal.fire({title:'Canceling Endorsment Successfully Done' ,icon:'success',timer:4000,timerProgressBar:true})
      let Model ={
        'endorsementGroups':res,
        'policyId':this.PolicyId,
        'type':'Cancel',
        'endorsementDate':this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),
        'policySource':null,
        'brokerId':null,
        'insuredName':null
      }
      this._PolicyService.UpdatePolicyGroupPremiumEndor(Model).subscribe(res2=>{
        console.log(res2);
        const queryParams: any = {};
        const navigationExtras: NavigationExtras = {queryParams};
        queryParams.myArray =JSON.stringify(Object.assign({data:res2,file:res}));
        this._Router.navigate(['/CancleUpdate',this.PolicyId,this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),'Cancel'],navigationExtras)
  
        this.isClicked= false
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title:error.error,text:''})
        this.isClicked= false
      })
      
    }
    /////////////// Pump /////////////
    else if(this.AppendType=='Pump'){
      let Model ={
        'endorsementGroups':res,
        'policyId':this.PolicyId,
        'type':'Pump',
        'endorsementDate':this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),
        'policySource':null,
        'brokerId':null,
        'insuredName':null
      }
      this._PolicyService.UpdatePolicyGroupPremiumEndor(Model).subscribe(res3=>{
        console.log(res3);
        const queryParams: any = {};
        const navigationExtras: NavigationExtras = {queryParams};
        queryParams.myArray =JSON.stringify(Object.assign({data:res3}));
        this._Router.navigate(['/CancleUpdate',this.PolicyId,this._DatePipe.transform(this.EndorsmentDateVAl,'yyyy-MM-dd'),'Pump'],navigationExtras)
  
        this.isClicked= false
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title:error.error,text:''})
        this.isClicked= false
      })
    }
    this.getPolicyDetails() 
    console.log(res);
  },error=>{
    Swal.fire({title:error.error,icon:'error',timer:4000,timerProgressBar:true})
    this.isClicked = false
    console.log(error);
  })
  this.formData =new  FormData()
}



getRemoveDate(e:any, deleButton:any){
  deleButton as HTMLButtonElement
  console.log(deleButton);
  

  if (moment(e.target.value).isValid()){
    console.log("valid");
    // deleButton.disabled = false
  }else{
    console.log("not");
    this._ToastrService.info('Please Enter Correct Date Format')
    // deleButton.disabled = true
    this.ErrorCurrentDateFormat = e.target.value
  }

}
// Policy Details
getPolicyDetails(){
  this.loading = true
  this._PolicyService.getThePolicyById(this.PolicyId).subscribe((data:any)=>{
    this.loading = false
    this.PolicyDetails = data;
    this.PolicyGroup =data.group
    this.PolicyPlans =data.plans
    this.PumpArr = data
    this.netPremiumVal = data.netPremium
    console.log(data);
  },error=>{
    this.loading = false;
    console.log(error);
  })
}
   //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe(data=>{
      this.brokerCustomers= data
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
  CheckPolicySource(value:any){
    if(value!="Direct"){
      $('#bokerField').show(300)
      this.TechnicalForm.get('brokerId')?.setValidators([Validators.required])
      this.TechnicalForm.get('brokerId')?.updateValueAndValidity()
    }else{
      this.TechnicalForm.get('brokerId')?.clearValidators()
      this.TechnicalForm.get('brokerId')?.updateValueAndValidity()
      
      this.TechnicalForm.get('brokerId')?.setValue('')
      $('#bokerField').hide(300)
    }
    console.log(value);
  }
  getCategoryEdit(PlanId:any,GroupId:any){
    
    let Exist = this.CategoryEdit.find(item=>item.customerId ==GroupId)
    console.log(Exist);

    if(Exist==undefined){
      let Model={
        planId:PlanId,
        customerId:GroupId
      }
      this.CategoryEdit.push(Model)
    }else{
      let index = this.CategoryEdit.indexOf(Exist);
      this.CategoryEdit.splice(index , 1)
      let Model={
        planId:PlanId,
        customerId:GroupId
      }
      this.CategoryEdit.push(Model)
    }
    console.log(this.CategoryEdit);

  }
  reCalculateNetPremium(){
    this._AppendixService.reCalculateNetPremium(this.PolicyId,this.netPremiumVal).subscribe((data:any)=>{
      console.log(data);
      this.PumpArr=data
      this.netPremiumVal = data.netPremium
    })
  }
  MemberAllClaims:any
  // Get Claims of group Member
  getAllClaims(claims:any){
    console.log(claims);
    this.MemberAllClaims = claims
  }
  // getHasClaims
  EnableDelBtn(DeleButton:any){
    DeleButton.disabled=false
  }
  /////=> Delete item <=//
  Deleteitem(index:any, Id:any , DateVal:any, hasClaims:any){
    // console.log(hasClaims.value);
    var hasClaimss
    if(hasClaims.value!=''){
      hasClaimss = JSON.parse(hasClaims.value)
    }else{
      hasClaimss = true
    }
    this.EditableGroup.splice(index,1)
    this.GroupToRemove.push(Id)
    console.log(this.GroupToRemove);
    let Modal={
      date:DateVal.value,
      id:Id,
      hasClaims:hasClaimss
    }
    this.testModal.push(Modal)
    console.log(this.testModal);
}
ngOnInit(): void {
  this._SharedService.changeData(true,'','',false,false);

  this.getPolicyDetails()
  this.getBrokerCustomers()
}
}