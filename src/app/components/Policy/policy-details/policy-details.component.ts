import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AppendixService } from 'src/app/services/appendix.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any
@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.scss'],
  providers: [DatePipe]
})
export class PolicyDetailssComponent {
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[20,8,10,15,5];
  term:any

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
  EndorsmentDateVAl:any =new Date()

  constructor(private _SharedService:SharedService, private _ToastrService:ToastrService,private _DatePipe:DatePipe, private _AdminService:AdminService,private _PolicyService:PolicyService,private _Router:Router,private _ActivatedRoute:ActivatedRoute ,private _AppendixService:AppendixService){
      this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
      // console.log(this.CurrentDate);
      
  }
  TechnicalForm:FormGroup= new FormGroup({
    insured:new FormControl('',[Validators.required,Validators.minLength(2)]),
    brokerId:new FormControl('',[Validators.required]),
    policySource:new FormControl('',[Validators.required])
  })

    // Appendex Value
  getAppendexVal(Value:any){
    this.AppendType = Value
    if(Value=='Add'){                 // Add
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#CancelFromBeginning').hide(600)
      $('#Cancel').hide(600)


      $('#AddAppendix').show(600)
    }else if(Value=='Remove'){        // Remove
      $('#CancelFromBeginning').hide(600)
      $('#AddAppendix').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)

      $('#Delete').show(600)
      
    }else if(Value=='Technical'){     // Technical
      $('#CancelFromBeginning').hide(600)
      $('#Delete').hide(600)
      $('#AddAppendix').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)


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

      $('#CategoryEdit').show(600)
    }else if(Value=='CancelFromBeginning'){// CancelFromBeginning
      $('#AddAppendix').hide(600)
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)
      $('#Cancel').hide(600)

      $('#CancelFromBeginning').show(600)
    }else if(Value=='Cancel'){        // Cancel
      $('#CancelFromBeginning').hide(600)
      $('#AddAppendix').hide(600)
      $('#Delete').hide(600)
      $('#Technical').hide(600)
      $('#CategoryEdit').hide(600)

      $('#Cancel').show(600)
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
      // console.log(data);
    },error=>{
      this.loading = false;
      console.log(error);
    })
  }
        // WhenModal opened
  // WhenOpenModal(){
  //   this.GroupToRemove = [];
  //   this.EditableGroup = Array.from(this.PolicyGroup);
  //   this.CategoryEditGroup = Array.from(this.PolicyGroup);
  // }
  uploadGroupFile(event: any){
    this.selectedGroupFile = event.target.files[0] ?? null;
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
    }
    for (var pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    this._AppendixService.AddPolicyAppendix(this.formData).subscribe( async (res:any)=>{
      this.isClicked = false
      if(this.AppendType=='Add'){
        Swal.fire({title:'New Group Members Added Successfullly',icon:'success',timer:4000,timerProgressBar:true})
        await $("#appendexModal").modal("toggle")
        await this._Router.navigate(['/groupNetPremium/'+this.PolicyId])
      }else if(this.AppendType=='Remove'){
         Swal.fire({title:'Items Removed Successfully',icon:'success',timer:4000,timerProgressBar:true})
        await $("#appendexModal").modal("toggle")
        await this._Router.navigate(['/PolicyCalculations/'+this.PolicyId])
      }else if(this.AppendType=='Technical'){
        Swal.fire({title:'Policy Edited Successfully',icon:'success',timer:4000,timerProgressBar:true})
        await $("#appendexModal").modal("toggle")
        await this.getPolicyDetails()
      }else if(this.AppendType=='CategoryEdit'){
        Swal.fire({title:'Category Edited Successfully',icon:'success',timer:4000,timerProgressBar:true})
        await $("#appendexModal").modal("toggle")
        await this._Router.navigate(['/groupNetPremium/'+this.PolicyId])
      }else if(this.AppendType=='CancelFromBeginning'){
        Swal.fire({title:'Policy Canceled Successfully',icon:'success',timer:4000,timerProgressBar:true})
        await $("#appendexModal").modal("toggle")
        await this._Router.navigate(['/AllPolices'])
      }else if(this.AppendType=='Cancel'){
        Swal.fire({title:'Canceling Endorsment Successfully Done' ,icon:'success',timer:4000,timerProgressBar:true})
        await $("#appendexModal").modal("toggle")
        await this._Router.navigate(['/CancleUpdate/'+this.PolicyId])
      }
      this.getPolicyDetails() 
      console.log(res);
    },error=>{
      Swal.fire({title:error.error,icon:'error',timer:4000,timerProgressBar:true})
      this.isClicked = false
      console.log(error);
    })
    this.formData =new FormData()
  }


  /////=> Delete item <=//
  Deleteitem(index:any, Id:any , DateVal:any){

    this.EditableGroup.splice(index,1)
    this.GroupToRemove.push(Id)
    console.log(this.GroupToRemove);
    let Modal={
      date:DateVal.value,
      id:Id
    }
    this.testModal.push(Modal)
    console.log(this.testModal);
}

getRemoveDate(e:any, deleButton:any){
  deleButton as HTMLButtonElement
  console.log(deleButton);
  

  if (moment(e.target.value).isValid()){
    console.log("valid");
    deleButton.disabled = false
  }else{
    console.log("not");
    this._ToastrService.info('Please Enter Correct Date Format')
    deleButton.disabled = true
    // this.ErrorCurrentDateFormat = e.target.value
  }

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

//Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getPolicyDetails();  
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getPolicyDetails();
  }

     //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe(data=>{
      this.brokerCustomers= data
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
  AllRisks:any
  GetAllRisks(){
    this._AdminService.GetAllRisks().subscribe((data:any)=>{
      this.AllRisks = data;
      // console.log(data);
    },error=>{
      console.log(error)
    })
  }
  getRiskNameById(id: string): string {
    const risk = this.AllRisks.find((risk: { id: string; }) => risk.id === id);
    // console.log(risk);
    
    return risk ? risk.englishName : 'Unknown Risk';
  }
 
  AllSettlements:any
  // getSettlementsInfo(info:any){
  //   this.AllSettlements = info
  // }
  AddNewAccType(info:any){
    this.AllSettlements = info
    $(".overlay").fadeIn(300)
    $(".delet").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlay").fadeOut(300)
    $(".delet").animate({right: '-30%'});
  }
  AllRisk:any[]=[]
  // getRiskInfo(Risk:any){
  //   // console.log(Risk);
  //   this.AllRisk = Risk
  // }
  AddNewRisk(Risk:any){
    this.AllRisk = Risk
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
  }
  closeAddNewRisk(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);

    this.getPolicyDetails()
    this.GetAllRisks()
    this.getBrokerCustomers()
  }

}
