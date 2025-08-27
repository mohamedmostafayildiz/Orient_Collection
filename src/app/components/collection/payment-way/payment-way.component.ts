import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-payment-way',
  templateUrl: './payment-way.component.html',
  styleUrls: ['./payment-way.component.scss'],
  providers : [DatePipe]
})
export class PaymentWayComponent implements OnInit{
  Secretariats:any[]=[];
  PortflioDateStablish:any = new Date();
  DepositTransfer:any;
  selectedFile:any = '';
  isClicked:boolean= false;
  isSubmitted:boolean= false;
  brokerCustomers:any;
  BrokerIdVal:any ='';
  TotalMony:number=0;
  PayedMoney:number=0;
  RemainedMoney:number=0;
  PortflioCollections:any;
  AllBanks:any;
  portfolioId:any=null;
  CurrentDate:any = new Date();
  CurrentOneDate:any = new Date();
  CreatedAt:any = new Date();
  CurrentPostponedDate:any = new Date();
  ArrCash:any[]=[];
  ArrCredit:any[]=[];
  ArrCheck:any[]=[];
  ArrPosponedCheck:any[]=[];
  ArrDeposit:any[]=[];
  ArrTransfer:any[]=[];
  ArrHonsty:any[]=[];
  AddedNewChecks:any[]=[];
  bankAccounts:any;
  constructor(private _ToastrService:ToastrService,private _DatePipe:DatePipe,
    private _CollectionService:CollectionService, private _AdminService:AdminService,
    private _Router:Router,
    private _PolicyService:PolicyService,private _SharedService:SharedService){
      // this.CurrentPostponedDate.setDate( this.CurrentPostponedDate.getDate() + 1 )
      this.CurrentOneDate.setDate( this.CurrentOneDate.getDate() + 1 )
    }
  ///////////////// Payment Way /////////////////
  getPaymentWay(value:any, select: MatSelect){
    $("#PaymentFile").show(500)
    $("#Bodyy").show(500)
    if(value == 1){
      $("#Money").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#CreditCard").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 2){
      $("#CreditCard").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 3){
      $("#Check").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 4){
      $("#BankDeposit").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 5){
      $("#BankTransfer").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#BankDeposit").hide(500)
      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
    }else if(value == 6){
      $("#Honesty").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
    }else if(value == 7){
      $("#FinishHonesty").show(500)

      $("#postponedCheck").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
    }else if(value == 8){
      $("#postponedCheck").show(500)

      $("#FinishHonesty").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
    }else if(value == 9){
      this.openTransactions()
      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      setTimeout(() => {
      select.value = null;
      });
    }
  }
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  SearchForm:FormGroup = new FormGroup({
    'transactionNo':new FormControl(''),
    'bankName':new FormControl(''),
    'transactionDateFrom':new FormControl(''),
    'transactionDateTo':new FormControl(''),
    'isBlocked':new FormControl(''),
    'currency':new FormControl(''),
  })
  PostponedCheckForm:FormGroup = new FormGroup({
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),  
    'collectionId':new FormControl(''),
  })
  CheckForm:FormGroup = new FormGroup({
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  CashForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('')
  })
  CreditForm:FormGroup = new FormGroup({
    'cardHolderName':new FormControl('',[Validators.required]),
    'cardNumber':new FormControl(''),
    'bankName':new FormControl('',[Validators.required]),
    'expiryDate':new FormControl(''),
    'amount':new FormControl('',[Validators.required])
  })
  DepositForm:FormGroup = new FormGroup({
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  TrasferForm:FormGroup = new FormGroup({
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  HonestyForm:FormGroup = new FormGroup({
    'secretariatId':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDateTime':new FormControl('',[Validators.required])
  })
  FinishHonestyForm:FormGroup = new FormGroup({
    'secretariatId':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDateTime':new FormControl('',[Validators.required])
  })
  CheckValues:any[]=[]
  SecretariatsArr:any[]=[]
  CurrentCollection:any
  toggleSelection(Portfolio: any, index: any, collections: any, CreatedAt: any) {
    console.log(Portfolio);
    const isChecked = !this.CheckValues[index]; // Toggle current selection state
    this.CurrentCollection = collections;
    this.PortflioDateStablish = new Date(CreatedAt);
    this.CurrentPostponedDate = new Date(CreatedAt);
    this.CurrentPostponedDate.setDate(this.CurrentPostponedDate.getDate() + 1);
    this.CreatedAt = new Date(CreatedAt);
    // Reset all CheckValues to false, then set the selected one to true
    this.CheckValues = this.ApprovedPortfolios.map(() => false);
    this.CheckValues[index] = isChecked;
    this.portfolioId = isChecked ? Portfolio.portfolioId : null;
    // Set amounts and secretariats array
    if (isChecked) {
      $('#AllMoney').show(500)
        this.TotalMony = Portfolio.amount;
        this.RemainedMoney = Portfolio.amount;
        this.SecretariatsArr = Portfolio.secretariats;
        this.GetCustomersOfPortfolio(Portfolio.portfolioId);
    } else {
      $('#AllMoney').hide(500)
        this.TotalMony = 0;
        this.RemainedMoney = 0;
        this.SecretariatsArr = [];
    }
    console.log(this.portfolioId);
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
  ////////////////////// Search ///////////////////////
Search(){
  this.loading = true;
    let Model =Object.assign(this.SearchForm.value,
      {BrokerId:this.BrokerIdVal})
    console.log(Model);
    this._CollectionService.GetAllPortfolio(Model).subscribe(data=>{
      console.log(data);
      
      this.loading = false;
      this.ApprovedPortfolios = data;
    },error=>{
      console.log(error);
      this.loading = false;
    })
}

viewCheck(){
  if((this.PayedMoney+Number(this.CheckForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    $('#PayedMoneyid').show(500)
    var item = this.ArrCheck.find(item=>this.CheckForm.get('checkNumber')?.value == item.checkNumber && this.CheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
    if(item==undefined){
      let Model= {
        'checkNumber':this.CheckForm.get('checkNumber')?.value,
        'bankName':this.CheckForm.get('bankName')?.value,
        'amount':this.CheckForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYYY-MM-dd'),
        'CheckPaymentType':0
      }
      this.PayedMoney = this.PayedMoney+=Number(this.CheckForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.ArrCheck.push(Model);
      this.CheckForm.reset()
      console.log(this.ArrCheck);
    }else{
      this._ToastrService.show('This Ckeck is Already Exist')
    }
  }
  
  
}
removeCheck(index:number,Money:any){
  this.ArrCheck.splice(index, 1)
  this.PayedMoney-=Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

//////////// Postponed Check  /////////////////
viewPostponedCheck(){
  if((this.PayedMoney+Number(this.PostponedCheckForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money');
  }else{
    $('#PayedMoneyid').show(500)
    var item = this.ArrPosponedCheck.find(item=>this.PostponedCheckForm.get('checkNumber')?.value == item.checkNumber && this.PostponedCheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
    if(item==undefined){
      let Model= {
        'checkNumber':this.PostponedCheckForm.get('checkNumber')?.value,
        'bankName':this.PostponedCheckForm.get('bankName')?.value,
        'amount':this.PostponedCheckForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.PostponedCheckForm.get('paymentDate')?.value, 'YYYY-MM-dd'),
        'collectionId':this.PostponedCheckForm.get('collectionId')?.value,
        'checkPaymentType':1
      }
      this.CurrentPostponedDate =new Date(this.PostponedCheckForm.get('paymentDate')?.value);
      this.CurrentPostponedDate.setDate( this.CurrentPostponedDate.getDate())
      
      this.PayedMoney = this.PayedMoney+=Number(this.PostponedCheckForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.ArrPosponedCheck.push(Model);
      this.PostponedCheckForm.reset()
      console.log(this.ArrPosponedCheck);
    }else{
      this._ToastrService.show('This Ckeck is Already Exist')
    }
  }
  
  
}
removePostponedCheck(index:number,Money:any){
  this.ArrPosponedCheck.splice(index, 1)
  this.PayedMoney-=Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;

  let latestDate=new Date()
  for (let i = 0; i < this.ArrPosponedCheck.length; i++) {

    let currentDate = new Date(this.ArrPosponedCheck[i].paymentDate);

    if (currentDate > latestDate) {
      latestDate = currentDate;
    }
  }
  console.log(latestDate);
  
  
  if(this.ArrPosponedCheck.length!=0){
    console.log("Arr Has items");
    this.CurrentPostponedDate = new Date(latestDate);
    this.CurrentPostponedDate.setDate(latestDate.getDate());
  }else{
    console.log("Arr is empty");
    this.CurrentPostponedDate = new Date();
    this.CurrentPostponedDate.setDate(this.CreatedAt.getDate() + 1 );
  }
}

    ////////////  Cash  /////////////////
viewCash(){
  if((this.PayedMoney+Number(this.CashForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    $('#PayedMoneyid').show(500)
    let Model={
      amount:this.CashForm.get('amount')?.value,
      paymentDate:this._DatePipe.transform(this.CurrentDate, 'YYYY-MM-dd')
    }
    this.ArrCash.push(Model)
    this.PayedMoney+=Number(this.CashForm.get('amount')?.value);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    this.CashForm.reset();
  }
  
}
removeCash(index:number, Money:any){
  this.ArrCash.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

removetrans(index:number, Money:any){
  this.ArrTest.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}
    ////////////  Credit  //////////////
viewCredit(){
  if((this.PayedMoney+Number(this.CreditForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'cardHolderName':this.CreditForm.get('cardHolderName')?.value,
      'cardNumber':this.CreditForm.get('cardNumber')?.value,
      'expiryDate': this._DatePipe.transform(this.CreditForm.get('expiryDate')?.value, 'YYYY-MM-dd'),
      'amount':this.CreditForm.get('amount')?.value,
      'bankName':this.CreditForm.get('bankName')?.value,
    }
    $('#PayedMoneyid').show(500)
    this.ArrCredit.push(Model)
    this.PayedMoney+=Number(this.CreditForm.get('amount')?.value);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    this.CreditForm.reset()
  }
  
}
removeCredit(index:number, Money:any){
  this.ArrCredit.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}
    ////////////  Transfer  //////////////
viewTransfer(){
  if((this.PayedMoney+Number(this.TrasferForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    $('#PayedMoneyid').show(500)
    let Model={
      'transferNumber':this.TrasferForm.get('transferNumber')?.value,
      'bankName':this.TrasferForm.get('bankName')?.value,
      'amount':this.TrasferForm.get('amount')?.value,
      'paymentDate': this._DatePipe.transform(this.TrasferForm.get('paymentDate')?.value, 'YYYY-MM-dd')
    }
    this.ArrTransfer.push(Model)
    this.PayedMoney+=Number(this.TrasferForm.get('amount')?.value);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    this.TrasferForm.reset()
  }
  
}
removeTrasfer(index:number, Money:any){
  this.ArrTransfer.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

    ////////////  Deposit  //////////////
viewDeposit(){
  if((this.PayedMoney+Number(this.DepositForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Exist = this.ArrDeposit.find(item=>item.depositNumber==this.DepositForm.get('transferNumber')?.value);
    console.log(Exist);
    
    if(Exist!=undefined){
      this._ToastrService.show('This Transfer Number already exist')
    }else{
      $('#PayedMoneyid').show(500)
      let Model={
        'depositNumber':this.DepositForm.get('transferNumber')?.value,
        'bankName':this.DepositForm.get('bankName')?.value,
        'amount':this.DepositForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.DepositForm.get('paymentDate')?.value, 'YYYY-MM-dd')
      }
      this.ArrDeposit.push(Model);
      this.PayedMoney = this.PayedMoney+=Number(this.DepositForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.DepositForm.reset();
    }
  }
  
}
removeDeposit(index:number, Money:any){
  this.ArrDeposit.splice(index, 1)
  this.PayedMoney -= Number(Money)
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

    ////////////  viewHonesty  //////////////
  // SecretRate
  SecretAmount:any
  FinishSecretAmount:any
  getClientName(){
    let Exist = this.Secretariats.find(item=>item.id==this.HonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    this.SecretAmount = Exist.amount
    // console.log("Hello");
  }
  ///// Finish ////
  getFinishClientName(){
    let Exist = this.SecretariatsArr.find(item=>item.id==this.FinishHonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    this.FinishSecretAmount = Exist.amount
  }

  viewHonesty(){
    let Exist = this.AllInsureds.find(item=>item.insuredId==this.HonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    
    let Exist2 = this.ArrHonsty.find(item=>item.customerId==this.HonestyForm.get('secretariatId')?.value);
    if(Exist2==undefined){
      $('#PayedMoneyid').show(500)
      let Model={
        'name':Exist.insured,
        'customerId':this.HonestyForm.get('secretariatId')?.value,
        'paymentDateTime': this._DatePipe.transform(this.HonestyForm.get('paymentDateTime')?.value, 'YYYY-MM-dd'),
        'amount':this.HonestyForm.get('amount')?.value
      }
      this.ArrHonsty.push(Model)
      this.PayedMoney-=Number(this.HonestyForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.HonestyForm.reset()
    }else{
      this._ToastrService.show('This Secretariats is Already Exist');
    }
    console.log(this.ArrHonsty);
  }

  removeHonesty(index:number, Money:any){
    this.ArrHonsty.splice(index, 1)
    this.PayedMoney = this.PayedMoney += Number(Money)
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    console.log(Money);
  }
  // Finish Honsty///////
  ArrFinishHonsty:any[]=[]
  viewFinishHonesty(){
    let Exist = this.SecretariatsArr.find(item=>item.id==this.FinishHonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    if((this.PayedMoney+Number(this.FinishHonestyForm.get('amount')?.value))>this.TotalMony){
      this._ToastrService.show('Can Not Pay More Than Total Money')
    }else{
      let Exist2 = this.ArrFinishHonsty.find(item=>item.secretariatId==this.FinishHonestyForm.get('secretariatId')?.value);
      if(Exist2==undefined){
        $('#PayedMoneyid').show(500)
        let Model={
          'insuredName':Exist.insuredName,
          'secretariatId':this.FinishHonestyForm.get('secretariatId')?.value,
          'paymentDateTime': this._DatePipe.transform(this.FinishHonestyForm.get('paymentDateTime')?.value, 'YYYY-MM-dd'),
          'amount':this.FinishHonestyForm.get('amount')?.value
        }
        this.ArrFinishHonsty.push(Model)
        this.PayedMoney = this.PayedMoney+=Number(this.FinishHonestyForm.get('amount')?.value)
        this.RemainedMoney = this.TotalMony - this.PayedMoney;
        this.FinishHonestyForm.reset()
        console.log(this.ArrFinishHonsty);
      }else{
        this._ToastrService.show('This Secretariats is Already Exist');
      }
      }
  }
  removeFinishHonesty(index:number, Money:any){
    this.ArrFinishHonsty.splice(index, 1)
    this.PayedMoney = this.PayedMoney -= Number(Money)
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
  }


    // get Temp
    FileName:any
    getTempleteFile(){
      this._CollectionService.getTempleteFile().subscribe(res=>{
        let blob:Blob = res.body as Blob
        this.FileName= 'test.pdf'
        let a= document.createElement('a');
        a.download=this.FileName
        a.href=window.URL.createObjectURL(blob)
        a.click()
      })
    }
    loading:boolean=false;
    ApprovedPortfolios:any
    getPortflioCollections(collections:any){
      console.log("oo");
      
      this.PortflioCollections = collections
      $(".overlayPortflioCollections").fadeIn(300)
      $(".closePortflioCollections").animate({right: '0px'});
    }
    closePortflioCollections(){
      $(".overlayPortflioCollections").fadeOut(300)
      $(".closePortflioCollections").animate({right: '-30%'});
    }
    NewPayment(){
      $(".NewPay").hide(500)
      this.ArrCash = []
      this.ArrCheck = []
      this.ArrCredit = []
      this.ArrHonsty = []
      this.ArrTransfer = []
      this.ArrPosponedCheck = []
      $(".remove").show(500)
      $("#UpdateClaimBtn").show(500)
      $("#searchBtn").show(500)
      $(".chechBox").show(500)

      $("#Check").hide(400);
      $("#Money").hide(400);

      $("#postponedCheck").hide(500)
      $("#BankTransfer").hide(500)
      $("#Honesty").hide(500)
      $("#CreditForm").hide(400);
      $("#CashForm").hide(400);
    }
    // Create Secretratr
  GetCustomersOfPortfolio(id:any){
    this._CollectionService.GetCustomersOfPortfolio(id).subscribe((data:any)=>{
      console.log(data);
      this.Secretariats = data;
    },error=>{
      console.log(error);
    })
  } 
//////////   Final Pay   /////////////////////
FinalArrHonsty:any[]=[]
ExchangePermits:any;
arrayOfValues:any;
AddPayment(){
  this.isSubmitted = true;
  this.FinalArrHonsty = []
  for(let i=0;i<this.ArrHonsty.length;i++){
    let Model={
      'paymentDateTime':this.ArrHonsty[i].paymentDateTime,
      'customerId':this.ArrHonsty[i].customerId,
      'amount':this.ArrHonsty[i].amount,
    }
    this.FinalArrHonsty.push(Model)
  }
  let Paymentways={
    'paymentWays':{
      'bankTransferPayment':this.ArrTransfer,
      'checkPayment':this.ArrCheck,
      'createSecretariat':this.FinalArrHonsty,
      'useSecretariat':this.ArrFinishHonsty,
      'cashPayments':this.ArrCash,
      'visaPayments':this.ArrCredit,
      'bankDepositPayments':this.ArrDeposit,
      'postdatedCheckPayments':this.ArrPosponedCheck,
      'TransactionWays' :this.ArrTest
    }
  }
  let FinalModel={
    'convertCollections': this.selectedCollections,
    'paymentdto':Paymentways,
  }
  console.log(FinalModel);
  this._CollectionService.CreatePortfolio(FinalModel).subscribe((res: any) => {
       this.TotalMony = 0;
    this.PayedMoney = 0;
    $("#PaymnetWays").hide(400);
    $("#PayedMoneyid").hide(400);
    $("#AllMoney").hide(400);
    this.portfolioId = null;
    $("#Money").hide(400);
    $("#CreditCard").hide(400);
    $("#postponedCheck").hide(400);
    $("#Check").hide(400);
    $("#BankDeposit").hide(400);
    $("#BankTransfer").hide(400);
    $("#Honesty").hide(400);
    $("#FinishHonesty").hide(400);
    $(".remove").hide(400);
    $("#CashForm").hide(400);
    $("#searchBtn").hide(500);
    $(".NewPay").show(400);
    $(".chechBox").hide(500);
    this.selectedCollections=[]
    this.ArrCash=[]
    this.ArrCheck=[]
    this.ArrPosponedCheck=[]
    this.ArrCredit=[]
    this.ArrDeposit=[]
    this.ArrTransfer=[]
    this.ArrHonsty=[]
    this.ArrFinishHonsty=[]
    this.ArrTest=[]
    this.selectedCollections=[]
    this.ExchangePermits = res.exchangePermits;
    // this.Search();
    this.isSubmitted = false;
    console.log(res);
    this._SharedService.setAlertMessage('Payment Added Successfully');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this._Router.navigate(['/PrintSubbliy']);
  }, error => {
    this.isSubmitted = false;
    console.log(error);
    Swal.fire({ icon: 'error', title: 'Oops...', text: error.error });
  });
}
  AllItems:any[]=[1,2,3]
  PrintPortfolio(id:any){
    // window.open('http://localhost:4200/#/PortfolioModel/'+id,'_blank')
    window.open('http://97.74.82.75:3375/#/PortfolioModel/'+id,'_blank')
  }
  PrintPermit(id:any){
    // window.open('http://localhost:4200/#/BrokerageModel/'+id,'_blank')
    window.open('http://97.74.82.75:3375/#/BrokerageModel/'+id,'_blank')
  }
  TestPassObjectInParam(){
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(this.arrayOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    let newRelativeUrl = this._Router.createUrlTree(['/PortfolioModel'],navigationExtras);
    let baseUrl = window.location.href.replace(this._Router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }
  ////// set Numbers
  setDepositNumber(){
    console.log(this.DepositForm.get('bankName')?.value);
    let Exist = this.AllBanks.find((item:any)=>item.bankId==this.DepositForm.get('bankName')?.value);
    console.log(Exist);
    this.bankAccounts = Exist.bankAccounts 
  }
  validMainButton:boolean=false
   openTransactions(){
    this.validMainButton=true
    $(".overlayEditNon").fadeIn(300)
      $(".EditgovernmantNon").animate({right: '0px'});  
  }
  closeTransactions(){
      this.validMainButton=false
     $(".overlayEditNon").fadeOut(300)
    $(".EditgovernmantNon").animate({right: '-30%'});
  }
  AllTransactions:any[]=[]
  /////////////////// Add Portfolio ///////////
  AddPortfolio(){
    this.isClicked = true;
    let Model ={
      convertCollections:this.ArrTest
    }
    console.log(Model);
    this._SharedService.setSelectedData(this.ArrTest);
    this._SharedService.setTotal(this.TotalMony);
    this._Router.navigate(['/CollectionPayment']);
}
transactionMode:any
@ViewChild('insuredFile') insuredFileInput!: ElementRef;
ExcelFileSelected:any
onExcelFileSelected(event: any) {
   this.SouldSelectFile=false
   this.ExcelFileSelected = event.target.files?.[0];
  }
// transactionMode: boolean = false;
SouldSelectFile:boolean=false
onTransactionModeChange(event: any) {
  console.log("Transaction mode changed:", event.value);
  this.transactionMode=event.value
  if (event.value === true) {
    this.SouldSelectFile=true
    // لما يختار Yes
  } else {
      this.SouldSelectFile=false
    if (this.insuredFileInput) {
        this.insuredFileInput.nativeElement.value = '';
    }
  }
}
isClicked3:boolean=false
GetAllTransactions(){
  this.loading = true;
  const Model = this.SearchForm.value; // خليه يفضل زي ما هو

  console.log('Model before sending: ', Model);

  this._CollectionService.GetAllTransactions(Model).subscribe(
    (res:any) => {
      console.log('this.AllTransactions', res);
      this.loading = false;
      this.AllTransactions = res.createTransactions;
    },
    (err) => {
      console.log(err);
      this.loading = false;
    }
  );
}
resetForm() {
  this.SearchForm.reset();
  this.GetAllTransactions(); // يجيب كل الترانزكشن من غير أي فلترة
}
ArrTest:any[]=[]
TotalMonyTransaction:number=0
 getCheckedValues(event:any, Policy:any, id:any, checked:any, Money:any) {
  console.log("checked", checked);
  let checkboxElement = event.source; 
  $("#UploadFile").show(500);
  const moneyValue = Number(Money.value);
  let Exisit = this.ArrTest.find(item => id == item.transactionCollectionId);
  let Model = {
    transactionCollectionId: Policy.transactionCollectionId,
    TotalAmount: Policy.amount,
    PaymentDate: this.CurrentOneDate,
    PaidAmount: Money.value != null ? Money.value : null,
  };
  if (checked == true) {
     // تحقق الأول قبل ما تزود أي حاجة
      if (this.TotalMonyTransaction + moneyValue > this.TotalMony) {
        this._ToastrService.warning("You cannot select this item, the amount is greater than the remaining amount", "Warning");
        checkboxElement.checked = false;
        return;
      }
      Money.disabled = true;
    if (Exisit == undefined) {
      this.ArrTest.push(Model);
      this.TotalMonyTransaction += moneyValue;
      console.log("this.TotalMonyTransaction", this.TotalMonyTransaction);
      $('#PayedMoneyid').show(500);
      this.PayedMoney += moneyValue;
      this.RemainedMoney -= moneyValue;
      Policy.DisabeledpayIcon = true;
    } else {
      let Index = this.ArrTest.indexOf(Exisit);
      this.ArrTest.splice(Index);
      this.ArrTest.push(Model);
    }

  } else {
    this.TotalMonyTransaction -= moneyValue;
    this.PayedMoney -= moneyValue;
    this.RemainedMoney += moneyValue;

    Money.disabled = false;
    let item = this.ArrTest.find(item => id == item.transactionCollectionId);
    let Index = this.ArrTest.indexOf(item);
    this.ArrTest.splice(Index, 1);
    Policy.DisabeledpayIcon = false;
  }

  console.log(this.ArrTest);

  if (this.ArrTest.length > 0) {
    $("#alertTotalSave").show(500);
  } else {
    $("#alertTotalSave").hide(500);
  }
}

  getLaterDate(checkBtn:any){
    checkBtn.disabled=false;
  }
   Policy:any
  mainRemainderValue:number=0
  checkIfAxceeded(e:any, IndexIdDate:any,checkBtn:any,Balance:any){ 
    console.log("e.max",e.max);
    console.log("e.value",e.value);
    // LaterDate as HTMLInputElement
    if(Number(e.value)<Number(Balance)){
      $('#Remain'+IndexIdDate).show(500)
    }else if(Number(e.value)>=Number(Balance)){
      $('#Remain'+IndexIdDate).hide(500)
      // checkBtn.disabled=true;

      // LaterDate.value =''
      this._ToastrService.show("You can not pay more than Installment Due")
      e.value =Balance
      // checkBtn.disabled=false;
    }
  }
  selectedCollections:any[]=[]
  tomorrow:any
  AllInsureds:any[]=[]
  ngOnInit(){
  this.GetAllTransactions()
  const now = new Date();
  now.setDate(now.getDate() + 1); // إضافة يوم عشان يبقى بكرة
  this.tomorrow = now.toISOString().split('T')[0]; // YYYY-MM-DD
    this.selectedCollections=[]
    this._SharedService.changeData(false,'','',false,false);
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });
     this._SharedService.selectedData$.subscribe(data => {
        if (data && data.length > 0) {
          this.selectedCollections = data;
          console.log("this.selectedCollections:",this.selectedCollections);
          //  if(!this.AllInsureds || this.AllInsureds.length ==0){
              this.AllInsureds = Object.values(
                    this.selectedCollections.reduce((acc: { [x: string]: { insured: any; insuredId: any; }; }, { insured, insuredId }: any) => {
                      acc[insuredId] = { insured, insuredId }; // use insuredId as unique key
                      return acc;
                    }, {} as Record<string, { insured: string; insuredId: string }>)
                  );
            // }

        }
      });

      this._SharedService.total$.subscribe(total => {
        if (total) {
          this.TotalMony = total;
          this.RemainedMoney = total
        }
      });
      this.TotalMony = this.selectedCollections.reduce((sum, item) => {
        if (item.currencyOfPolicy === "EGP" && item.isChecked==true) {
          console.log("1");
          // البوليصة بالعملة المحلية
          return sum + Number(item.amountOfPremium || item.localPremium);
        } 
        else if (item.currencyOfPolicy == "EGP" && item.isChecked==false) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium ||  item.localPremium);
        } 
        else if (item.currencyOfPolicy !== "EGP" && item.isChecked==false) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium ||  item.foreignPremium);
        } 
        else if (item.currencyOfPolicy !== "EGP" && item.isChecked==true) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium || item.localPremium);
        } 
        
      }, 0);
      
      console.log("this.TotalMony", this.TotalMony);
      
      
      // RemainedMoney نفس الحساب كبداية
      this.RemainedMoney = this.selectedCollections.reduce((sum, item) => {
        if (item.currencyOfPolicy === "EGP" && item.isChecked==true) {
          console.log("1");
          // البوليصة بالعملة المحلية
          return sum + Number(item.amountOfPremium || item.localPremium);
        } 
        else if (item.currencyOfPolicy == "EGP" && item.isChecked==false) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium ||  item.localPremium);
        } 
        else if (item.currencyOfPolicy !== "EGP" && item.isChecked==false) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium || item.foreignPremium);
        } 
        else if (item.currencyOfPolicy !== "EGP" && item.isChecked==true) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium || item.localPremium);
        } 
      }, 0);
      
      console.log("this.RemainedMoney", this.RemainedMoney);
  }  
}
