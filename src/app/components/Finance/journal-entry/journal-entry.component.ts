import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any
import { PaymentsService } from 'src/app/services/payments.service';
import { DatePipe } from '@angular/common';
import { AccountsService } from 'src/app/services/accounts.service';
import { Router } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ListsService } from 'src/app/services/lists.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss'],
    providers:[DatePipe]
})
export class JournalEntryComponent {
  today:Date = new Date();
  loading:boolean=false
  entryDate:any
  dueAmount:number=0
  journalVoucherCurrency:number=150
  isSuccess: boolean = false;
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;
  InvoiceId:any

  constructor(private _InvoicesService:InvoicesService,private _PaymentsService:PaymentsService,private _DatePipe:DatePipe, private _AccountsService:AccountsService,
    private _Router:Router,private _ToastrService:ToastrService,private _ListsService:ListsService, private _SharedService:SharedService){}
  accountTransactionsForm:FormGroup=new FormGroup ({
    'description':new FormControl('',[Validators.required]),
    'description2':new FormControl(''),
    'debit':new FormControl('',this.nonNegativeValidator),
    'credit':new FormControl('',this.nonNegativeValidator),
    'mainAccountId':new FormControl('',[Validators.required]),
    'subAccountId':new FormControl(''),
    'subOfSubAccountId':new FormControl(''),
  })
  InvoiceApplicationForm:FormGroup =new FormGroup ({
    'customerId':new FormControl('',[Validators.required]),
    'adress':new FormControl('',[Validators.required]),
    'terms':new FormControl('',[Validators.required]),
    'invoiceDate':new FormControl('',[Validators.required]),
    'dueDate':new FormControl('',[Validators.required]),
    'saleLocation':new FormControl('',[Validators.required]),
  })
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
  this.GetAllJournalVoucher()
  }
  onTableSizeChange(event:any){
  this.tableSize=event.target.value;
  this.page=1;
  this.GetAllJournalVoucher()
  }
  // Journal_Voucher File
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  showDropdown() {
    this.isDropdownOpen = true;
  }

  hideDropdown() {
    this.isDropdownOpen = false;
  }
  formattedDate:any
  arrTest:any[]=[]
  AddNewInvoiceJournal_Voucher(){
    $(".AddNewJournal_Voucher").show(600)
    $("#AddNewfooterJournal_Voucher").show(300)
    $("#Application_Form").show(300)
    $("#File_Form").hide(300)
    $(".JournalAccountTransactionDetails").hide(600)
    this.journalVoucherCurrency=150
    this.isSuccess=false
    this.accountTransactionsForm.enable();
    this.entryDate=''
    this.accountTransactionsForm.reset()
    this.arrTest=[]
    this.dueAmount=0
    // $("#AddNewfooter").show(300)
    this.formattedDate = this.formatDate(this.today);
    this.InvoiceApplicationForm.get('policyPeriodFrom')?.setValue(this.formattedDate)
  }
  closeAddNewTapJournal_Voucher(){
    $(".AddNewJournal_Voucher").hide(600);
    this.accountTransactionsForm.enable();
    this.entryDate=''
    this.accountTransactionsForm.reset()
    this.arrTest=[]
    this.dueAmount=0
    this.GetAllJournalVoucher()
  }
  AddNewInvoiceJournal_VoucherByFile(){
    $(".AddNewJournal_Voucher").show(600)
    $("#Application_Form").hide(300)
    $("#AddNewfooterJournal_Voucher").hide(300)
    $("#File_Form").show(300)
    $(".JournalAccountTransactionDetails").hide(600)
  }
  accountTransactionArrr:any[]=[]
  showaccountjournalvoucherdetails(item:any){
    this.accountTransactionArrr=item
    console.log(this.accountTransactionArrr);
    
    $(".overlay5").fadeIn(300)
    $(".AddNew5").animate({right: '0px'});
    console.log("ok");
    
  }
  closeshowinvoiceDetails(){
    $(".overlay5").fadeOut(300)
    $(".AddNew5").animate({right: '-40%'});
  }
  
  // File 
  selectedJournalVoucherFile:any=''
  uploadJournalVoucherFile(event: any){
    // Get File Object
    this.selectedJournalVoucherFile = event.target.files[0] ?? null;
    event.target.value='' 
  }
  VoucherFIleName:any
  getTempleteFile(){
    this._InvoicesService.GetJournalVoucherFile().subscribe(res=>{
      console.log(res);
      let blob:Blob = res.body as Blob
      this.VoucherFIleName= 'Voucher Journal Tempelet.xlsx'
      let a= document.createElement('a');
      a.download=this.VoucherFIleName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
   //Save File
   isClickedDocumnet:boolean=false
   FileDetails:any
   Save(){
     var formData = new FormData()
     formData.append('file',this.selectedJournalVoucherFile);
     console.log(this.selectedJournalVoucherFile);
     
     this.isClickedDocumnet=true
     this._InvoicesService.UploadJournalVoucherFile(formData).subscribe((res:any)=>{
       console.log(res);
       this.FileDetails=res
       this.isClickedDocumnet=false
       this.selectedJournalVoucherFile=''
       // Swal.fire(res,'','success')
       this._ToastrService.success('File Uploaded successfully' )
       $(".JournalAccountTransactionDetails").show(600)

     },error=>{
       console.log('error');
       console.log(error);
       // Swal.fire({icon: 'error',title:error.error,text:''})
       this._ToastrService.error(error.error, )
       this.isClickedDocumnet=false
     })
   }
  
  AllJournalVoucherArr:any[]=[]
GetAllJournalVoucher(){
  this.loading=true
  this._InvoicesService.GetAllVouchers().subscribe((data:any)=>{
    console.log("AllVouchers",data)
    this.AllJournalVoucherArr=data
    this.loading=false
  },error=>{
    console.log(error);
  })
}
hasError: boolean = false;
AllAccountsForRecieptAndPayments:any[]=[]
  GetAllAccountsForRecieptAndPayments(){
    this.hasError=false
    this.isLoading = true;
    this._AccountsService.GetAllAccountsForRecieptAndPayments().subscribe((data:any)=>{
      this.isLoading = false;
    console.log(data);
    this.AllAccountsForRecieptAndPayments = data
    },error =>{
    this.isLoading = false;
    this.hasError=true

    console.log(error); 
    // Swal.fire({icon: 'error',title:error.error,text:''}) 
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
// if(this.AllSupArr.length==0){
//     this._AccountsService.GetAllInsurerForAccount(this.MainAccpuntID).subscribe((data:any)=>{
//       console.log(data);
//       this.AllInsurars=data
//     })
//   }
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
AllSupSupArr:any[]=[]
GetAllSupSupAccounts(e:any){
  console.log("ok");
  console.log(e.target.value);
  console.log(this.AllSupArr);

  let object=this.AllAccounts.filter((item: { mainId: any; })=>item.mainId==e.target.value)
  console.log(object);
  this.AllSupSupArr=[]
  this.AllSupSupArr.push(...object)
  console.log(this.AllSupSupArr);
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

View(){
  console.log("pk");
  // let object = this.arrTest.find(item=>item.description==this.accountTransactionsForm.get('description')?.value)
  // if(object==undefined){
    let Model = Object.assign(this.accountTransactionsForm.value,{subAccountId:this.accountTransactionsForm.get('subAccountId')?.value==''?null:this.accountTransactionsForm.get('subAccountId')?.value}
  ,{subOfSubAccountId:this.accountTransactionsForm.get('subOfSubAccountId')?.value==''?null:this.accountTransactionsForm.get('subOfSubAccountId')?.value}
,{debit:this.accountTransactionsForm.get('debit')?.value==''?null:this.accountTransactionsForm.get('debit')?.value}
,{credit:this.accountTransactionsForm.get('credit')?.value==''?null:this.accountTransactionsForm.get('credit')?.value})
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
FIleName:any
getFilledInvoiceReports(EndPoint:any){
  this._InvoicesService.getFilledInvoiceReports(EndPoint,this.InvoiceId).subscribe(res=>{
    this.FIleName= res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
    let a= document.createElement('a');
    a.setAttribute('href',String(res.url))
    a.click()
  })
}
isClicked:boolean=false
SaveJournal_VoucherInvoice(){
  this.isClicked=true
  let model=Object.assign({entryDate:this.entryDate},{currency:Number(this.journalVoucherCurrency)},{accountTransactions:this.arrTest})
  console.log(model);
  this._InvoicesService.NewFilledJournalVoucher(model).subscribe((data:any)=>{
    this.isClicked=false
    $(".AddNewJournal_Voucher").show(600)
    this.isSuccess=false
      console.log(data);
    this.isSuccess=true
      this.accountTransactionsForm.disable();
    this._ToastrService.success('','Journal voucher invoice added successfully')
  },error=>{
      console.log(error);
      this.isClicked = false
      this._ToastrService.error('',error.error)
      // Swal.fire({icon: 'error',title:error.error,text:''})
  })
}
    
getTotalDebit(): number {
  return this.arrTest.reduce((sum, item) => sum + (item.debit || 0), 0);
}

getTotalCredit(): number {
  return this.arrTest.reduce((sum, item) => sum + (item.credit || 0), 0);
}
getName(id:any){
  const account = this.AllAccounts.find((item: { id: any; })=>item.id==id)
  // console.log(account);
  if(account){
    return account.name;
  }  
}

AllAccounts:any[]=[]
isLoading:boolean=false
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
AllCurrinces:any[]=[]
GetAllCurrinces(){
  this._ListsService.getCurrencies().subscribe((data:any)=>{
    console.log("AllCurrinces",data)
    this.AllCurrinces=data
  })
}
  ngOnInit(): void {
     this._SharedService.changeData(false, '', '', true, false);
    this.accountTransactionsForm.valueChanges.subscribe(() => {
      this.checkone();
    });
    this.GetAllAccounts()
    this.GetAllAccountsForRecieptAndPayments()
    this.GetAllCurrinces()
    this.GetAllJournalVoucher()
  }

}
