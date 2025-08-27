import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { ListsService } from 'src/app/services/lists.service';
import { PolicyService } from 'src/app/services/policy.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
declare var $:any;
import { ClaimsService } from 'src/app/services/claims.service';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.scss'],
  providers :[DatePipe]
})
export class AllCustomersComponent implements OnInit{
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)
  AllItems:any
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[5,8,10,15,20];
  term:any
  Gender:any
  AllCustomers:any[]=[];
  loading:boolean=false
  CustomerTypeId:any;
  customersTypes:any;
  customerIdEdited:any;
  birthdayDate:any;
  AllDangerLevels:any;
  inValidBirthDate:boolean =false;
  constructor(private _ClaimsService:ClaimsService, public _SharedService:SharedService,private _PolicyService:PolicyService,private _DatePipe:DatePipe,private _AuthService:AuthService,private _ListsService:ListsService ,private _AdminService:AdminService ,private _ActivatedRoute:ActivatedRoute ,private _ToastrService:ToastrService){
    // dateObj.setMinutes((dateObj.getMinutes() + dateObj.getTimezoneOffset()));
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
    // if(this.CustomerTypeId!= null){
    //   this.customersTypes=this.AllCustomers[1]?.customerType;
    // }else{
    //   this.customersTypes='All'
    // } 
  }
  customerTypes:any;
  Contries:any
  Currency:any

  CustomerTypeValue:any
  genderValue:any
  contryValue:any= '65'
  bankCountryValue:any = '65'
  CurrencyValue:any
  isValid:boolean=false
  errorExist:boolean=false
  model:object={}
  contactPersonName:any="";
  contactPersonMobile:any="";
  errorMsg:any;
  editCustomerError:any;
  Form=new FormGroup({
    'name':new FormControl('',[Validators.required, Validators.minLength(3)]),
    'nickName':new FormControl(''),
    'arabicName':new FormControl('',[Validators.required]),
    'regNo':new FormControl(''),
    'taxNo':new FormControl(''),
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
  })
  
  getCustomerInfo(customer:any){
    this.getCustomerTypeValue(customer.customerType)
    this.Form.get('name')?.setValue(customer.name)
    this.Form.get('nickName')?.setValue(customer.nickName)
    this.Form.get('arabicName')?.setValue(customer.arabicName)
    this.Form.get('regNo')?.setValue(customer.regNo)
    this.Form.get('taxNo')?.setValue(customer.taxNo)
    this.Form.get('job')?.setValue(customer.job)
    this.Form.get('authorityCode')?.setValue(customer.authorityCode)
    this.Form.get('authorityStart')?.setValue(customer.authorityStart)
    this.Form.get('authorityEnd')?.setValue(customer.authorityEnd)
    this.Form.get('phoneNumber')?.setValue(customer.phoneNumber)
    this.Form.get('phoneNumber2')?.setValue(customer.phoneNumber2)
    this.Form.get('mobile')?.setValue(customer.mobile)
    this.Form.get('mobile2')?.setValue(customer.mobile2)
    this.Form.get('email')?.setValue(customer.email)
    this.Form.get('website')?.setValue(customer.website)
    this.Form.get('address')?.setValue(customer.address)
    this.Form.get('notes')?.setValue(customer.notes)
    this.Form.get('governorateName')?.setValue(customer.governorateName)
    this.Form.get('expiredTaxDate')?.setValue(customer.expiredTaxDate)
    this.Form.get('emailNotification')?.setValue(customer.emailNotification)
    this.Form.get('smsNotification')?.setValue(customer.smsNotification)
    this.Form.get('bankName')?.setValue(customer.bankName)
    this.Form.get('accountNO')?.setValue(customer.accountNO)
    this.Form.get('iban')?.setValue(customer.iban)
    this.Form.get('onHold')?.setValue(customer.onHold)
    this.Form.get('swiftCode')?.setValue(customer.swiftCode)
    this.Form.get('onHoldDate')?.setValue(this._DatePipe.transform(customer.onHoldDate,'YYYY-MM-dd'))
    this.Form.get('onHoldReason')?.setValue(customer.onHoldReason)
    this.Form.get('blockDangerLevel')?.setValue(customer.blockDangerLevel)
    this.Form.get('onHoldDangerLevel')?.setValue(customer.onHoldDangerLevel)
    this.Form.get('block')?.setValue(customer.block)
    this.Form.get('blockDate')?.setValue(this._DatePipe.transform(customer.blockDate,'YYYY-MM-dd'));
    this.Form.get('blockReason')?.setValue(customer.blockReason)
    this.Form.get('birthday')?.setValue(customer.birthday);
    this.genderValue= customer.gender;
    this.CustomerTypeValue=customer.customerType
    this.CurrencyValue =customer.currency;
    this.customerIdEdited=customer.id
    this.groupValue=customer.group
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
  getGenderValue(e:any){
    this.genderValue=e.value;
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
    console.log(this.CurrencyValue);
    
  }
        // Check birth date 
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
            // Get Valid Input For Select
  getValidInputs(){
    if(this.CustomerTypeValue!=null&&this.genderValue!=null&&this.contryValue!=null&&this.bankCountryValue!=null&&this.CurrencyValue!=null){
      this.isValid= true;
    }
  }
  getCustomerTypes(){
    this._AdminService.getCustomerTypes().subscribe(data=>{
      this.customerTypes=data  
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
      // Show Dates with Animation
  onHoldToggle(){
    if(this.Form.get('onHold')!.value==true){
    $("#onhold").show(500)
    this.Form.get('onHoldDate')?.setValidators([Validators.required])
    this.Form.get('onHoldReason')?.setValidators([Validators.required])
    this.Form.get('onHoldDangerLevel')?.setValidators([Validators.required])
    this.Form.get('onHoldDate')?.updateValueAndValidity()
    this.Form.get('onHoldReason')?.updateValueAndValidity()
    this.Form.get('onHoldDangerLevel')?.updateValueAndValidity()
    }else{
    $("#onhold").hide(500)
    this.Form.get('onHoldDate')?.setValue('')
    this.Form.get('onHoldReason')?.setValue('')
    this.Form.get('onHoldDangerLevel')?.setValue('')
    this.Form.get('onHoldDate')?.setErrors(null)
    this.Form.get('onHoldReason')?.setErrors(null)
    this.Form.get('onHoldDangerLevel')?.setErrors(null)
    }
    if(this.Form.get('block')!.value==true){
    $("#block").show(500)
    this.Form.get('blockDate')?.setValidators([Validators.required])
    this.Form.get('blockReason')?.setValidators([Validators.required])
    this.Form.get('blockDangerLevel')?.setValidators([Validators.required])
    this.Form.get('blockDate')?.updateValueAndValidity()
    this.Form.get('blockReason')?.updateValueAndValidity()
    this.Form.get('blockDangerLevel')?.updateValueAndValidity()
    }else{
    $("#block").hide(500)
    this.Form.get('blockDate')?.setValue('')
    this.Form.get('blockReason')?.setValue('')
    this.Form.get('blockDangerLevel')?.setValue('')
    this.Form.get('blockDate')?.setErrors(null)
    this.Form.get('blockReason')?.setErrors(null)
    this.Form.get('blockDangerLevel')?.setErrors(null)
    }
  }
   //Submit Edit Customer\
   optionItems:any=''
   isClicked:boolean=false;
  SubmitCustomer(){
    this.isClicked = true;
    this.model =Object.assign(this.Form.value,
      {gender:this.genderValue},
      {id:this.customerIdEdited},
      {contactPerson:String(this.contactPersonName).concat(' Mobile: ', String(this.contactPersonMobile)) },
      {customerType:this.CustomerTypeValue},
      {country:this.contryValue},
      {group:this.groupValue==undefined?null:this.groupValue},
      {bankCountry:this.bankCountryValue},
      {blockDate:this._DatePipe.transform(this.Form.get('blockDate')?.value,'YYYY-MM-dd')},
      {onHoldDate:this._DatePipe.transform(this.Form.get('onHoldDate')?.value,'YYYY-MM-dd')},
      {currency:this.CurrencyValue})
      console.log(this.model);
      this._AdminService.EditCustomer(this.model).subscribe(res=>{
        this.isClicked = false;
          Swal.fire('Good job!','Customer Edited Successfully !','success')
          this.getAllCustomer()
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
  
  // getCustomerTypeValue(e:any){

  // }
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
    // this.LabelId='Reg No.'
    this.showAdditionalSelect=false
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
  }else if(this.CustomerTypeValue == 'TPA' || this.CustomerTypeValue == 'ReInsurer'){ // TPA
    if(this.CustomerTypeValue == 'TPA'){
      // this.SwitDOBOrIssueDate = 'Issue Date'
      this.showAdditionalSelect=true
    }else if(this.CustomerTypeValue == 'ReInsurer'){
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

}
startDate:any
endDate:any
TaxExpirDate:any
groupValue:any
listOfCorporare:any[]=[]
inValidStartDate:boolean = false
inValidEndDate:boolean = false
inValidTaxExpireDate:boolean = false
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

            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllCustomer();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllCustomer();
  }
  HoldEdit:any;
  BlockEdit:any;
  CustomerIdEdit:any;
  getDangerLevels(){
    this._ListsService.getDangerLevels().subscribe(data=>{
      this.AllDangerLevels=data
    })
  }
  ///////////// Edit Block & Hold Status ///////////\
  
  getBlockStatus(e:any){
    this.BlockStatusVal = e.value;
    if(e.value==true){
      $(".block").show(300);
    }else{
      $(".block").hide(300);
    }
  }
  getHoldStatus(e:any){
    this.HoldStatusVal = e.value;
    if(e.value==true){
      $(".onhold").show(300);
    }else{
      $(".onhold").hide(300);
    }
  }
  BlockStatusVal:any;
  HoldStatusVal:any;
  customerStaus:any;
  BlockDate:any;
  BlockReason:any;
  BlockDangerLevel:any;
  HoldDate:any
  HoldReason:any
  HoldDangerLevel:any
  // get Status Details
  getCustomerStatus(customer:any){
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
    this.customerStaus = customer;
    this.BlockStatusVal = this.customerStaus.block;
    this.HoldStatusVal = this.customerStaus.onHold;
    this.CustomerIdEdit = this.customerStaus.id;
    console.log(this.customerStaus);
    this.BlockDate = this.customerStaus?.blockDate;
    this.BlockReason = this.customerStaus?.blockReason;
    this.BlockDangerLevel = this.customerStaus?.blockDangerLevel;
    this.HoldDate = this.customerStaus?.onHoldDate;
    this.HoldReason = this.customerStaus?.onHoldReason;
    this.HoldDangerLevel = this.customerStaus?.onHoldDangerLevel;
    if(this.customerStaus?.block ==true){
      $(".block").show(300);
    }else{
      $(".block").hide(300)
    }
    if(this.customerStaus?.onHold ==true){
      $(".onhold").show(300);
    }else{
      $(".onhold").hide(300)
    }
  }
  // Save Edit Block
  SaveBlockEdit(){
    if(this.BlockStatusVal==true){
      var Model = {
        id:this.CustomerIdEdit,
        blockDate:this._DatePipe.transform(this.BlockDate,'YYYY-MM-dd'),
        blockReason:this.BlockReason,
        blockDangerLevel:this.BlockDangerLevel
      }
      console.log(Model);
      
      this._AdminService.BlockCustomer(Model).subscribe(res=>{
        console.log(res);
        // Swal.fire('Good job!','Customer Blocked Successfully !','success');
        this._SharedService.setAlertMessage('Customer Blocked Successfully !');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.getAllCustomer();
      },error=>{
        console.log(error);
        
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      })
    }else{
      this._AdminService.UnBlockCustomer(this.CustomerIdEdit).subscribe(res=>{
        console.log(res);
        // Swal.fire('Good job!','Customer UnBlocked Successfully !','success');
        this._SharedService.setAlertMessage('Customer UnBlocked Successfully !');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.getAllCustomer();
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      })
    }
  }
  // Save Edit Hold
  SaveHoldEdit(){
    if(this.HoldStatusVal==true){
      var Model = {
        id:this.CustomerIdEdit,
        onHoldDate:this._DatePipe.transform(this.HoldDate,'YYYY-MM-dd'),
        onHoldReason:this.HoldReason,
        onHoldDangerLevel:this.HoldDangerLevel
      }
      console.log(Model);
      
      this._AdminService.HoldCustomer(Model).subscribe(res=>{
        console.log(res);
        // Swal.fire('Good job!','Customer Holded Successfully !','success');
        this._SharedService.setAlertMessage('Customer Holded Successfully !');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.getAllCustomer();
      },error=>{
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      })
    }else{
      this._AdminService.UnHoldCustomer(this.CustomerIdEdit).subscribe(res=>{
        console.log(res);
        // Swal.fire('Good job!','Customer UnHolded Successfully !','success');
        this._SharedService.setAlertMessage('Customer UnHolded Successfully !');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.getAllCustomer();
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      })
    }
  }
       // Get All
  getAllGovernorates(){
    this._PolicyService.getAllGovernorates().subscribe(data=>{
      this.AllItems =data;
    },error=>{
      console.log(error);
    })
  }
  showAdditionalSelect:boolean = false
  additionalTypes:any[]=[]
  getTpaType(){
    this._ClaimsService.GetTpaTypes().subscribe((data:any)=>{
      console.log(data);
      this.additionalTypes=data
    })

  }
  ShowStatus(){
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
  }
  CloseStatus(){
    $(".overlayAddplan").fadeOut(300)
    $(".addnewplan").animate({right: '-50%'});
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getAllGovernorates();
    this.getDangerLevels();
    this.getAllCustomer();
    this.getCustomerTypes();
    this.getCountries();
    this.getCurrency();
    this.getListOfCorporate();
    this.getTpaType();
    this._SharedService.changeData(false,'Add  new partner','addCustomer',true,false);
    
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });
    
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
// toggole button delete and edit
toggleButtons(){
  // Toggle the buttons' visibility to true
  this._SharedService.toggleButtons(true);
}
}
