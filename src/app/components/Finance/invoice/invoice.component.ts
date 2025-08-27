import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
declare var $ : any
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  BrokerNameselected:boolean=false
  AllCustomersTypesArr2:any[]= [
    { id: 1, value: 'Cedent' },
    { id: 2, value: 'Broker' },
    { id: 3, value: 'Insured' },
    { id: 4, value: 'Indvidual' },
    { id: 5, value: 'Corperate' },
    { id: 6, value: 'Supplier' }
  ];
  loading:boolean=false
  term:any
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  AllAplicationinvoiceArr:any[]=[
    {id:1,invoiceNumber:10,customerName:'Tester',dueAmount:5000,invoiceDate: '2024-02-04',dueDate:'2024-01-04',
      accountTransactions:[
        {description:'Dec1',credit:600,debit:200,accountId:1,subAccountId:1,subOfSubAccountId:1}
      ]
    },
    {id:2,invoiceNumber:20,customerName:'Alkan',dueAmount:3000,invoiceDate: '2024-08-14',dueDate:'2024-07-07',
      accountTransactions:[
        {description:'Dec1',credit:900,debit:600,accountId:1,subAccountId:1,subOfSubAccountId:1}
      ]
    },
    {id:3,invoiceNumber:30,customerName:'Masr Insurance',dueAmount:1000,invoiceDate: '2024-03-6',dueDate:'2024-09-03',
      accountTransactions:[
        {description:'Dec1',credit:1000,debit:1000,accountId:4,subAccountId:1,subOfSubAccountId:1}
      ]
    },
  ]
  AllAccounts:any[] = [
    { id: 1, mainId: null, name: 'Cash', accountType: 'Asset', code: '101', openingBalance: 5000, discription: 'Cash in hand', transactionDate: '2024-02-04', typeDetails: 'Current Asset',accountTypeId:1 ,typeDetailsId: 1},
    { id: 2, mainId: 1, name: 'Bank Account', accountType: 'Asset', code: '102', openingBalance: 15000, discription: 'Bank balance', transactionDate: '2024-02-03', typeDetails: 'Savings Account',accountTypeId:2 ,typeDetailsId: 4 },
    { id: 3, mainId: 1, name: 'Accounts Receivable', accountType: 'Asset', code: '103', openingBalance: 12000, discription: 'Customer payments due', transactionDate: '2024-02-02', typeDetails: 'Receivable',accountTypeId:3 ,typeDetailsId: 5 },
    { id: 4, mainId: 2, name: 'Office Supplies', accountType: 'Expense', code: '201', openingBalance: 500, discription: 'Stationery and office expenses', transactionDate: '2024-02-01', typeDetails: 'Operational Expense',accountTypeId:4 ,typeDetailsId: 6 },
    { id: 5, mainId: 2, name: 'Sales Revenue', accountType: 'Income', code: '301', openingBalance: 20000, discription: 'Income from product sales', transactionDate: '2024-01-31', typeDetails: 'Revenue',accountTypeId:2 ,typeDetailsId: 4 },
    { id: 6, mainId: 3, name: 'Advertising Expense', accountType: 'Expense', code: '401', openingBalance: 2000, discription: 'Marketing and promotions', transactionDate: '2024-01-30', typeDetails: 'Operational Expense',accountTypeId:2 ,typeDetailsId: 4 },
    { id: 7, mainId: 6, name: 'Accounts Payable', accountType: 'Liability', code: '501', openingBalance: 8000, discription: 'Supplier payments due', transactionDate: '2024-01-29', typeDetails: 'Payable',accountTypeId:3 ,typeDetailsId: 5 },
    { id: 8, mainId: 7, name: 'Loan Payable', accountType: 'Liability', code: '502', openingBalance: 25000, discription: 'Outstanding loan amount', transactionDate: '2024-01-28', typeDetails: 'Long-term Liability',accountTypeId:1 ,typeDetailsId: 1 },
    { id: 9, mainId: 6, name: 'Rent Expense', accountType: 'Expense', code: '601', openingBalance: 5000, discription: 'Monthly office rent', transactionDate: '2024-01-27', typeDetails: 'Operational Expense',accountTypeId:4 ,typeDetailsId: 6 },
    { id: 10, mainId: null, name: 'Interest Income', accountType: 'Income', code: '701', openingBalance: 3000, discription: 'Income from bank interest', transactionDate: '2024-01-26', typeDetails: 'Other Income',accountTypeId:1 ,typeDetailsId: 1 }
  ]; 
  constructor(private _SharedService:SharedService,private _ToastrService:ToastrService){}
  InvoiceApplicationForm:FormGroup =new FormGroup ({
    'customerType':new FormControl('',[Validators.required]),
    'customerId':new FormControl('',[Validators.required]),
    'brokerInsuranceId':new FormControl(''),
    'insurareId':new FormControl('',[Validators.required]),
    'invoiceDate':new FormControl('',[Validators.required]),
    'dueDate':new FormControl('',[Validators.required]),
    'policyNumber':new FormControl('',[Validators.required]),
    'policyPeriodFrom':new FormControl('',[Validators.required]),
    'policyPeriodTo':new FormControl('',[Validators.required]),
    'currency':new FormControl('149',[Validators.required]),
    'invoiceRefNo':new FormControl('',[Validators.required]),
  })
  accountTransactionsForm:FormGroup=new FormGroup ({
    'description':new FormControl('',[Validators.required]),
    'debit':new FormControl(''),
    'credit':new FormControl(''),
    'mainAccountId':new FormControl('',[Validators.required]),
    'subAccountId':new FormControl(''),
    'subOfSubAccountId':new FormControl(''),
  })
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
//Pagination Methods
onTableDataChange(event:any){
this.page=event;
}
onTableSizeChange(event:any){
  this.tableSize=event.target.value;
  this.page=1;
}

