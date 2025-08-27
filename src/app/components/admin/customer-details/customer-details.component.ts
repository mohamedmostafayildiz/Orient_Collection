import { DatePipe, DOCUMENT, Location } from '@angular/common';
import { Component, OnInit ,Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { FilesService } from 'src/app/services/files.service';
import Swal from 'sweetalert2';
import { PolicyService } from 'src/app/services/policy.service';
declare var $:any;
import { ListsService } from 'src/app/services/lists.service';
import { SharedService } from 'src/app/services/shared.service';
import { ClaimsService } from 'src/app/services/claims.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  providers :[DatePipe]
})
export class CustomerDetailsComponent implements OnInit{

  CustomerTypeValue:any
  BusinessTypeValue:any ='0'
  insuranceClassValue:any;
  commissionTypeValue:any;
  paymentWayValue:any='0'
  arr:any[]=[]
  CustomerId:any
  CustomerDetails:any
  BusinessTypes:any
  InsuranceClasses:any
  CommisionTypes:any;
  paymentWays:any
  genderValue:any
  pctCommission:any;
  addCommissionErrorMsg:any;
  addEarlyErrrorMsg:any
  listOfCorporare:any[]=[]
  pct:number=0
  amount:number=0
  customerIdEdited:any;
  loading:boolean=false
  validCommistionSelects:boolean=false;
  isClickedGetFile:boolean=false
  groupValue:any
  selectedFile1:any
  selectedFile2:any
  selectedFile3:any
  selectedFile4:any
  startDate:any
  endDate:any
  customerTypes:any;
  TaxExpirDate:any
  inValidStartDate:boolean = false
  inValidEndDate:boolean = false
  inValidTaxExpireDate:boolean = false
  contryValue:any= '65'
  isValid:boolean=false
  CurrencyValue:any
  bankCountryValue:any = '65'
  contactPersonName:any="";
  CustomerTypeId:any;
  customersTypes:any;
  NickName:any = 'Nick Name'

  constructor(private _ClaimsService:ClaimsService, private _Router:Router, private _SharedService:SharedService, private _PolicyService:PolicyService , private _FilesService:FilesService,private _DatePipe:DatePipe ,private _ActivatedRoute:ActivatedRoute ,
    private _AdminService:AdminService, public _Location:Location,private _ToastrService:ToastrService,private _ListsService:ListsService){
    this._ActivatedRoute.snapshot.paramMap.get('id');
    this.CustomerId= this._ActivatedRoute.snapshot.paramMap.get('id');
    this.CustomerTypeId=this._ActivatedRoute.snapshot.paramMap.get('id');
    console.log(this.CustomerTypeId);
    if(this.CustomerTypeId=='0'){
      this.customersTypes='Individual'
    }else if(this.CustomerTypeId=='1'){
      this.customersTypes='Corporate'
    }else if(this.CustomerTypeId=='2'){
      this.customersTypes='TPA'
    }else if(this.CustomerTypeId=='3'){
      this.customersTypes='Broker'
    }else if(this.CustomerTypeId=='4'){
      this.customersTypes='ReInsurer'
    }
  }

  Form:FormGroup = new FormGroup({
    'from':new FormControl(''),
    'to':new FormControl(''),
    'pre':new FormControl(''),
    'amount':new FormControl(''),
    'includeHolidays':new FormControl(false)
  })
  comisionForm = new FormGroup({
    'per':new FormControl(''),
  })
  check1(e:any){
    this.pct=e.target.value;
  }
  check2(e:any){
    this.amount=e.target.value
  }

