import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoicesService } from 'src/app/services/invoices.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';

// import { CustomersService } from 'src/app/services/customers.service';
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;
  AllAccounts:any;
  disabl:boolean=false
  isClicked:boolean =false;
  loading:boolean=false
  isLoading:boolean=false
  dueAmount:number=0
  InvoiceNumber:any
  InvoiceId:any
  CustomerEmail:any
  BalanceDue:any
  AllAplicationinvoiceArr:any[]=
  [
    // {
    //     "id": 1,
    //     "customerId": 33,
    //     "customerName": "Test Broker",
    //     "adress": null,
    //     "terms": null,
    //     "invoiceDate": "2025-03-13T00:00:00",
    //     "dueDate": "2025-03-13T00:00:00",
    //     "saleLocation": null,
    //     "isInvoiced": true,
    //     "invoiceNumber": "INV_2025_0001",
    //     "dueAmount": 9000.0,
    //     "createdAt": "2025-06-18T07:14:37.3038495-07:00",
    //     "createdBy": null,
    //     "accountTransactions": [
    //         {
    //             "uploadeInvoice": null,
    //             "uploadeInvoiceId": null,
    //             "filledInvoice": null,
    //             "filledInvoiceId": null,
    //             "id": 145,
    //             "description": "Premium",
    //             "debit": null,
    //             "credit": 10000.0,
    //             "createdAt": "2025-06-18T14:14:37.3385545Z",
    //             "createdBy": null,
    //             "invoiceData": null,
    //             "invoiceDataId": null,
    //             "account": null,
    //             "accountId": 28,
    //             "subAccountId": 1054,
    //             "subOfSubAccountId": 0,
    //             "journalEntryId": 146
    //         },
    //         {
    //             "uploadeInvoice": null,
    //             "uploadeInvoiceId": null,
    //             "filledInvoice": null,
    //             "filledInvoiceId": null,
    //             "id": 146,
    //             "description": "Commission",
    //             "debit": 1000.0,
    //             "credit": null,
    //             "createdAt": "2025-06-18T14:14:37.3388847Z",
    //             "createdBy": null,
    //             "invoiceData": null,
    //             "invoiceDataId": null,
    //             "account": null,
    //             "accountId": 631,
    //             "subAccountId": 637,
    //             "subOfSubAccountId": 0,
    //             "journalEntryId": 147
    //         }
    //     ]
    // }
]
  accountTransactionArrr:any[]=[]
  arrTest:any[]=[]
  constructor(private _InvoicesService:InvoicesService,private _AccountsService:AccountsService, private _SharedService:SharedService,
    private _ToastrService:ToastrService){}
  nonNegativeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== null && control.value < 0) {
      return { 'negativeNumber': true };
    }
    return null;
  }
  @HostListener('document:keydown.escape', ['$event'])
   handleEscapeKey(event: KeyboardEvent) {
     this.closeAddNewInvoice(); 
   }
  //Format date
  formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  InvoiceApplicationForm:FormGroup =new FormGroup ({
    'customerId':new FormControl('',[Validators.required]),
    'adress':new FormControl('',[Validators.required]),
    'terms':new FormControl('',[Validators.required]),
    'invoiceDate':new FormControl('',[Validators.required]),
    'dueDate':new FormControl('',[Validators.required]),
    'saleLocation':new FormControl('',[Validators.required]),
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
  //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.GetAllFilledInvoices()
    }
    onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.GetAllFilledInvoices()
    }
  // Create new invoice on supplier
  AddNewInvoice(){
    console.log("ok");
    this.InvoiceNumber=''
    this.InvoiceId=undefined
    $('#invicenumber').hide(300)
    $('#BalanceDue').hide(300)
    $(".AddNewTransaction").show(600)
  }
  closeAddNewInvoice(){
     $(".overlayAccountType").fadeOut(300)
    $(".AddNewAccountType").animate({right: '-40%'});
    $(".AddNewTransaction").hide(600);
    this.InvoiceApplicationForm.enable();
    this.accountTransactionsForm.enable();
    this.CustomerEmail=''
    this.InvoiceApplicationForm.reset()
    this.accountTransactionsForm.reset()
    this.arrTest=[]
    $('#dowFiles').hide(500)
    this.GetAllFilledInvoices()
  }
  showAccountTransactions(accountTransaction:any){
     $(".overlayTypeDetails").fadeIn(300)
    $(".showtypeDetails").animate({right: '0px'});
    this.accountTransactionArrr=accountTransaction
    console.log(this.accountTransactionArrr);
  }
  getEmailname(e:any){
    console.log(e.target.value);
    var object=this.AllSupplierArr.find(item=>item.id==e.target.value)
    console.log(object);
    this.CustomerEmail=object.email;
  }
  getName(id:any){
    const account = this.AllAccounts.find((item: { id: any; })=>item.id==id)
    // console.log(account);
    if(account){
      return account.name;
    }  
  }
  FIleName:any