accountTransactionArrr:any[]=[]
showAccountTransactions(accountTransaction:any){
  this.accountTransactionArrr=accountTransaction
  $(".overlayTypeDetails").fadeIn(300);
  $(".showtypeDetails").animate({ right: '0px' });
  console.log(this.accountTransactionArrr);
}

closeshowAccountTransactions() {
  $(".overlayTypeDetails").fadeOut(300);
  $(".showtypeDetails").animate({ right: '-30%' });
}
   //Format date
   formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
//// View ////
formattedDate:any 
today:Date = new Date();
isSuccess:boolean=false

AddNewInvoice(item:any){
  // $(".overlay").fadeOut(300);
  // $(".AddNew").animate({ right: '-80%' });
  $(".AddNewInvoce").show(600)
  this.isSuccess = false
  $("#AddNewfooter").show(300)
  this.InvoiceApplicationForm.enable();
  this.accountTransactionsForm.enable();
  this.InvoiceApplicationForm.reset()
  this.InvoiceApplicationForm.get('currency')?.setValue('149')
  this.accountTransactionsForm.reset()
  this.arrTest=[]
  this.dueAmount=0
  $('#dowFiles').hide(500)
  this.InvoiceNumber=''
  this.InvoiceId=undefined
  this.formattedDate = this.formatDate(this.today);
  this.InvoiceApplicationForm.get('policyPeriodFrom')?.setValue(this.formattedDate)
 
  $('#invicenumber').hide(300)
  $('#BalanceDue').hide(300)
  $('#BalanceDue').hide(300)
  $('#downFiles').hide(300)
}
closeAddNewTap(){
  $(".AddNewInvoce").hide(600);
}
InsurarNameselected:boolean=false
InsuranceNameselected:boolean=false