  closeButton(){
    document.getElementById("close")?.click()
    document.getElementById("closeStageAge")?.click()
    document.getElementById("closeAddPlan")?.click()

  }
  submitCommissionToCustomerForm(){
    let Model =Object.assign(
      {pct:Number(this.pct/100)},
      {amount:Number(this.amount)},
      {businessType:this.BusinessTypeValue},
      {insuranceClass:this.insuranceClassValue},
      {commissionType:this.commissionTypeValue},
      {paymentWay:this.paymentWayValue},
      {customerId:this.CustomerDetails.id}
      )
      console.log(Model);
      
    this._AdminService.addCommissionToCustomer(Model).subscribe(data=>{
      console.log(data);
      
      document.getElementById("close")?.click()
      Swal.fire(
        'Good job!',
        'Commission Added Successfully',
        'success'
      )
      this._ToastrService.success("Commission Added Successfully","Well Done" )
    },error=>{
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
        
      })
      console.log(error);
      this.addCommissionErrorMsg=error.error;
      this._ToastrService.error(this.addCommissionErrorMsg , 'Error Occurred');
    })
    
  }
  SubmitAddEarly(){
    let Model ={
      customerId:this.CustomerDetails.id,
      businessType:this.BusinessTypeValue,
      insuranceClass:this.insuranceClassValue,
      earlyCollectorData:this.arr
    }
    console.log(Model);
    this._AdminService.addEarlyCollect(Model).subscribe(data=>{
      document.getElementById("closeEarly")?.click()
      Swal.fire(
        'Good job!',
        'Early & Collect Added Successfully',
        'success'
      )
      this._ToastrService.success( "Early Collect Added Successfully","Well Done" )
      console.log(data);
      
    },error=>{
      console.log(error.error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
        
      })
      this.addEarlyErrrorMsg=error.error;
      this._ToastrService.error(this.addEarlyErrrorMsg , 'Error Occurred');
    })
    
  }
        // Commistion selects Form Validations
  CommissionSelectValidation(){
    if(this.insuranceClassValue!=null && this.commissionTypeValue!=null){
      this.validCommistionSelects=true;
    }
  }

  getCustomerById(){
    this.loading=true
    this._AdminService.getCustomerById(this.CustomerId).subscribe(data=>{
      console.log(data);
      
      this.loading=false
      this.CustomerDetails =data
      console.log(data);

      if(this.CustomerDetails?.customerType=='Individual'){
        $("#gender").show(300)
        this.NickName = 'Nick Name'
      }else{
        this.NickName = 'Commercial Name'
      }
      this.getCustomerInfo(this.CustomerDetails)
    },error=>{
    this.loading=true
    })
  }

  getCommissionTypeValue(e:any){
    console.log(e.value);
    if(e.value==0){
      $("#wayOfPayment").hide(300)
      this.paymentWayValue= '0'
    }else if(e.value=1){
      $("#wayOfPayment").show(300)
    }
  }
   // Add And view Item From Lose Participation List
   view(){
    let Model={
      from:this.Form.get('from')!.value,
      to:this.Form.get('to')!.value,
      pre:this.Form.get('pre')!.value,
      amount:this.Form.get('amount')!.value,
      includeHolidays:this.Form.get('includeHolidays')!.value,
    }
    this.arr.push(Model);
    this.Form.get('from')!.setValue('')
    this.Form.get('to')!.setValue('')
    this.Form.get('pre')!.setValue('')
    this.Form.get('amount')!.setValue('')
    this.Form.get('includeHolidays')!.setValue(false)
    console.log(this.arr);
  }
   //Remove item From Loss Participations List
   remove(index:number){
    this.arr.splice(index, 1)
  }
    //get Business Types
  getBusinessTypes(){
    this._AdminService.getBusinessTypes().subscribe(data=>{
      this.BusinessTypes=data;
    })
  }
    //get Insurance Types
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe(data=>{
      this.InsuranceClasses=data;
    })
  }
    //get Commission Types
  getCommissionTypes(){
    this._AdminService.getCommissionTypes().subscribe(data=>{
      this.CommisionTypes=data;
    })
  }
    //getPayment Ways
    getPaymentWays(){
    this._AdminService.getPaymentWays().subscribe(data=>{
      this.paymentWays=data;
    })
  }

  coverageCondition(e:any){
    if(e.value==1){
      console.log("1");
      $("#coverageRadio").show(400)
      $("#coverageRadio2").show(400)
      $("#coverageRadio3").show(400)
    }else{
      $("#coverageRadio").hide(400)
      $("#coverageRadio2").hide(400)
      $("#coverageRadio3").hide(400)
    }
  }
    ///////////////////////  Plan Modal  /////////////////////
  typeOfServiceValue:any;
  GeographicalScopeVAlue:any
  palnForm:FormGroup=new FormGroup({
    'planName':new FormControl('',[Validators.required]),
    'annualMaxLimit':new FormControl('',[Validators.required]),
    'accommodationClass':new FormControl('',[Validators.required]),
  })
  submitPlan(){
    let Model =Object.assign(this.palnForm.value,
      {typeOfService:this.typeOfServiceValue},
      {geographicalScope:this.GeographicalScopeVAlue},
      {customerId:this.CustomerId})
      console.log(Model);
    this._AdminService.AddNewPlan(Model).subscribe((data:any)=>{
      console.log(data);
      this.ageForm.reset();
      this.closeButton();
      Swal.fire(
        'Good job!',
        'Plan '+ data.planName +" Added Successfully",
        'success'
      )
      
    },error=>{
      console.log(error);
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
    })
      
  }
    ///////////////////////  Age Stages Modal   /////////////////////
    agesOfTpa:any
    ageForm:FormGroup=new FormGroup({
      'from':new FormControl('',[Validators.required]),
      'to':new FormControl('',[Validators.required])
    })
    submitAddAgeToCustomer(){
      let Model= Object.assign(this.ageForm.value,{customerId:Number(this.CustomerId)});
      console.log(Model);
      
      this._AdminService.addAgeToTpaCustomer(Model).subscribe(data=>{
        console.log(data);
        this.getAgesOfTpa();
        Swal.fire(
          'Good job!',
          'Age Added To Customer Successfully',
          'success'
        )
        this.ageForm.reset();
        this.closeButton();
      },error=>{
        console.log(error);
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error,
        })
      })
      
    }
  getAgesOfTpa(){
    this._AdminService.GetAgesOfTpa(this.CustomerId).subscribe(data=>{
      this.agesOfTpa=data;
    })
  }
  goBack(){
    this._Location.back()
  }

  // imageToShow: any;
  imageToShow:any
