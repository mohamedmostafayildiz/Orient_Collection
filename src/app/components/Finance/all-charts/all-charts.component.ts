  import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
  import { SharedService } from 'src/app/services/shared.service';
  import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
  declare var $ : any
  import { AccountsService } from 'src/app/services/accounts.service';
import { DxTreeListComponent } from 'devextreme-angular';
import { TransactionService } from 'src/app/services/transaction.service';
  @Component({
    selector: 'app-all-charts',
    templateUrl: './all-charts.component.html',
    styleUrls: ['./all-charts.component.scss'],
    providers:[DatePipe]
  })
export class AllChartsComponent implements OnInit {
  filterText: string = '';
  term:any
  @ViewChild('treeList', { static: false }) treeList!: DxTreeListComponent;
  today:Date = new Date();
  isChecked:boolean = false
  isClicked:boolean =false;
  isLoading:boolean =false;
  loading:boolean =false;
  isEditing:boolean=false
  AllAccounts:any;
  AccountType:any
  formattedDate:any
  SelectedDetaildTypes:any
  AddNewAccountForm:FormGroup =new FormGroup ({
    "name" : new FormControl('',[Validators.required]),
    "transactionDate" : new FormControl('',[Validators.required]),
    "accountTypeId" : new FormControl('',[Validators.required]),
    "typeDetailsId" : new FormControl('',[Validators.required]),
    "mainAccountId" : new FormControl(''),
    "openingBalance" : new FormControl(),
    "discription" : new FormControl(''),
    "oldCode" : new FormControl(''),
  })
  constructor(private _TransactionService:TransactionService,private _AccountsService:AccountsService,private _SharedService:SharedService,
    private _ToastrService:ToastrService, private _DatePipe:DatePipe){}
    nonNegativeValidator(control: AbstractControl): { [key: string]: boolean } | null {
      if (control.value !== null && control.value < 0) {
        return { 'negativeNumber': true };
      }
      return null;
    }
    // Filter
    applyFilter() {
      if (this.treeList && this.treeList.instance) {
        this.treeList.instance.filter(['name', 'contains', this.filterText]);
      }
    }
  // Chart of account templets
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
  formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  AddNew(){
    $(".overlay").fadeIn(300)
    $(".AddNew").animate({right: '0px'});
    $("#Application_Form").show(300)
    $("#File_Form").hide(300)
    this.formattedDate = this.formatDate(this.today);
    this.AddNewAccountForm.get('transactionDate')?.setValue(this.formattedDate)
    this.AddNewAccountForm.get('accountTypeId')?.enable();
    this.AddNewAccountForm.get('typeDetailsId')?.disable();
    this.condition = true
  }
  AddNewaccountfile(){
    $(".overlay").fadeIn(300)
    $(".AddNew").animate({right: '0px'});
    $("#Application_Form").hide(300)
    $("#File_Form").show(300)
  }
  closeAddNewTap(){
    $(".overlay").fadeOut(300)
    $(".AddNew").animate({right: '-40%'});
    this.AddNewAccountForm.reset()
    this.isChecked=false
    $('#parentAccount').hide(500)
    this.condition = true
    this.GetAllAccounts();
    window.location.reload()
  }
  // Chart Accounts Table
  handleRowClick(event: any) {
    console.log('Row clicked:', event.data);
  }
   // Called when editing starts
   onEditingStart(e: any) {
    this.isEditing = true;
  }
  // Called when editing is canceled
  onEditingCancel(e: any) {
    this.isEditing = false;
  }
  // Called when editing is saved
  onEditingEnd(e: any) {
    this.isEditing = false;
  }
  clickedRowData:any
  UpdateId:any
  condition:boolean=true
  handleCustomButtonClick(e: any) {
     this.clickedRowData = e.row.data;
    console.log("Custom button clicked for row:", this.clickedRowData);
    this.AddNew()
    this.condition=false
    console.log(this.clickedRowData.typeDetailsId);
    this.UpdateId=this.clickedRowData.id
    if ( this.UpdateId) {
      const currentAccountId = this.UpdateId; 
      console.log(currentAccountId);
      // Filter out the current account and its sub-accounts
      this.AllAccounts = this.AllAccounts.filter((account: any) => {
        // Exclude the current account and its direct sub-accounts based on mainId
        return account.id !== currentAccountId && account.mainId !== currentAccountId;
      });
    }

    console.log(this.AllAccounts);

    this.AccountObject  = this.AllAccounts.find((item: { id: any; })=>item.id == this.clickedRowData.mainId)
    
    this.AddNewAccountForm.setValue({
      name:this.clickedRowData.name,
      transactionDate: this._DatePipe.transform(this.clickedRowData.transactionDate,'yyyy-MM-dd'),
      discription:this.clickedRowData.discription==null?"":this.clickedRowData.discription,
      // openingBalance:this.clickedRowData.debitBalance==null?'':this.clickedRowData.creditBalance,
      openingBalance: this.clickedRowData.debitBalance == null || this.clickedRowData.debitBalance === 0
      ? (this.clickedRowData.creditBalance == null || this.clickedRowData.creditBalance === 0 ? '' : this.clickedRowData.creditBalance)
      : this.clickedRowData.debitBalance,
      oldCode:this.clickedRowData.oldCode==null?"":this.clickedRowData.oldCode,
      accountTypeId:this.clickedRowData.accountTypeId,
      typeDetailsId:this.clickedRowData.typeDetailsId,
      mainAccountId:this.AccountObject==null?'':this.AccountObject,
    })
    // this.getAccountType({ target: { value: this.clickedRowData.accountTypeId } });
        this.getAccountType({ value: this.clickedRowData.accountTypeId });

    // if(this.AddNewAccountForm.get('mainAccountId')?.value == ''){
    if(this.AccountObject == null){
      this.isChecked=false
      $("#parentAccount").hide(300)
      this.AddNewAccountForm.get('typeDetailsId')?.enable();
    }else{
      this.isChecked=true
      $("#parentAccount").show(300)
      this.AddNewAccountForm.get('accountTypeId')?.disable();
      this.AddNewAccountForm.get('typeDetailsId')?.disable();
    }
  }
  // Transaction Report For All Accounts
  FIleName:any
  getTransactionReports(){
    this.isClicked=true
    this._TransactionService.getTransactionReports().subscribe(res=>{
      this.isClicked=false
      this.FIleName= res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let a= document.createElement('a');
      a.setAttribute('href',String(res.url))
      a.click()
    },error=>{
      this.isClicked=false
      console.log(error);
      this._ToastrService.error(error.error)
    })
  }
  GetAllAccounts(){
      this.isLoading = true;
      this._AccountsService.getAllAccounts().subscribe((data:any)=>{
        this.isLoading = false;
      console.log(data);
      this.AllAccounts = data
     
      },(error: { error: any; }) =>{
      this.isLoading = false;
      console.log(error);  
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  
      })
  }
  GetAllAccountTyps(){
      this.isLoading = true;
      this._TransactionService.GetAllTypes().subscribe((data:any)=>{
        console.log("AccountType",data);
        this.isLoading = false;
        this.AccountType=data
      },error=>{
        console.log(error);
        this.isLoading = false;
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      })
    }
  getAccountType(event: any) {
    console.log(event);
    
    const selectedAccountTypeId = event.value;
    const selectedAccountType = this.AccountType.find((item: { id: any; }) => item.id == selectedAccountTypeId);
        console.log("selectedAccountType",selectedAccountType);
    if (selectedAccountType) {
      this.AddNewAccountForm.get('typeDetailsId')?.enable();
      this.SelectedDetaildTypes = selectedAccountType.details || [];
      console.log(this.SelectedDetaildTypes);
    } else {
      this.SelectedDetaildTypes = [];
      this.AddNewAccountForm.get('typeDetailsId')?.setValue(null);
    }
  }
  getParent(e:any){ 
    console.log(e.target.checked);
    this.isChecked = e.target.checked;
    if(this.isChecked==true){
      $("#parentAccount").show(300)
        this.AddNewAccountForm.get('accountTypeId')?.disable();
        this.AddNewAccountForm.get('typeDetailsId')?.disable();
        this.AddNewAccountForm.get('accountTypeId')?.setValue('');
        this.AddNewAccountForm.get('typeDetailsId')?.setValue('');
        this.AddNewAccountForm.get('mainAccountId')?.setValidators(Validators.required);
      }else{
      $("#parentAccount").hide(300)
      this.AddNewAccountForm.get('mainAccountId')?.setValue('')
      this.AddNewAccountForm.get('mainAccountId')?.clearValidators();
      this.AddNewAccountForm.get('accountTypeId')?.setValue('');
      this.AddNewAccountForm.get('typeDetailsId')?.setValue('');
      this.AddNewAccountForm.get('accountTypeId')?.enable();
      this.AddNewAccountForm.get('typeDetailsId')?.disable();
    }
    this.AddNewAccountForm.get('mainAccountId')?.updateValueAndValidity();

  }
  ACCOUNTID:any
  ACCOUNTNAME:any  
  getaccountname(e:any){
    this.ACCOUNTID = e.target.value
    const selectedAccountType = this.AllAccounts.find((item: { id: any; }) => item.id == this.ACCOUNTID);
    this.ACCOUNTNAME = selectedAccountType.name
    if(this.AddNewAccountForm.get('name')?.value == this.ACCOUNTNAME){
      this._ToastrService.show('This account already existed')
    }
    const selectedAccount = this.AllAccounts.find((item: { id: any; }) => item.id == this.AddNewAccountForm.get('mainAccountId')?.value);
    console.log(selectedAccount);
    if (selectedAccount) {
      this.AddNewAccountForm.get('accountTypeId')?.setValue(selectedAccount.accountTypeId)
      this.AddNewAccountForm.get('typeDetailsId')?.setValue(selectedAccount.typeDetailsId)
    }
    this.getAccountType({ target: { value: selectedAccount.accountTypeId } });
    this.AddNewAccountForm.get('typeDetailsId')?.disable();

  }
  AccountObject:any
  getaccountname1(e:any){
    console.log(e);
    console.log(e.value);
    this.AccountObject=e.value
    
    this.ACCOUNTID = this.AccountObject.id
    console.log("this.ACCOUNTID",this.ACCOUNTID);
    
    // Find the selected account type
    const selectedAccountType = this.AllAccounts.find((item: { id: any; }) => item.id == this.ACCOUNTID);
    this.ACCOUNTNAME = selectedAccountType.name
    console.log("this.ACCOUNTNAME",this.ACCOUNTNAME);
    
    if(this.AddNewAccountForm.get('name')?.value == this.ACCOUNTNAME){
      this._ToastrService.show('This account already existed')
    }
    const selectedAccount = this.AllAccounts.find((item: { id: any; }) => item.id == this.AddNewAccountForm.get('mainAccountId')?.value.id);
    console.log(selectedAccount);
    console.log("Ok");
    
    if (selectedAccount) {
      this.AddNewAccountForm.get('accountTypeId')?.setValue(selectedAccount.accountTypeId)
      this.AddNewAccountForm.get('typeDetailsId')?.setValue(selectedAccount.typeDetailsId)
    }
    this.getAccountType({ value: selectedAccount.accountTypeId });
    // this.getAccountType({ target: { value: selectedAccount.accountTypeId } });
    this.AddNewAccountForm.get('typeDetailsId')?.disable();

  }
   // Add Account or Sup 
  AddAccountOrsupaccount(){
    this.AddNewAccountForm.get('accountTypeId')?.enable();
    this.AddNewAccountForm.get('typeDetailsId')?.enable();
    this.isClicked=true
    let Model= Object.assign(this.AddNewAccountForm.value,
      // {openingBalance:this.AddNewAccountForm.get('openingBalance')?.value==''?'':Number(this.AddNewAccountForm.get('openingBalance')?.value)}
      {
        openingBalance: this.AddNewAccountForm.get('openingBalance')?.value === null || 
                        this.AddNewAccountForm.get('openingBalance')?.value === '' 
                        ? null 
                        : Number(this.AddNewAccountForm.get('openingBalance')?.value)
      },
      {
        mainAccountId:this.AccountObject==null?'':this.AccountObject.id
      }
    )
    console.log('Model',Model);
    console.log(this.AddNewAccountForm.get('mainAccountId')?.value,"kkj");
    
    if(this.isChecked == false){
      this._AccountsService.addnewAccount(Model).subscribe((data:any)=>{
        console.log("addnewAccount call successful");
        console.log(data);
        this.isClicked=false
        Swal.fire('Good job!','Account Added Successfully','success').then(() => {
          this.GetAllAccounts()
          this.closeAddNewTap();
          this.AddNewAccountForm.reset()
        });

      
      },error=>{
        this.isClicked=false
        console.log(error);
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      })
    }else{
      console.log("AddSupAccount call successful");
      this._AccountsService.AddSupAccount(Model).subscribe((data:any)=>{
        console.log(data);
        this.isClicked=false
        Swal.fire('Good job!','SupAccount Added Successfully','success').then(() => {
          this.GetAllAccounts()
          this.closeAddNewTap();
          this.AddNewAccountForm.reset()
        });
      },error=>{
        this.isClicked=false
        console.log(error);
        Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      })
    }
  }
  EDitAccount(){
    this.AddNewAccountForm.get('accountTypeId')?.enable();
    this.AddNewAccountForm.get('typeDetailsId')?.enable();
    this.isClicked=true
    let Model = Object.assign({id:this.UpdateId},this.AddNewAccountForm.value,{mainAccountId:this.AddNewAccountForm.get('mainAccountId')?.value==''?null:this.AddNewAccountForm.get('mainAccountId')?.value},
    // {openingBalance:this.AddNewAccountForm.get('openingBalance')?.value==''?null:Number(this.AddNewAccountForm.get('openingBalance')?.value)}
    {
      openingBalance: this.AddNewAccountForm.get('openingBalance')?.value === null || 
                      this.AddNewAccountForm.get('openingBalance')?.value === '' 
                      ? null 
                      : Number(this.AddNewAccountForm.get('openingBalance')?.value)
    },
    {
      mainAccountId:this.AddNewAccountForm.get('mainAccountId')?.value==null?'':this.AddNewAccountForm.get('mainAccountId')?.value.id
    }
  )
    console.log(Model);
    this._AccountsService.UpdateAccount(Model).subscribe((data:any)=>{
      console.log(data);
      this.isClicked=false
      Swal.fire('Good job!', 'Account Updated Successfully', 'success').then(() => {
        this.GetAllAccounts();
        this.closeAddNewTap();
        window.location.reload(); 
        this.AddNewAccountForm.reset();
      });
    },error=>{
      this.isClicked=false
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
    
  }
  SupmitOrEditAccount(){
    if(this.condition==true){
      this.AddAccountOrsupaccount()
    }else{
      this.EDitAccount()
    }
  }
  FILEeName:any
  getTempleteFile(){
    this._AccountsService.GetChartofAccountTemplete().subscribe(res=>{
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FILEeName= 'Chart of Account.xlsx'
      let a= document.createElement('a');
      a.download=this.FILEeName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
  // INVOICES 
  selectedChartofAccountFile:any=''
  uploadLegacyDetailsFile(event: any){
    // Get File Object
    this.selectedChartofAccountFile = event.target.files[0] ?? null;
    event.target.value='' 
  }
  
  //Save File
  isClickedDocumnet:boolean=false
  Save(){
    var formData = new FormData()
    formData.append('File',this.selectedChartofAccountFile);
    this.isClickedDocumnet=true
    this._AccountsService.UploadChartofAccountTemplete(formData).subscribe((res:any)=>{
      console.log(res);
      this.isClickedDocumnet=false
      this.selectedChartofAccountFile=''
      // Swal.fire(res,'','success')
      this._ToastrService.success('File Uploaded successfully' )
    },error=>{
      console.log('error');
      console.log(error);
      // Swal.fire({icon: 'error',title:error.error,text:''})
      this._ToastrService.error(error.error, )
      this.isClickedDocumnet=false
    })
  }
  
ngOnInit(): void {
  this._SharedService.changeData(false, '', '', true, false);
    this._SharedService.openModal$.subscribe((item: any) => {
      this.AddNew();
    });
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });
    this.GetAllAccounts()
    this.GetAllAccountTyps()
  }
}