brokerNameArr:any[]=[]
InsuranceNameArr:any[]=[]
getBrokerNamesAndLists(e:any){
  console.log(e.target.value);
  if(e.target.value == 2){
    this.InvoiceApplicationForm.get('customerId')?.setValue('')
    this.InvoiceApplicationForm.get('insurareId')?.setValue('')
    this.InsurarNameselected=false
    // this._InvoicesService.GetAccountsForInvoic(2).subscribe((data:any)=>{
      // console.log(data);
      this.brokerNameArr=[{customerId:1,name:'broker1'},{customerId:2,'name':'broker2'}]
      this.InsuranceNameArr=[{customerId:1,name:'Insurance1'},{customerId:2,'name':'Insurance2'}]      
      this.BrokerNameselected=true
      this.InsuranceNameselected=false
    // })
  }else if(e.target.value == 1){
    this.InvoiceApplicationForm.get('customerId')?.setValue('')
    this.InvoiceApplicationForm.get('insurareId')?.setValue('')
    this.InvoiceApplicationForm.get('brokerInsuranceId')?.setValue('')
    this.BrokerNameselected=false
    // this._InvoicesService.GetAccountsForInvoic(1).subscribe((data:any)=>{
      // console.log(data);
      this.brokerNameArr=[{customerId:1,name:'broker1'},{customerId:2,'name':'broker2'}]
      this.InsuranceNameArr=[{customerId:1,name:'Insurance1'},{customerId:2,'name':'Insurance2'}]       
      this.BrokerNameselected=false
      this.InsuranceNameselected=true
    // })
  }
}
brokerMAINID:any
brokerIDd:any
AllMAINIDSAccountsArr:any[]=[]
selectinsuriornamesonbroker(e:any){ 
  console.log(e.target.value);
  console.log(this.brokerNameArr);
  this.brokerMAINID=e.target.value
  console.log(this.brokerMAINID);
  
  let object = this.brokerNameArr.find(item=>item.customerId == this.brokerMAINID)
  console.log(object);
  
  this.brokerIDd=object.accountId
  console.log(this.brokerIDd);
  
  // this._InvoicesService.GetSubAccountOfSpecificMain(this.brokerIDd).subscribe((data:any)=>{
    // console.log(data);
    // this.AllMAINIDSAccountsArr=data
    this.AllMAINIDSAccountsArr=[{id:1,name:'Ali'}]
    this.InsurarNameselected=true
  // })
}
MAINID:any
IDd:any
selectinsuriornames(e:any){
  console.log("5555");
  
  console.log(e.target.value);
  console.log(this.brokerNameArr);
  this.MAINID=e.target.value
  console.log(this.MAINID);
  
  let object = this.InsuranceNameArr.find(item=>item.customerId == this.MAINID)
  console.log(object);
  
  this.IDd=object.accountId
  console.log(this.IDd);
  
  // this._InvoicesService.GetSubAccountOfSpecificMain(this.IDd).subscribe((data:any)=>{
    // console.log(data);
    this.AllMAINIDSAccountsArr=[{id:1,name:'Ahmed'}]
    this.InsurarNameselected=true
  // })
}
BalanceDue:any
AllCurrinces:any[]=[
  {id: 0, value: 'United Arab Emirates dirham'},
  {id: 1, value: 'Afghan afghani'},
  {id: 2, value: 'Albanian lek'},
  {id:149,value:'USA'}
]
dueAmount:number=0
InvoiceNumber:any
AllSupArr:any[]=[]
GetAllSupAccounts(e:any){
  this.accountTransactionsForm.get('subOfSubAccountId')?.setValue('')
  console.log("ok");
  console.log(e.target.value);
  let object=this.AllAccounts.filter(item=>item.mainId==e.target.value)
  console.log(object);
  this.AllSupArr=[]
  this.AllSupArr.push(...object)
  console.log(this.AllSupArr);
}
AllSupSupArr:any[]=[]
GetAllSupSupAccounts(e:any){
  console.log("ok");
  console.log(e.target.value);
  console.log(this.AllSupArr);

  let object=this.AllAccounts.filter(item=>item.mainId==e.target.value)
  console.log(object);
  this.AllSupSupArr=[]
  this.AllSupSupArr.push(...object)
  console.log(this.AllSupSupArr);
}
arrTest:any[]=[]
View(){
  console.log("pk");
 
    let Model = Object.assign(this.accountTransactionsForm.value)
    this.arrTest.push(Model);
    console.log(this.arrTest);
    this.accountTransactionsForm.get('debit')?.setValue('')
    this.accountTransactionsForm.get('credit')?.setValue('')
    this.dueAmount=+(this.getTotalCredit() - this. getTotalDebit()).toFixed(3)
}
getTotalDebit(): number {
  return this.arrTest.reduce((sum, item) => sum + (item.debit || 0), 0);
}