getFilledInvoiceReports(EndPoint:any){
  this._InvoicesService.getFilledInvoiceReports(EndPoint,this.InvoiceId).subscribe(res=>{
    this.FIleName= res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
    let a= document.createElement('a');
    a.setAttribute('href',String(res.url))
    a.click()
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
getTotalDebit(): number {
  return this.arrTest.reduce((sum, item) => sum + (item.debit || 0), 0);
}

getTotalCredit(): number {
  return this.arrTest.reduce((sum, item) => sum + (item.credit || 0), 0);
}
View(){
  console.log("pk");
  // let object = this.arrTest.find(item=>item.description==this.accountTransactionsForm.get('description')?.value)
  // if(object==undefined){
    let Model = Object.assign(this.accountTransactionsForm.value,
      {debit: this.accountTransactionsForm.get('debit')?.value==''?null:this.accountTransactionsForm.get('debit')?.value},
      {credit: this.accountTransactionsForm.get('credit')?.value==''?null:this.accountTransactionsForm.get('credit')?.value},
      {subAccountId: this.accountTransactionsForm.get('subAccountId')?.value==''?null:this.accountTransactionsForm.get('subAccountId')?.value},
      {subOfSubAccountId: this.accountTransactionsForm.get('subOfSubAccountId')?.value==''?null:this.accountTransactionsForm.get('subOfSubAccountId')?.value},
    )
    this.arrTest.push(Model);
    console.log(this.arrTest);
    // this.accountTransactionsForm.reset()
    this.accountTransactionsForm.get('debit')?.setValue('')
    this.accountTransactionsForm.get('credit')?.setValue('')
    this.accountTransactionsForm.get('subAccountId')?.setValue('')
    this.accountTransactionsForm.get('subOfSubAccountId')?.setValue('')
    this.dueAmount=+(this.getTotalCredit() - this. getTotalDebit()).toFixed(3)
  // }else{
  //  this._ToastrService.show('Only one description can be added.')
  //  this.accountTransactionsForm.reset()
  // }

}
  remove(index:number){
    this.arrTest.splice(index, 1)
    this.dueAmount = +(this.getTotalCredit() - this.getTotalDebit()).toFixed(3);

    // this.TotoalSumInsured = this.TotoalSumInsured - (sumInsured*count)
  }
  Supplier:number=5
  AddApplicanInvoice(){
    this.accountTransactionsForm.get('credit')?.enable()
    this.accountTransactionsForm.get('debit')?.enable()
    // this.isClicked=true
    let model=Object.assign(this.InvoiceApplicationForm.value,{accountTransactions:this.arrTest},{customerType:6})
    console.log(model);
    this._InvoicesService.AddNewFilledInvoice(model).subscribe((data:any)=>{
      this.isClicked=false
      console.log(data);
      this.InvoiceId=data.id
      this.InvoiceNumber=data.invoiceNumber
      this.BalanceDue=data.dueAmount
      $('#BalanceDue').show(500)
      $('#invicenumber').show(500)
      $('#dowFiles').show(500)
      this.InvoiceApplicationForm.disable();
      this.accountTransactionsForm.disable();
      this.disabl=true
      this._ToastrService.success('','Invoice added successfully')
        this.GetAllFilledInvoices();

    },error=>{
      console.log(error);
      this._ToastrService.error('',error.error)
      this.isClicked=false
    })
  }
  GetAllFilledInvoices(){
    this.isLoading=true
    this._InvoicesService.GetAllFilledInvoices(6).subscribe((data:any)=>{
      console.log(data);
      this.AllAplicationinvoiceArr=data
      this.isLoading=false
    },error=>{
      console.log(error);
      this.isLoading=false
    })
  }
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
  AllSupplierArr:any[]=[
    // {id:1,name:'Abdulazim',email:'Abdulazim Mohamed@gmail.com'}
  ]
  getAllSupplier(){
    this.isLoading=true
    this._InvoicesService.GetAllSuppliers().subscribe((data:any)=>{
      console.log(data);
      this.AllSupplierArr=data
    },error=>{
      console.log(error);
    })
  }

  // New AccountType 
  AddNewAccType(item: any){
    this.InvoiceNumber=''
    this.InvoiceId=undefined
    $('#invicenumber').hide(300)
    $('#BalanceDue').hide(300)
    $(".AddNewTransaction").show(600)
    $(".overlayAccountType").fadeIn(300)
    $(".AddNewAccountType").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlayAccountType").fadeOut(300)
    $(".AddNewAccountType").animate({right: '-40%'});
     this.InvoiceApplicationForm.enable();
    this.accountTransactionsForm.enable();
    this.CustomerEmail=''
    this.InvoiceId=undefined    
    this.InvoiceApplicationForm.reset()
    this.accountTransactionsForm.reset()
    this.arrTest=[]
    $('#dowFiles').hide(500)
    this.GetAllFilledInvoices()
  }
    // Type Showing Details
  // showDetails(details:any){
  //   $(".overlayTypeDetails").fadeIn(300)
  //   $(".showtypeDetails").animate({right: '0px'});
  // }
  closeshowDetails(){
    $(".overlayTypeDetails").fadeOut(300)
    $(".showtypeDetails").animate({right: '-40%'});

  }
  ngOnInit(): void {
        this._SharedService.changeData(false, 'Add Expenses Voucher', 'ExpensesVoucher', true, true);
    this._SharedService.openModal$.subscribe((item: any) => {
      this.AddNewAccType(item);
    });
      this._SharedService.currentMessage.subscribe(message => {
      if (message) {
        $("#filters").show(300);
      } else {
        $("#filters").hide(300);
      }
    });
    this.GetAllFilledInvoices()
    this.GetAllAccountsForRecieptAndPayments()
    this.GetAllAccounts()
    this.getAllSupplier()
  }
}