createImageFromBlob(image: Blob) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
     this.imageToShow = reader.result;
  }, false);

  if (image) {
     reader.readAsDataURL(image);
  }
}
  loadFile1:boolean = false
  FileName:any
  isEditable:boolean= false; // Controls edit mode
  isEditableContactInfo:boolean= false;
  isEditableaccountInfo:boolean= false;
  isEditableStatus:boolean= false;

  showButtons(action:string){
    if(action=='Personalinfo'){
      this.isEditable = !this.isEditable;
      this.isEditableContactInfo=false
      this.isEditableaccountInfo=false
      this.isEditableStatus=false
      console.log("ok");
      $('#personalinfp').show(500)
      $('#contactinfo').hide(500)
      $('#accountinfo').hide(500)
      $('#statusinfo').hide(500)
    }else if(action=='ContactInfo'){
      this.isEditableContactInfo = !this.isEditableContactInfo;
      this.isEditable=false
      this.isEditableaccountInfo=false
      this.isEditableStatus=false
      console.log("22");
      $('#personalinfp').hide(500)
      $('#contactinfo').show(500)
      $('#accountinfo').hide(500)
      $('#statusinfo').hide(500)
    }else if(action=='AccountInfo'){
      this.isEditableaccountInfo = !this.isEditableaccountInfo
      this.isEditable=false
      this.isEditableContactInfo=false
      this.isEditableStatus=false
      console.log("33");
      $('#personalinfp').hide(500)
      $('#contactinfo').hide(500)
      $('#accountinfo').show(500)
      $('#statusinfo').hide(500)
    }else if(action=='Status'){
      this.isEditableStatus = !this.isEditableStatus
      this.isEditable=false
      this.isEditableContactInfo=false
      this.isEditableaccountInfo=false
      console.log("statyus");
      $('#personalinfp').hide(500)
      $('#contactinfo').hide(500)
      $('#accountinfo').hide(500)
      $('#statusinfo').show(500)
      
    }
  }
  getCustomerFile(type:any){
    this.isClickedGetFile=true
    this.loading=true
    this._FilesService.getCustomerFile(this.CustomerId ,type).subscribe(res=>{
      this.loading=false
      this.isClickedGetFile=false
      this.FileName= res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let a= document.createElement('a');
      a.setAttribute('href',String(res.url))
      a.click()
    },error=>{
      this.loading=false
      this.isClickedGetFile=false
      console.log(error);
    })
  }

    // Selected File 
    selectedFile:any
    FileExtextion:String=''
    ValidExtention:boolean=false
    isClickedDocumnet:boolean=false
    base64:any
    uploadFile(event: any){
      // Get File Object
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile);
  
    var myString = this.selectedFile.name
    this.FileExtextion=myString.substring(myString.lastIndexOf(".")+1)
    if(this.selectedFile.size==3000000 || this.FileExtextion.toLocaleLowerCase()=='pdf'||this.FileExtextion.toLocaleLowerCase()=='jpeg'||this.FileExtextion.toLocaleLowerCase()=='png'||this.FileExtextion.toLocaleLowerCase()=='webp'){
      this.ValidExtention = true
    }else{
      this.ValidExtention = false
      this._ToastrService.info("","Please Inroll Only Pdf Or Image")
    }
  
      // Base 64
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>{
      this.base64 = reader.result;
    }

  
  }
  formData:any = new FormData()
    // Save Documnet
    // Save Documnet
    SaveDocument(){
      this.isClickedDocumnet=true
        var formData = new FormData()
        formData.append('customerId',this.CustomerId);
        formData.append('regFile',this.selectedFile1);
        formData.append('taxesFile',this.selectedFile2);
        formData.append('yourAgentFile',this.selectedFile3);
        for (var pair of this.formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }
        this._AdminService.AddFileToCustomerDetails(formData).subscribe(res => {
          this.selectedFile1 = ''
          this.selectedFile2 = ''
          this.selectedFile3 = ''
          $("#addDoument").modal("toggle")
          this.isClickedDocumnet=false
        Swal.fire({title:'Files Uploaded Successfully',timer:2000,timerProgressBar:true,icon:'success'});
        this._ToastrService.success("File Uploaded Successfully", "Good");
        console.log(res);
        }, error => {
          this.isClickedDocumnet=false
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error,
          });
      });
    }