getTotalCredit(): number {
  return this.arrTest.reduce((sum, item) => sum + (item.credit || 0), 0);
}

canSubmit(): boolean {
return this.getTotalDebit() === this.getTotalCredit();
}
remove(index:number){
  this.arrTest.splice(index, 1)
  this.dueAmount = +(this.getTotalCredit() - this.getTotalDebit()).toFixed(3);

}
getName(id:any){
  const account = this.AllAccounts.find(item=>item.id==id)
  // console.log(account);
  if(account){
    return account.name;
  }  
}
isDisabled(): boolean {
  const debit = this.accountTransactionsForm.get('debit')?.value;
  const credit = this.accountTransactionsForm.get('credit')?.value;
  return (debit == '' && credit == '') || (debit != '' && credit != '');
}
checked:boolean=true
checkone() {
  const debit = this.accountTransactionsForm.get('debit')?.value;
  const credit = this.accountTransactionsForm.get('credit')?.value;

  if ((debit == '' && credit == '') || (debit != null && credit != '')) {
    this.checked = true;
  } else if ((debit != '' && credit == '') || (debit == '' && credit != '')) {
    this.checked = false;
  }
}
InvoiceId:any
isClicked:boolean=false
AddApplicanInvoice(){
  this.accountTransactionsForm.get('credit')?.enable()
  this.accountTransactionsForm.get('debit')?.enable()
  this.isClicked=true
  let model=Object.assign(this.InvoiceApplicationForm.value,{accountTransactions:this.arrTest})
  console.log(model);
  // this._InvoicesService.AddNewFilledInvoice(model).subscribe((data:any)=>{
    this.isClicked=false
    // console.log(data);
    // this.InvoiceId=data.id
    this.InvoiceId=10
    this.InvoiceNumber=5
    this.BalanceDue==78
    $(".AddNew").show(600)
    this.isSuccess=true
    $('#BalanceDue').show(500)
    $('#invicenumber').show(500)
    // $('#dowFiles').show(500)
    this.InvoiceApplicationForm.disable();
    this.accountTransactionsForm.disable();
    this._ToastrService.success('','Invoice added successfully')
    // this._ToastrService.success('','Invoice added successfully', {
    //   toastClass: 'custom-toast-success'
    // });
    // Swal.fire('Good job!','Invoice added successfully','success');
    
      // this.GetAllFilledInvoices();

  // },error=>{
    // console.log(error);
    // this._ToastrService.error('',error.error)
    this.isClicked=false
  // })
}
AddNewInvoicee(){
  $(".AddNew").show(600)
  this.isSuccess = false
  $("#AddNewfooter").show(300)

  this.InvoiceApplicationForm.enable();
  this.accountTransactionsForm.enable();
  this.InvoiceApplicationForm.reset()
  this.InvoiceApplicationForm.get('currency')?.setValue('149')
  this.accountTransactionsForm.reset()
  this.arrTest=[]
  this.dueAmount=0
  $('#dowFiles').hide(500)
  this.InvoiceNumber=''
  this.InvoiceId=undefined
  this.formattedDate = this.formatDate(this.today);
  this.InvoiceApplicationForm.get('policyPeriodFrom')?.setValue(this.formattedDate)
  $('#invicenumber').hide(300)
  $('#BalanceDue').hide(300)
  $('#BalanceDue').hide(300)
}

ngOnInit(): void {  
  this._SharedService.changeData(false, 'Add new Invoice', '', true, true);
  this._SharedService.openModal$.subscribe((item: any) => {
    this.AddNewInvoice(item);
  });
  this._SharedService.currentMessage.subscribe(message => {
    if (message) {
      $("#filters").show(300);
    } else {
      $("#filters").hide(300);
    }
  }); 
  this.InvoiceApplicationForm.get('policyPeriodFrom')?.valueChanges.subscribe((value) => {
    if (value) {
      const policyPeriodTo = moment(value).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD');
      this.InvoiceApplicationForm.get('policyPeriodTo')?.setValue(policyPeriodTo, { emitEvent: false });
    }
  });
  this.accountTransactionsForm.valueChanges.subscribe(() => {
    this.checkone();
  });
 

}
}
