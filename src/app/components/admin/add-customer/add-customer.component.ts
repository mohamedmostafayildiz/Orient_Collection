import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { arabicTextValidator } from 'src/app/services/arabic-text.validator';
import { ListsService } from 'src/app/services/lists.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { ClaimsService } from 'src/app/services/claims.service';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  providers: [DatePipe]
})
export class AddCustomerComponent implements OnInit{
  showAdditionalSelect:boolean = false
  customerTypes:any;
  Contries:any
  Currency:any
  listOfCorporare:any
  groupValue:any=null
  contryValue:any= '65'
  bankCountryValue:any= '65'
  CurrencyValue:any= '44'
  isValid:boolean=false
  errorExist:boolean=false
  model:object={}
  errorMsg:any;
  LabelId:any = 'Id';
  CustomMax:any='99999999999999'
  CustomMin:any='10000000000000'
  contactPersonName:any="";
  contactPersonMobile:any="";
        // Validation Variables
  birthdayDate:any
  startDate:any
  endDate:any
  TaxExpirDate:any
  idOrpassportStatus:boolean =true;
  EgyptGovernments:any
  AllDangerLevels:any
  isClicked:boolean=false;
  isClickedDocumnet:boolean=false;
  ValidExtention:boolean=false
  CustomerId:any
  selectedFile1:any
  selectedFile2:any
  selectedFile3:any
  selectedFile4:any
  CustomeType:any
  SwitDOBOrIssueDate:any=''
  AllItems:any
  currentDate:any = new Date()
  NickName:any='Nick Name'


  constructor(private _ClaimsService:ClaimsService,private _PolicyService:PolicyService,
     datePipe: DatePipe,public _TranslateService:TranslateService,private _ListsService:ListsService,
     private _AdminService:AdminService ,private _ToastrService:ToastrService, private _Router:Router,
    private _SharedService:SharedService){
    _TranslateService.addLangs(['en', 'ar'])
    _TranslateService.setDefaultLang('en')
  }

  Form=new FormGroup({
    'name':new FormControl('',[Validators.required, Validators.minLength(3)]),
    'arabicName':new FormControl('',[Validators.required,arabicTextValidator()]),
    'nickName':new FormControl(''),
    'regNo':new FormControl('',[Validators.required]),
    'taxNo':new FormControl(''),
    'gender':new FormControl(0,[Validators.required]),
    'customerType':new FormControl('',[Validators.required]),
    'phoneNumber':new FormControl(''),
    'phoneNumber2':new FormControl(''),
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
    // 'onHold':new FormControl(false),
    // 'onHoldDate':new FormControl(''),
    // 'block':new FormControl(false),
    'blockDate':new FormControl(''),
    'birthday':new FormControl('',[Validators.required]),
    // 'onHoldReason':new FormControl(''),
    // 'blockReason':new FormControl(''),
    'governorateName':new FormControl('',[Validators.required]),
    'job':new FormControl(''),
    'authorityCode':new FormControl(''),
    'authorityStart':new FormControl(''),
    'authorityEnd':new FormControl(''),
    'expiredTaxDate':new FormControl(''),
    'defaultCommission':new FormControl(false),
    // 'onHoldDangerLevel':new FormControl(''),
    // 'blockDangerLevel':new FormControl(''),
  })