uploadFile1(event: any){
  this.selectedFile1 = event.target.files[0] ?? null;
  console.log(this.selectedFile1);
  event.target.value='' 
}
uploadFile2(event: any){
  this.selectedFile2 = event.target.files[0] ?? null;
  console.log(this.selectedFile2);

  event.target.value='' 
}
uploadFile3(event: any){
  this.selectedFile3 = event.target.files[0] ?? null;
  console.log(this.selectedFile3);

  event.target.value='' 
}
uploadFile4(event: any){
  this.selectedFile4 = event.target.files[0] ?? null;
  console.log(this.selectedFile4);

  event.target.value='' 
}
  fileType:any
getFileType(fileType:any){
  this.fileType =fileType
}
//////////////// New //////////////
Forms=new FormGroup({
  'name':new FormControl('',[Validators.required, Validators.minLength(3)]),
  'nickName':new FormControl(''),
  'arabicName':new FormControl('',[Validators.required]),
  'regNo':new FormControl(''),
  'taxNo':new FormControl(''),
  'phoneNumber':new FormControl(''),
  'phoneNumber2':new FormControl(''),
  'gender':new FormControl(''),
  'mobile':new FormControl('',[Validators.required]),
  'mobile2':new FormControl(''),
  'email':new FormControl('',[Validators.required ,Validators.email]),
  'website':new FormControl(''),
  'address':new FormControl('',[Validators.required]),
  'notes':new FormControl(''),
  'emailNotification':new FormControl(false),
  'smsNotification':new FormControl(false),
  'bankName':new FormControl(''),
  'accountNO':new FormControl(''),
  'iban':new FormControl(''),
  'swiftCode':new FormControl(''),
  'TPAType':new FormControl(''),
  'onHold':new FormControl(false),
  'onHoldDate':new FormControl(''),
  'block':new FormControl(false),
  'blockDate':new FormControl(''),
  'governorateName':new FormControl('',[Validators.required]),
  'authorityCode':new FormControl(''),
  'authorityStart':new FormControl(''),
  'authorityEnd':new FormControl(''),
  'defaultCommission':new FormControl(false),
  'expiredTaxDate':new FormControl(''),
  'job':new FormControl(''),
  'birthday':new FormControl('',[Validators.required]),
  'onHoldDangerLevel':new FormControl(''),
  'onHoldReason':new FormControl(''),
  'blockDangerLevel':new FormControl(''),
  'blockReason':new FormControl(''),
  // 'group':new FormControl(''),
  'customerType':new FormControl(''),
  'currency':new FormControl(''),
})

