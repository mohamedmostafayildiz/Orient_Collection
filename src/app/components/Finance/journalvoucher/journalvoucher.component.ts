import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any
import { PaymentsService } from 'src/app/services/payments.service';
import { DatePipe } from '@angular/common';
import { AccountsService } from 'src/app/services/accounts.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
   selector: 'app-journalvoucher',
  templateUrl: './journalvoucher.component.html',
  styleUrls: ['./journalvoucher.component.scss'],
  providers:[DatePipe]
})

export class JournalvoucherComponent {
  ArrCheck:any[]=[]
  ArrTransfer:any[]=[]
  ArrCash:any[]=[]
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;
  calcTotalMony:number=0
  cashEntryDate:any
  cashTotalAmmount:any
  cashPayee:any
  selectedPayment:any
  BankNametest:any
   //  Payment Voucher
   PayArr:any[]=[
    {id:1,value:'Invoiced'},
    {id:2,value:'Manually'},
  ]
  Allamounttoduearr:any[]=[]
  AllAllEntriesToPay:any=[]
  AllCustomersToPay:any=[]
  isAmmountChecked:boolean=false
  EntiresToPayForm:FormGroup =new FormGroup ({
    'custometId':new FormControl(''),
    'invoiceCode':new FormControl(''),
    'from':new FormControl(''),
    'to':new FormControl(''),
  })
  CheckForm:FormGroup = new FormGroup({
    'paymentDate':new FormControl('',[Validators.required]),
    'checkNumber':new FormControl('',[Validators.required]),
    // 'bankId':new FormControl('',[Validators.required]),
    'remarks':new FormControl(''),
  })
  CashForm:FormGroup = new FormGroup({
    'paymentDate':new FormControl('',[Validators.required]),
    'remarks':new FormControl(''),
  })
  TrasferForm:FormGroup = new FormGroup({
    'paymentDate':new FormControl('',[Validators.required]),
    'transferNumber':new FormControl('',[Validators.required]),
    // 'bankId':new FormControl('',[Validators.required]),
    'remarks':new FormControl(''),
  }) 
  accountsToRecieptForm:FormGroup = new FormGroup({
    'mainAccountrId':new FormControl('',[Validators.required]),
    'subAccountId':new FormControl(''),
    'insurerId':new FormControl(''),
    'creditAmount':new FormControl('',this.nonNegativeValidator),
    'debitAmount':new FormControl('',this.nonNegativeValidator),
  }) 
  accountTransactionsForm:FormGroup=new FormGroup ({
    'description':new FormControl('',[Validators.required]),
    'description2':new FormControl(''),
    'debit':new FormControl('',this.nonNegativeValidator),
    'credit':new FormControl('',this.nonNegativeValidator),
    'mainAccountId':new FormControl('',[Validators.required]),
    'subAccountId':new FormControl(''),
    'subOfSubAccountId':new FormControl(''),

  })
  constructor(private _PaymentsService:PaymentsService,private _DatePipe:DatePipe, private _AccountsService:AccountsService,private _Router:Router){}

  nonNegativeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== null && control.value < 0) {
      return { 'negativeNumber': true };
    }
    return null;
  }
  lastScrollTop = 0;

   
   @HostListener('document:keydown.escape', ['$event'])
   handleEscapeKey(event: KeyboardEvent) {
    //  this.closeAddNewTap(); 
   }
  //Format date
  formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  
  
  //Pagination Methods
  onTableDataChange(event:any){
  this.page=event;
  // this.GetAllFilledInvoices()
  }
  onTableSizeChange(event:any){
  this.tableSize=event.target.value;
  this.page=1;
  // this.GetAllFilledInvoices()
  }
  getPaymentWay1(e:any){
    this.ArrCheck=[]
    this.ArrTransfer=[]
    this.ArrCash=[]
    console.log(e.target.value);
    if(e.target.value == 1){
      this.TrasferForm.reset()
      this.CashForm.reset()
      $("#Check1").show(500)
      $("#BankTransfer1").hide(500)
      $("#CashTransfer1").hide(500)
    }else if(e.target.value == 2){
      this.CheckForm.reset()
      this.CashForm.reset()
      $("#Check1").hide(500)
      $("#BankTransfer1").show(500)
      $("#CashTransfer1").hide(500)
    } else if(e.target.value == 3){
      this.CheckForm.reset()
      this.TrasferForm.reset()
      $("#Check1").hide(500)
      $("#BankTransfer1").hide(500)
      $("#CashTransfer1").show(500)
    }
  }
  ArrCheckModel:any
  PayedMoneyforonecustomer:number=0
  viewCheck(){
    console.log("Good");
        let Model= {
          'bankId':this.BankNametest,
          'remarks':this.CheckForm.get('remarks')?.value==null?'':this.CheckForm.get('remarks')?.value,
          'checkNumber':this.CheckForm.get('checkNumber')?.value,
          'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYY-MM-dd')
        }
        this.ArrCheckModel=Model
        console.log("this.ArrCheckModel",this.ArrCheckModel);
        this.ArrCheck.push(Model);
        console.log(this.ArrCheck);
        this.CheckForm.reset()
   
    console.log(this.ArrCheck);
    
  }
  removeCheck(index:number){
    this.ArrCheck.splice(index, 1)
    // this.PayedMoney-=Number(Money)
    // this.PayedMoneyforonecustomer-=Number(Money)
    // // this.getAbsoluteTotalMony()
    // console.log(this.ArrCheck);
    // this.getTotalAmountForCheck()
  }
  ArrTransferModel:any
  viewTransfer(){
        let Model={
          'transferNumber':this.TrasferForm.get('transferNumber')?.value,
          'bankId':this.BankNametest,
          'remarks':this.TrasferForm.get('remarks')?.value==null?'':this.TrasferForm.get('remarks')?.value,
          'paymentDate': this._DatePipe.transform(this.TrasferForm.get('paymentDate')?.value, 'YYY-MM-dd')
        }
        this.ArrTransferModel=Model
        console.log("this.ArrTransferModel",this.ArrTransferModel);

        this.ArrTransfer.push(Model);
        this.TrasferForm.reset()
        console.log(this.ArrTransfer);
  }
  removeTrasfer(index:number){
    this.ArrTransfer.splice(index, 1)
    // this.PayedMoney -= Number(Money)
    // this.PayedMoneyforonecustomer-=Number(Money)
    // console.log(this.ArrTransfer);
    // this.getTotalAmountForTransfer()
  }
  ArrCashModel:any
  viewCash(){
    console.log("Good");
        let Model= {
          'remarks':this.CashForm.get('remarks')?.value==null?'':this.CashForm.get('remarks')?.value,
          'paymentDate': this._DatePipe.transform(this.CashForm.get('paymentDate')?.value, 'YYY-MM-dd')
        }
        this.ArrCashModel=Model
        this.ArrCash.push(Model);
        console.log(this.ArrCash);
        this.CashForm.reset()
   
    console.log(this.ArrCheck);
  }
  removeCash(index:number){
    this.ArrCash.splice(index, 1)
    // this.PayedMoney -= Number(Money)
    // this.PayedMoneyforonecustomer-=Number(Money)
    // console.log(this.ArrTransfer);
    // this.getTotalAmountForTransfer()
  }
  ArrAddaccountsToReciept:any[]=[]
  AddaccountsToRecieptModel:any
  AddaccountsToRecieptForm(){
    let Model={
      'mainAccountrId':this.accountsToRecieptForm.get('mainAccountrId')?.value,
      'subAccountId':this.accountsToRecieptForm.get('subAccountId')?.value==null?'':this.accountsToRecieptForm.get('subAccountId')?.value,
      'insurerId':this.accountsToRecieptForm.get('insurerId')?.value==null?'':this.accountsToRecieptForm.get('insurerId')?.value,
      'creditAmount':this.accountsToRecieptForm.get('creditAmount')?.value,
      'debitAmount':this.accountsToRecieptForm.get('debitAmount')?.value,
    }
    this.AddaccountsToRecieptModel=Model
    this.ArrAddaccountsToReciept.push(Model);
    this.accountsToRecieptForm.reset()
    console.log(this.ArrAddaccountsToReciept);
    
  }
  accountsToReciept(index:any){
    this.ArrAddaccountsToReciept.splice(index, 1)
  }
  getTotalAddaccountsToRecieptDebit(): number {
    return this.ArrAddaccountsToReciept.reduce((sum, item) => sum + (item.debitAmount || 0), 0);
  }

  getTotalAddaccountsToRecieptCredit(): number {
    return this.ArrAddaccountsToReciept.reduce((sum, item) => sum + (item.creditAmount || 0), 0);
  }
  getAbsoluteDifference(): number {
    return Math.abs(this.getTotalAddaccountsToRecieptDebit() - this.getTotalAddaccountsToRecieptCredit());
  }
  getBankName(bankId:string):string{
    let object = this.AllBanksToPayArr.find(item=>item.id==bankId)
    return object?.name
  }
  getaccountName(customerId:string):string{
    let object=this.AllAccounts.find((item: { id: string; })=>item.id==customerId)
    return object?.name
  }
  getaccountNamee(customerId:string):string{
    let object=this.AllAccountsForRecieptAndPayments.find((item: { id: string; })=>item.id==customerId)
    return object?.name
  }
  getsupaccountName(customerId:string):string{
    let object=this.AllSupArr.find((item: { id: string; })=>item.id==customerId)
    return object?.name
  }
 
  getinsurerName(customerId:string):string{
    let object=this.AllInsurars.find((item: { id: string; })=>item.id==customerId)
    return object?.name
  }
  
  AllSupArr:any[]=[]
  MainAccpuntID:any