  // Selected File 
  selectedFile:any
  FileExtextion:String=''
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

getCustomerTypeValue(e:any){
  this.CustomeType = e.value
  if(e.value == 0){ // Individual
    this.showAdditionalSelect=false
    this.SwitDOBOrIssueDate = 'D.O.B'
    $('#job').show(300)
    $('#Newgroup').show(300)
    $('#idOrPassport').show(300)
    this.idOrpassportStatus=true
    
    this.LabelId='Id'
    this.CustomMax='99999999999999'
    this.CustomMin='10000000000000'
    this.Form.get('regNo')?.setValidators([Validators.required])
    this.Form.get('regNo')?.updateValueAndValidity()

    $('#start').hide(300)
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


  }else if(e.value == 1){ // Corporate
    this.showAdditionalSelect=false
    this.SwitDOBOrIssueDate = 'DateOfEstablishmnet'
    this.LabelId='Reg No.'
    $('#Newgroup').show(300)
    $('#taxNom').show(300)
    $('#taxExpiryDate').show(300)
    this.CustomMax=''
    this.CustomMin=''
    this.Form.get('job')?.clearValidators()
    this.Form.get('job')?.updateValueAndValidity()
    $('#start').hide(300)
    $('#end').hide(300)
    $('#code').hide(300)
    $('#job').hide(300)
    $('#defalutCommision').hide(300)
    $('#idOrPassport').hide(300)
    
    this.idOrpassportStatus=false

    this.Form.get('taxNo')?.setValue('')
    this.Form.get('authorityCode')?.setValue('')
    this.Form.get('authorityStart')?.setValue('')
    this.Form.get('authorityEnd')?.setValue('')

    this.Form.get('regNo')?.clearValidators()
    this.Form.get('regNo')?.updateValueAndValidity()
    
    this.Form.get('defaultCommission')?.setValue(false)
    this.Form.get('job')?.setValue('')
    this.Form.get('expiredTaxDate')?.setValidators([Validators.required])
    this.Form.get('expiredTaxDate')?.updateValueAndValidity()
    this.Form.get('authorityCode')?.clearValidators()
    this.Form.get('authorityCode')?.updateValueAndValidity()
    this.Form.get('authorityStart')?.clearValidators();
    this.Form.get('authorityStart')?.updateValueAndValidity();
    this.Form.get('authorityEnd')?.clearValidators()
    this.Form.get('authorityEnd')?.updateValueAndValidity()
  }else if(e.value == 2||e.value == 4){ // TPA or Reinusrer
    if(e.value == 2){
      this.SwitDOBOrIssueDate = 'Issue Date'
      this.showAdditionalSelect=true
    }else if(e.value == 4){
      this.SwitDOBOrIssueDate = 'D.O.B'
      this.showAdditionalSelect=false
    }
    this.LabelId='Reg No.'
    $('#taxNom').show(300)
    $('#taxExpiryDate').show(300)
    this.CustomMax=''
    this.CustomMin=''
    this.Form.get('job')?.clearValidators()
    this.Form.get('job')?.updateValueAndValidity()
    $('#start').hide(300)
    $('#end').hide(300)
    $('#code').hide(300)
    $('#job').hide(300)
    $('#defalutCommision').hide(300)
    $('#idOrPassport').hide(300)
    this.idOrpassportStatus=false
    this.Form.get('taxNo')?.setValue('')
    this.Form.get('authorityCode')?.setValue('')
    this.Form.get('defaultCommission')?.setValue(false)
    this.Form.get('authorityStart')?.setValue('')
    this.Form.get('authorityEnd')?.setValue('')
    $('#Newgroup').hide(300)
    this.groupValue=null
    
    this.Form.get('regNo')?.clearValidators()
    this.Form.get('regNo')?.updateValueAndValidity()

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
  else if(e.value == 3){ // Broker
    this.showAdditionalSelect=false
    this.SwitDOBOrIssueDate = 'D.O.B'
    this.LabelId='Reg No.'
    $('#taxNom').show(300)
    $('#start').show(300)
    $('#end').show(300)
    $('#code').show(300)
    $('#taxExpiryDate').show(300)
    $('#defalutCommision').show(300)
    $('#idOrPassport').hide(300)
    this.idOrpassportStatus=false
    this.CustomMax=''
    this.CustomMin=''
    $('#Newgroup').hide(300)
    $('#job').hide(300)

    this.groupValue=null;
        
    this.Form.get('regNo')?.clearValidators()
    this.Form.get('regNo')?.updateValueAndValidity()
    
    this.Form.get('taxNo')?.setValue('')
    this.Form.get('job')?.setValue('')
    this.Form.get('job')?.clearValidators()
    this.Form.get('job')?.updateValueAndValidity()
    this.Form.get('expiredTaxDate')?.setValidators([Validators.required])
    this.Form.get('expiredTaxDate')?.updateValueAndValidity()
    this.Form.get('authorityCode')?.setValidators([Validators.required])
    this.Form.get('authorityCode')?.updateValueAndValidity()
    this.Form.get('authorityStart')?.setValidators([Validators.required]);
    this.Form.get('authorityStart')?.updateValueAndValidity();
    this.Form.get('authorityEnd')?.setValidators([Validators.required])
    this.Form.get('authorityEnd')?.updateValueAndValidity()
  }
  if(e.value == 0){
    $('#gender').show(300)
    this.Form.get('gender')?.setValue(null)
    this.NickName = 'Nick Name'
  }else{
    $('#gender').hide(300)
    this.Form.get('gender')?.setValue(0)
    this.NickName = 'Commercial Name'
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
  getBankCountryValue(e:any){
    this.bankCountryValue=e.value
  }
  getCurrencyValue(e:any){
    this.CurrencyValue=e.value    
  }



      // Submit Add Customer Service
 SubmitCustomer(){
  this.isClicked=true
    if(this.groupValue==null){
      this.groupValue=null
    }
    else if(this.groupValue==''){
      this.groupValue=null
    }
    else{
      this.groupValue=Number(this.groupValue)
    }
  
    
    this.model =Object.assign(this.Form.value,
      {contactPerson:String(this.contactPersonName).concat('  ', String(this.contactPersonMobile)) },
      {country:Number(this.contryValue)},
      {bankCountry:Number(this.bankCountryValue)},
      {currency:Number(this.CurrencyValue)},
      {group:this.groupValue}
      // {birthday:this.datePipe.transform(this.Form.get('birthday')?.value,'dd-MM-YYYY')}
      ),
      // {group:this.groupValue !=''? this.groupValue=Number(this.groupValue):this.groupValue=null}
      console.log(this.model);

    this._AdminService.AddCustomer(this.model).subscribe((data: any) => {
      console.log(data);
      this.EditFiles()
      this.isClicked=true
      this._SharedService.setAlertMessage(data.name+' Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
        this.EditFiles()
        this.isClicked=false
        this.CustomerId=data.id
        this.errorExist = false;
            
   }, error => {
    console.log(error);
    
    this.isClicked=false
     this.errorMsg = error.error;
     Swal.fire({
       icon: 'error',
       title: 'Oops...',
       text: error.error,
     });
     this.errorExist = true;
     this._ToastrService.error("Please Enter previous inputs Correctly", "Major Error");
   })
  }
  getArabicName(){
    if(this.Form.get('arabicName')?.status=='INVALID'){
      this.Form.get('arabicName')?.setValue('')
      this._ToastrService.show('Please enter Arabic language only')
    }
  }
          // Get Valid Input For Select
  getValidInputs(){
    if(this.contryValue!=null&&this.bankCountryValue!=null&&this.CurrencyValue!=null){
      this.isValid= true;
    }
  }
  getCustomerTypes(){
    this._AdminService.getCustomerTypes().subscribe(data=>{
      this.customerTypes=data  
      console.log(this.customerTypes);
    })
  }
  getCountries(){
    this._AdminService.getCountries().subscribe(data=>{
      this.Contries =data
    })
  }
  getCurrency(){
    this._AdminService.getCurrency().subscribe(data=>{
      this.Currency=data  
    })
  }
  getListOfCorporate(){
    this._AdminService.GetListOfCorporate().subscribe(data=>{
      this.listOfCorporare =data
    })
  }
  EgyptCities(){
    this._ListsService.EgyptCities().subscribe(data=>{
      this.EgyptGovernments =data
    })
  }

  getDangerLevels(){
    this._ListsService.getDangerLevels().subscribe(data=>{
      console.log(data);
      this.AllDangerLevels=data
    })
  }

      // Show Dates with Animation
  onHoldToggle(){
    if(this.Form.get('onHold')!.value==true){
    $("#onhold").show(500)
    $("#holdNotes").show(500)
    $("#HoldLevel").show(500)
    }else{
    $("#onhold").hide(500)
    $("#holdNotes").hide(500)
    $("#HoldLevel").hide(500)
    }

    if(this.Form.get('block')!.value==true){
    $("#block").show(500)
    $("#blockNotes").show(500)
    $("#BlockLevel").show(500)
    }else{
    $("#block").hide(500)
    $("#blockNotes").hide(500)
    $("#BlockLevel").hide(500)
    this.Form.get('blockDate')?.setValue('')
    // this.Form.get('blockReason')?.setValue('')
    // this.Form.get('blockDangerLevel')?.setValue('')
    }
  }
  EnterIdOrPassport(value:any){
    if(value=='passport'){
      this.LabelId = 'passport'
      this.CustomMax=''
      this.CustomMin=''
    }else{
      this.LabelId = 'Id'
      this.CustomMax='99999999999999'
    this.CustomMin='10000000000000'
    }
    
  }
      // Check birth date 
      checkBirthDate() {
        const birthdayValue = this.Form.get('birthday')?.value;
    
        // Convert the birthday value to a Date object
        if (birthdayValue) {
            this.birthdayDate = new Date(birthdayValue);
        }
    
        if (this.birthdayDate instanceof Date && !isNaN(this.birthdayDate.getTime())) {
            // Compare current date with birthday
            if (this.currentDate >= this.birthdayDate) {
                this.Form.get('birthday')?.setErrors(null);
            } else {
                this.Form.get('birthday')?.setErrors({ incorrect: true });
                this.displayErrorMessage();
            }
        } else {
            // If it's an invalid date
            this.Form.get('birthday')?.setErrors({ incorrect: true });
            this.displayErrorMessage();
        }
    }
    
    // Helper method to display the correct error message
    displayErrorMessage() {
        if (this.SwitDOBOrIssueDate === 'D.O.B') {
            this._ToastrService.show('', 'Please Enter Correct BirthDay Date');
        } else if (this.SwitDOBOrIssueDate === 'DateOfEstablishment') {
            this._ToastrService.show('', 'Please Enter Correct Establishment Date');
        } else {
            this._ToastrService.show('', 'Please Enter Correct Inception Date');
        }
    }

      // Check Tax Expiry date 
      checkTaxDate() {
        const taxExpirDateValue = this.Form.get('expiredTaxDate')?.value;
    
        // Check if the value is a valid date
        if (taxExpirDateValue) {
            this.TaxExpirDate = new Date(taxExpirDateValue); // Convert to Date object
        }
    
        if (this.TaxExpirDate instanceof Date && !isNaN(this.TaxExpirDate.getTime())) {
            // If current date is less than tax expiration date
            if (this.currentDate < this.TaxExpirDate) {
                this.Form.get('expiredTaxDate')?.setErrors(null);
            } else {
                this._ToastrService.show('', 'Please Enter Correct Expired Tax Date');
                this.Form.get('expiredTaxDate')?.setErrors({ incorrect: true });
            }
        } else {
            // Invalid date case
            this._ToastrService.show('', 'Please Enter a Valid Date');
            this.Form.get('expiredTaxDate')?.setErrors({ incorrect: true });
        }
    }
// checkTaxDate(){
//     this.TaxExpirDate =this.Form.get('expiredTaxDate')?.value
//     if(this.currentDate<this.TaxExpirDate&&isNaN(this.TaxExpirDate?.getTime())){
//       this.Form.get('expiredTaxDate')?.setErrors(null)
//     }else{
//       this._ToastrService.show('','Please Enter Correct Expired Tax Date')
//       this.Form.get('expiredTaxDate')?.setErrors({incorrect:true})
//     }
// }
      // Check Start date 
checkStartDate(){
  this.startDate =this.Form.get('authorityStart')?.value
    if(this.currentDate>=this.startDate&&!isNaN(this.startDate?.getTime())){
      this.Form.get('authorityStart')?.setErrors(null)
    }else{
      this.Form.get('authorityStart')?.setErrors({incorrect:true})
      this._ToastrService.show('','Please Enter Correct Autherity Start Date')
    } 
}
      // Check End date 
checkEndDate(){
  this.endDate =this.Form.get('authorityEnd')?.value
    if(this.currentDate<this.endDate&&isNaN(this.startDate?.getTime())){
      this.Form.get('authorityEnd')?.setErrors(null)
    }else{
      this._ToastrService.show('','Please Enter Correct Autherity End Date')
      this.Form.get('authorityEnd')?.setErrors({incorrect:true})
    }  
}

  // Add File Or image Modal
  async getAddFileOrImage(value:any){
    if(value==0){
      $("#inCaseYesDocument").show(400)
    }else{
      await  $("#addDoument").modal("toggle")
      await  this._Router.navigate(['/CustomerDetails/' + this.CustomerId]);
    }
  }

    // Save Documnet
  async SaveDocument(){
      this.isClickedDocumnet=true
      var formData = new FormData()
      formData.append('customerId',this.CustomerId);
      formData.append('regFile',this.selectedFile1);
      formData.append('taxesFile',this.selectedFile2);
      formData.append('yourAgentFile',this.selectedFile3);
      this._AdminService.AddFileToCustomerDetails(formData).subscribe(async res => {
        console.log(res);
        this.isClickedDocumnet=false
      // Swal.fire('Good job!','File Uploaded Successfully','success');
      await $("#addDoument").modal("toggle")
      await this._ToastrService.success("File Uploaded Successfully", "Good");
      await this._Router.navigate(['/CustomerDetails/' + this.CustomerId]);
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
    event.target.value='' 
}
  uploadFile2(event: any){
    this.selectedFile2 = event.target.files[0] ?? null;
    event.target.value='' 
}
  uploadFile3(event: any){
    this.selectedFile3 = event.target.files[0] ?? null;
    event.target.value='' 
}
  uploadFile4(event: any){
    this.selectedFile4 = event.target.files[0] ?? null;
    event.target.value='' 
}

  FirstStep:boolean= false;
  SocendStep:boolean= false;
  ThirdStep:boolean= false;
  selectionChange(item:any){
    // console.log(item._selectedIndex);
    // if(item._selectedIndex==0){
    //   this.FirstStep= true;
    //   this.SocendStep = false;
    //   this.ThirdStep =false;
    // }else if(item._selectedIndex==1){
    //   this.FirstStep= false;
    //   this.SocendStep = true;
    //   this.ThirdStep =true;
    // }
    
  }
  checkTax(){
    if(this.Form.get("taxNo")?.value==null){
    }else{
      if(String(this.Form.get("taxNo")?.value).length<9){
        this.Form.get("taxNo")?.setErrors({incorrect:true})
      }else if(String(this.Form.get("taxNo")?.value).length==9){
        this.Form.get("taxNo")?.setErrors(null)
      }else if(String(this.Form.get("taxNo")?.value).length>9){
        this._ToastrService.show("Tax number can not be more than 9")
        this.Form.get("taxNo")?.setErrors({incorrect:true})
      }
    }
  }
       // Get All Governorates
  getAllGovernorates(){
    this._PolicyService.getAllGovernorates().subscribe(data=>{
      this.AllItems =data;
      // console.log(this.AllItems);
    },error=>{
      // console.log(error);
    })
  }
  additionalTypes:any[]=[]
  getTpaType(){
    this._ClaimsService.GetTpaTypes().subscribe((data:any)=>{
      // console.log(data);
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
  ngOnInit(){
    this._SharedService.changeData(true,'','',false,false);
    this.getAllGovernorates();
    this.getCustomerTypes();
    this.getCountries();
    this.getCurrency()
    this.getListOfCorporate()
    this.EgyptCities()
    this.getDangerLevels()
    this.getTpaType()
  }
}