getCustomerInfo(customer:any){
  var object = this.additionalTypes.find(item=>item.value == customer.tpaType)
  console.log(object);
  console.log("ok");
  // let exit = this.listOfCorporare.find(item=>item.id==customer.group)
  // console.log(exit);
  

  
  this.getCustomerTypeValue(customer?.customerType)
  this.Forms.get('name')?.setValue(customer?.name)
  this.Forms.get('nickName')?.setValue(customer?.nickName)
  this.Forms.get('arabicName')?.setValue(customer?.arabicName)
  this.Forms.get('regNo')?.setValue(customer?.regNo)
  this.Forms.get('taxNo')?.setValue(customer?.taxNo)
  this.Forms.get('job')?.setValue(customer?.job)
  this.Forms.get('authorityCode')?.setValue(customer?.authorityCode)
  this.Forms.get('authorityStart')?.setValue(customer?.authorityStart)
  this.Forms.get('authorityEnd')?.setValue(customer?.authorityEnd)
  this.Forms.get('phoneNumber')?.setValue(customer?.phoneNumber)
  this.Forms.get('phoneNumber2')?.setValue(customer?.phoneNumber2)
  this.Forms.get('mobile')?.setValue(customer?.mobile)
  this.Forms.get('mobile2')?.setValue(customer?.mobile2)
  this.Forms.get('email')?.setValue(customer?.email)
  this.Forms.get('website')?.setValue(customer?.website)
  this.Forms.get('address')?.setValue(customer?.address)
  this.Forms.get('notes')?.setValue(customer?.notes)
  this.Forms.get('governorateName')?.setValue(customer?.governorateName)
  this.Forms.get('expiredTaxDate')?.setValue(customer?.expiredTaxDate)
  this.Forms.get('emailNotification')?.setValue(customer?.emailNotification)
  this.Forms.get('smsNotification')?.setValue(customer?.smsNotification)
  this.Forms.get('bankName')?.setValue(customer?.bankName)
  this.Forms.get('accountNO')?.setValue(customer?.accountNO)
  this.Forms.get('iban')?.setValue(customer?.iban)
  this.Forms.get('onHold')?.setValue(customer?.onHold)
  this.Forms.get('swiftCode')?.setValue(customer?.swiftCode)
  this.Forms.get('onHoldDate')?.setValue(this._DatePipe.transform(customer?.onHoldDate,'YYYY-MM-dd'))
  this.Forms.get('onHoldReason')?.setValue(customer?.onHoldReason)
  this.Forms.get('blockDangerLevel')?.setValue(customer?.blockDangerLevel)
  this.Forms.get('onHoldDangerLevel')?.setValue(customer?.onHoldDangerLevel)
  this.Forms.get('block')?.setValue(customer?.block)
  this.Forms.get('blockDate')?.setValue(this._DatePipe.transform(customer?.blockDate,'YYYY-MM-dd'));
  this.Forms.get('blockReason')?.setValue(customer?.blockReason)
  this.Forms.get('birthday')?.setValue(customer?.birthday);
  this.Forms.get('gender')?.setValue(customer?.gender);
  // this.Forms.get('group')?.setValue(customer?.group);
  this.Forms.get('customerType')?.setValue(customer?.customerType);
  this.Forms.get('TPAType')?.setValue(object?.id);
  this.Forms.get('currency')?.setValue(customer?.currency);
  this.genderValue= customer.gender;
  this.customerIdEdited=customer.id
  this.groupValue=customer?.group
  console.log("groupValue"+Number(this.groupValue));
  
  $("#LocalCountryInput").hide(0)
  $("#ForginCountryInput").hide(0)
  if(customer.country=='EG'){
    $("#LocalCountryInput").show(300)
  }else{
    $("#ForginCountryInput").show(300)
  }
  if(customer.block==true){
    $("#onhold").show(300)
  }
  if(customer.onHold==true){
    $("#block").show(300)
  }
  
  console.log(customer);
}
getListOfCorporate(){
  this._AdminService.GetListOfCorporate().subscribe((data:any)=>{
    console.log(data);
    this.listOfCorporare =data
  })
}
selectGroup(e:any){
  console.log(e);
  let exit = this.listOfCorporare.find(item=>item.id==e)
  console.log(exit);
  this.groupValue=exit.group
}
// Check Start date 
checkStartDate(){
  this.startDate =this.Form.get('authorityStart')?.value
  let currentDate =new Date()
  if(currentDate>=this.startDate){
    this.inValidStartDate=false
  }else{
    this.inValidStartDate=true
    this._ToastrService.info('Please Enter Correct Autherity Start Date')
  }     
}
      // Check End date 
checkEndDate(){
  this.endDate =this.Form.get('authorityEnd')?.value
  let currentDate =new Date()
  if(currentDate>this.endDate){
    this.inValidEndDate=true
    this._ToastrService.info('Please Enter Correct Autherity End Date')
  }else{
    this.inValidEndDate=false
  }     
}
      // Check Tax Expiry date 
checkTaxDate(){
  this.TaxExpirDate =this.Form.get('ExpiredTaxDate')?.value
  let currentDate =new Date()
  if(currentDate>this.TaxExpirDate){
    this.inValidTaxExpireDate=true
    this._ToastrService.info('Please Enter Correct Expired Tax Date')
  }else{
    this.inValidTaxExpireDate=false
  }     
}
getCustomerTypes(){
  this._AdminService.getCustomerTypes().subscribe(data=>{
    this.customerTypes=data  
  })
}
getBankCountryValue(e:any){
  this.bankCountryValue=e.value
}
getCurrencyValue(e:any){
  this.CurrencyValue=e.value
  console.log(this.CurrencyValue);
  
}
     // Get All
     AllItems:any
     getAllGovernorates(){
      this._PolicyService.getAllGovernorates().subscribe(data=>{
        this.AllItems =data;
      },error=>{
        console.log(error);
      })
    }