GetAllSupAccounts(e:any){
  this.AllInsurars=[]
  this.accountTransactionsForm.get('subAccountId')?.setValue('')
  this.accountTransactionsForm.get('subOfSubAccountId')?.setValue('')
  console.log("ok");
  console.log(e.target.value);
  this.MainAccpuntID=e.target.value
  let object=this.AllAccountsForRecieptAndPayments.filter((item: { mainId: any; })=>item.mainId==e.target.value)
  console.log(object);
  this.AllSupArr=[]
  this.AllSupArr.push(...object)
  console.log(this.AllSupArr);
  if(this.AllSupArr.length==0){
      this._AccountsService.GetAllInsurerForAccount(this.MainAccpuntID).subscribe((data:any)=>{
        console.log(data);
        this.AllInsurars=data
      })
    }
}
AllInsurars:any[]=[]
GetAllinsurerss(e:any){
  console.log("TRue");
  
  console.log(e.target.value);
  this._AccountsService.GetAllInsurerForAccount(e.target.value).subscribe((data:any)=>{
    console.log("AllInsurars",this.AllInsurars);
    this.AllInsurars=data
    // if(this.AllInsurars=[]){
    //   this._AccountsService.GetAllInsurerForAccount(this.MainAccpuntID).subscribe((data:any)=>{
    //     console.log(data);
    //     this.AllInsurars=data
    //   })
    // }
  },error=>{
    console.log(error);
  })

}
  paymentsWayArr:any[]=[
    // {id:1,name:'Check'},
    // {id:2,name:'Bank Transfer'}
  ]
  getAllpayments(){
    this._PaymentsService.GetAllPaymentways().subscribe((data:any)=>{
      this.paymentsWayArr=data
      console.log("paymentsWayArr",this.paymentsWayArr);
    },error=>{
      console.log(error);
    })
  }
  AllBanksToPayArr:any[]=[]
  getAllBanksToPay(){
    this._PaymentsService.GetAllBanksToPay().subscribe((data:any)=>{
      console.log(data);
      this.AllBanksToPayArr=data
    },error=>{
      console.log(error);
    })
  }
  isLoading:boolean=false
  AllAccounts:any[]=[]
  GetAllAccounts(){
    this.isLoading = true;
    this._AccountsService.getAllAccounts().subscribe((data:any)=>{
      this.isLoading = false;
    console.log(data);
    this.AllAccounts = data
    },error =>{
    this.isLoading = false;
    console.log(error);  
    })
  }
  AllAccountsForRecieptAndPayments:any[]=[]
  GetAllAccountsForRecieptAndPayments(){
    this.isLoading = true;
    this._AccountsService.GetAllAccountsForRecieptAndPayments().subscribe((data:any)=>{
      this.isLoading = false;
    console.log(data);
    this.AllAccountsForRecieptAndPayments = data
    },error =>{
    this.isLoading = false;
    console.log(error);  
    })
  }
  isSubmitted1:boolean=false
AddPayment2(){
  this.isSubmitted1 = true;
  let Model ={
    bankId:this.BankNametest==null?'':this.BankNametest,
    entryDate: this._DatePipe.transform(this.cashEntryDate, 'YYY-MM-dd'),
    payee:this.cashPayee,
    amount:this.cashTotalAmmount,
    checkPayment:this.ArrCheckModel,
    bankTransfare:this.ArrTransferModel,
    cashPayment:this.ArrCashModel,
    accountsToRecieptDto:this.ArrAddaccountsToReciept
  }
  console.log(Model);
  this._PaymentsService.AddNewPayment(Model).subscribe(res=>{
    this.isSubmitted1 = false;
    console.log(res);
    Swal.fire('Good job!','Added Successfullyy','success')
    
    // this.TotalMony = 0
    // this.PayedMoney = 0
    // this.EntriesIdsArr = []
    $("#PaymnetWays").hide(500)
    $("#TrasferForm").hide(500)
    $("#NewPay").show(500)
    $(".removei").hide(500)
    $(".removeii").hide(500)
    $(".removeiii").hide(500)
    $("#searchBtn").hide(500)
    $("#Check1").hide(500)
    $("#UpdateClaimBtn").hide(500)
    $(".HideCheck").hide(500)
    $(".chechBox").hide(500)
    this._Router.navigate(['/Payment/PaymentDetails']);

  },error=>{
    this.isSubmitted1 = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
  })
}
  ngOnInit(): void {
    this.GetAllAccounts()
    this.getAllpayments()
    this.getAllBanksToPay()
    this.GetAllAccountsForRecieptAndPayments()
  }

}