getValidInputs(){
  if(this.CustomerTypeValue!=null&&this.genderValue!=null&&this.contryValue!=null&&this.bankCountryValue!=null&&this.CurrencyValue!=null){
    this.isValid= true;
  }
}
getCountryValue(e:any){
  this.contryValue=e.value
  console.log(this.contryValue);
  if(this.contryValue!='65'){
    $("#ForginCountryInput").show(400)
    $("#LocalCountryInput").hide(400)
    this.Form.get("governorateName")?.setValue('')
  }else{
    $("#ForginCountryInput").hide(400)
    $("#LocalCountryInput").show(400)
    this.Form.get("governorateName")?.setValue('')
  }
  
}
Contries:any
getCountries(){
  this._AdminService.getCountries().subscribe(data=>{
    this.Contries =data
  })
}
Currency:any

getCurrency(){
  this._AdminService.getCurrency().subscribe(data=>{
    this.Currency=data  
  })
}
        // Check birth date 
      birthdayDate:any;
      inValidBirthDate:boolean =false;

      checkBirthDate(){
          this.birthdayDate =this.Form.get('birthday')?.value
          let currentDate =new Date()
          if(currentDate>this.birthdayDate){
            this.inValidBirthDate=false
          }else{
            this.inValidBirthDate=true
            this._ToastrService.info('Please Enter Correct Birth Date')
          }     
      }
AllCustomers:any[]=[]
getAllCustomer(){
  this.loading=true;
  this._AdminService.getAllCustomers(this.CustomerTypeId).subscribe((data:any)=>{
    console.log(data);
    this.AllCustomers =data;
    this.loading=false;
  },error=>{
   this.loading=true;
    
  })
}
//Submit Edit Customer\
model:object={}

optionItems:any=''
isClicked:boolean=false;
contactPersonMobile:any="";

SubmitCustomer(){
 this.isClicked = true;
 this.model =Object.assign(this.Forms.value,
   {gender:this.genderValue},
   {id:this.customerIdEdited},
   {contactPerson:String(this.contactPersonName).concat(' Mobile: ', String(this.contactPersonMobile)) },
   {customerType:this.CustomerTypeValue},
   {country:this.contryValue},
   {group:this.groupValue==undefined?null:this.groupValue},
   {bankCountry:this.bankCountryValue},
   {blockDate:this._DatePipe.transform(this.Forms.get('blockDate')?.value,'YYYY-MM-dd')},
   {onHoldDate:this._DatePipe.transform(this.Forms.get('onHoldDate')?.value,'YYYY-MM-dd')},
   {currency:this.CurrencyValue})
   console.log(this.model);
   this._AdminService.EditCustomer(this.model).subscribe(res=>{
    $('#personalinfp').hide(500)
    $('#contactinfo').hide(500)
    $('#accountinfo').hide(500)
    $('#statusinfo').hide(500)
     this.isClicked = false;
      //  Swal.fire('Good job!','Customer Edited Successfully !','success')
       this._SharedService.setAlertMessage('Customer Edited Successfully !');
       window.scrollTo({ top: 0, behavior: 'smooth' });
      //  this.getAllCustomer()
      this._Router.navigate(['/AllCustomers']);

       document.getElementById('clodeEditModal')?.click()
       // error
   },(error:any)=>{
     console.log(error);
     this.isClicked = false;

     Swal.fire({
       icon: 'error',
       title: 'Oops...',
       text: error.error,
     })
   })
}
AllDangerLevels:any
getDangerLevels(){
  this._ListsService.getDangerLevels().subscribe(data=>{
    this.AllDangerLevels=data
  })
}
     // Show Dates with Animation
  onHoldToggle(){
      if(this.Forms.get('onHold')!.value==true){
      $("#onhold").show(500)
      this.Forms.get('onHoldDate')?.setValidators([Validators.required])
      this.Forms.get('onHoldReason')?.setValidators([Validators.required])
      this.Forms.get('onHoldDangerLevel')?.setValidators([Validators.required])
      this.Forms.get('onHoldDate')?.updateValueAndValidity()
      this.Forms.get('onHoldReason')?.updateValueAndValidity()
      this.Forms.get('onHoldDangerLevel')?.updateValueAndValidity()
      }else{
      $("#onhold").hide(500)
      this.Forms.get('onHoldDate')?.setValue('')
      this.Forms.get('onHoldReason')?.setValue('')
      this.Forms.get('onHoldDangerLevel')?.setValue('')
      this.Forms.get('onHoldDate')?.setErrors(null)
      this.Forms.get('onHoldReason')?.setErrors(null)
      this.Forms.get('onHoldDangerLevel')?.setErrors(null)
      }
      if(this.Forms.get('block')!.value==true){
      $("#block").show(500)
      this.Forms.get('blockDate')?.setValidators([Validators.required])
      this.Forms.get('blockReason')?.setValidators([Validators.required])
      this.Forms.get('blockDangerLevel')?.setValidators([Validators.required])
      this.Forms.get('blockDate')?.updateValueAndValidity()
      this.Forms.get('blockReason')?.updateValueAndValidity()
      this.Forms.get('blockDangerLevel')?.updateValueAndValidity()
      }else{
      $("#block").hide(500)
      this.Forms.get('blockDate')?.setValue('')
      this.Forms.get('blockReason')?.setValue('')
      this.Forms.get('blockDangerLevel')?.setValue('')
      this.Forms.get('blockDate')?.setErrors(null)
      this.Forms.get('blockReason')?.setErrors(null)
      this.Forms.get('blockDangerLevel')?.setErrors(null)
      }
  }
getCustomerTypeValue(e:any){
  
  this.CustomerTypeValue=e;
  if(this.CustomerTypeValue == 'Individual'){ // Individual
    this.showAdditionalSelect=false
    $('#job').show(300)
    $('#Newgroup').show(300)
    $('#idOrPassport').show(300)
    // this.idOrpassportStatus=true
    
    // this.LabelId='Id'
    // this.CustomMax='99999999999999'
    // this.CustomMin='10000000000000'
    this.Form.get('job')?.setValidators([Validators.required])
    this.Form.get('job')?.updateValueAndValidity()

    $('#start').hide(300)
    $('#end').hide(300)
    $('#code').hide(300)
    $('#taxNom').hide(300)
    $('#taxExpiryDate').hide(300)
    $('#defalutCommision').hide(300)
    this.Form.get('authorityCode')?.setValue('')
    this.Form.get('authorityStart')?.setValue('')
    this.Form.get('authorityEnd')?.setValue('')
    this.Form.get('expiredTaxDate')?.setValue('')
    this.Form.get('defaultCommission')?.setValue(false)
    this.Form.get('taxNo')?.setValue('0')

    this.Form.get('expiredTaxDate')?.clearValidators()
    this.Form.get('expiredTaxDate')?.updateValueAndValidity()
    this.Form.get('authorityCode')?.clearValidators()
    this.Form.get('authorityCode')?.updateValueAndValidity()
    this.Form.get('authorityStart')?.clearValidators();
    this.Form.get('authorityStart')?.updateValueAndValidity();
    this.Form.get('authorityEnd')?.clearValidators()
    this.Form.get('authorityEnd')?.updateValueAndValidity()


  }else if(this.CustomerTypeValue == 'Corporate'){ // Corporate
    this.showAdditionalSelect=false
    // this.LabelId='Reg No.'
    $('#Newgroup').show(300)
    $('#taxNom').show(300)
    $('#taxExpiryDate').show(300)
    // this.CustomMax=''
    // this.CustomMin=''
    this.Form.get('job')?.clearValidators()
    this.Form.get('job')?.updateValueAndValidity()
    $('#start').hide(300)
    $('#end').hide(300)
    $('#code').hide(300)
    $('#job').hide(300)
    $('#defalutCommision').hide(300)
    $('#idOrPassport').hide(300)
    // this.idOrpassportStatus=false

    this.Form.get('taxNo')?.setValue('')
    this.Form.get('authorityCode')?.setValue('')
    this.Form.get('authorityStart')?.setValue('')
    this.Form.get('authorityEnd')?.setValue('')
    
    this.Form.get('defaultCommission')?.setValue(false)
    this.Form.get('job')?.setValue('')
    this.Form.get('ExpiredTaxDate')?.setValidators([Validators.required])
    this.Form.get('ExpiredTaxDate')?.updateValueAndValidity()
    this.Form.get('authorityCode')?.clearValidators()
    this.Form.get('authorityCode')?.updateValueAndValidity()
    this.Form.get('authorityStart')?.clearValidators();
    this.Form.get('authorityStart')?.updateValueAndValidity();
    this.Form.get('authorityEnd')?.clearValidators()
    this.Form.get('authorityEnd')?.updateValueAndValidity()
  }else if(this.CustomerTypeValue == 'TPA' || this.CustomerTypeValue == 'CustomerTypeValue'){ // TPA
    if(this.CustomerTypeValue == 'TPA'){
      // this.SwitDOBOrIssueDate = 'Issue Date'
      this.showAdditionalSelect=true
    }else if(this.CustomerTypeValue == 'CustomerTypeValue'){
      // this.SwitDOBOrIssueDate = 'D.O.B'
      this.showAdditionalSelect=false
    }
    // this.LabelId='Reg No.'
    $('#taxNom').show(300)
    $('#taxExpiryDate').show(300)
    // this.CustomMax=''
    // this.CustomMin=''
    this.Form.get('job')?.clearValidators()
    this.Form.get('job')?.updateValueAndValidity()
    $('#start').hide(300)
    $('#end').hide(300)
    $('#code').hide(300)
    $('#job').hide(300)
    $('#defalutCommision').hide(300)
    $('#idOrPassport').hide(300)
    // this.idOrpassportStatus=false
    this.Form.get('taxNo')?.setValue('')
    this.Form.get('authorityCode')?.setValue('')
    this.Form.get('defaultCommission')?.setValue(false)
    this.Form.get('authorityStart')?.setValue('')
    this.Form.get('authorityEnd')?.setValue('')
    $('#Newgroup').hide(300)
    // this.groupValue=null
    this.Form.get('job')?.setValue('')
    this.Form.get('expiredTaxDate')?.setValidators([Validators.required])
    this.Form.get('expiredTaxDate')?.updateValueAndValidity()
    this.Form.get('authorityCode')?.clearValidators()
    this.Form.get('authorityCode')?.updateValueAndValidity()
    this.Form.get('authorityStart')?.clearValidators();
    this.Form.get('authorityStart')?.updateValueAndValidity();
    this.Form.get('authorityEnd')?.clearValidators()
    this.Form.get('authorityEnd')?.updateValueAndValidity()
  }
  else if(this.CustomerTypeValue == 'Broker'){ // Broker
    this.showAdditionalSelect=false
    // this.LabelId='Reg No.'
    $('#taxNom').show(300)
    $('#start').show(300)
    $('#end').show(300)
    $('#code').show(300)
    $('#taxExpiryDate').show(300)
    $('#defalutCommision').show(300)
    $('#idOrPassport').hide(300)
    // this.idOrpassportStatus=false
    // this.CustomMax=''
    // this.CustomMin=''
    $('#Newgroup').hide(300)
    $('#job').hide(300)

    // this.groupValue=null;
    
    this.Form.get('taxNo')?.setValue('')
    this.Form.get('job')?.setValue('')
    this.Form.get('job')?.clearValidators()
    this.Form.get('job')?.updateValueAndValidity()
    this.Form.get('ExpiredTaxDate')?.setValidators([Validators.required])
    this.Form.get('ExpiredTaxDate')?.updateValueAndValidity()
    this.Form.get('authorityCode')?.setValidators([Validators.required])
    this.Form.get('authorityCode')?.updateValueAndValidity()
    this.Form.get('authorityStart')?.setValidators([Validators.required]);
    this.Form.get('authorityStart')?.updateValueAndValidity();
    this.Form.get('authorityEnd')?.setValidators([Validators.required])
    this.Form.get('authorityEnd')?.updateValueAndValidity()
  }
  if(this.CustomerTypeValue == 'Individual'){
    $('#gender').show(300)
    this.Form.get('gender')?.setValue(null)
    this.NickName = 'Nick Name'
  }else{
    $('#gender').hide(300)
    this.Form.get('gender')?.setValue(0)
    this.NickName = 'Commercial Name'
  }

}

showAdditionalSelect:boolean = false
additionalTypes:any[]=[]
getTpaType(){
  this._ClaimsService.GetTpaTypes().subscribe((data:any)=>{
    console.log(data);
    console.log(data);
    this.additionalTypes=data
  })
}

  EditFiles(){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
  Cancel(){
    $('#personalinfp').hide(500)
    $('#contactinfo').hide(500)
    $('#accountinfo').hide(500)
    $('#statusinfo').hide(500)

    this.isEditable=false;
      this.isEditableContactInfo=false
      this.isEditableaccountInfo=false
      this.isEditableStatus=false
  }
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this._SharedService.changeData(true,'Add  new partner','addCustomer',false,false);
    this.getAllGovernorates();
    this.getCustomerTypes();
    this.getListOfCorporate();
    this.getCustomerById();
    this.getBusinessTypes();
    this.getInsuraneClass();
    this.getCommissionTypes();
    this.getPaymentWays();
    this.getAgesOfTpa();
    this.getCountries();
    this.getCurrency();
    this.getDangerLevels()
    this.getAllCustomer()
    this.getTpaType();
  }
}
