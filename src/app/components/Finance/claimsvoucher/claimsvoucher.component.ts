import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any
// import { CustomersService } from 'src/app/services/customers.service';
import { DatePipe } from '@angular/common';
import { ListsService } from 'src/app/services/lists.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
import { AccountsService } from 'src/app/services/accounts.service';
@Component({
  selector: 'app-claimsvoucher',
  templateUrl: './claimsvoucher.component.html',
  styleUrls: ['./claimsvoucher.component.scss'],
  providers:[DatePipe]
})
export class ClaimsvoucherComponent {
  today:Date = new Date();
  formData:any = new FormData()
  onClick() {
    console.log('Button clicked');
  }
  selectedFile:any
  selectedFiles: File[] = []; 
  items = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
    { id: 4, name: 'Option 4' },
    // Add more options as needed
  ];
  @ViewChild('fileInput') fileInput!: ElementRef;
  isDragging = false;
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;
  AllAccounts:any;
  isClicked:boolean =false;
  loading:boolean=false
  isLoading:boolean=false
  allSuppliersArr:any[]=[]
  SelectedDetaildTypes:any
  isChecked = false;
  constructor(private _DatePipe:DatePipe, private _ListsService:ListsService, private _SharedService:SharedService,private _AccountsService:AccountsService){}
  SupplierForm:FormGroup = new FormGroup({
    CustomerType: new FormControl(
      { value: '6', disabled: true }, 
      Validators.required              
    ),
    'Name':new FormControl('',[Validators.required]),
    'Email':new FormControl('',[Validators.required,Validators.email]),
    'PhoneNumber':new FormControl('',[this.nonNegativeValidator]),
    'MobileNumber':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'Fax':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'WebSite':new FormControl(''),
    'Other':new FormControl(''),
    'Notes':new FormControl(''),
    'Terms':new FormControl('',[Validators.required]),
    'OpeningBalance':new FormControl(''),
    'AsOf':new FormControl(''),
    'AccountId':new FormControl('',[Validators.required]),
    'CedantTRN':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'P_O_Box':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'StreetAdress':new FormControl('',[Validators.required]),
    'Emirates':new FormControl(''),
    'City':new FormControl('',[Validators.required]),
    'Country':new FormControl('',[Validators.required]),
    'Province':new FormControl('',[Validators.required]),
    'PostalCode':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'BusinessId_SocialInsuranceNo':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'AccountNumber':new FormControl('',[Validators.required,this.nonNegativeValidator]),
    'DefaultExpenseCategory':new FormControl('',[Validators.required]),
  })
  //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllSupplier()
    }
    onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllSupplier()
    }
  formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  nonNegativeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== null && control.value < 0) {
      return { 'negativeNumber': true };
    }
    return null;
  }
  @HostListener('document:keydown.escape', ['$event'])
    handleEscapeKey(event: KeyboardEvent) {
      this.closeAddNewTap(); 
    }
  formattedDate:any
  AddNew(){
    $(".overlay").fadeIn(300)
    $(".AddNew").animate({right: '0px'});
    this.formattedDate = this.formatDate(this.today);
    this.SupplierForm.get('AsOf')?.setValue(this.formattedDate)
    this.SupplierForm.get('CustomerType')?.setValue(6)
    this.SupplierForm.get('AccountId')?.enable();

  }
  closeAddNewTap(){
    $(".overlay").fadeOut(300)
    $(".AddNew").animate({right: '-40%'});
    this.SupplierForm.reset()
    this.selectedFiles=[]
  }
  OnEmrateSelected(e:any){
    if(e.target.value==233){
      $('#Emirateds').show(500)
      this.SupplierForm.get('Emirates')?.setValidators(Validators.required)
      this.SupplierForm.get('Emirates')?.updateValueAndValidity();    

    }else{
      $('#Emirateds').hide(500)
      this.SupplierForm.get('Emirates')?.setValue('')
      this.SupplierForm.get('Emirates')?.setValidators(null);
      this.SupplierForm.get('Emirates')?.updateValueAndValidity();

    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  }

  uploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
      
    }
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i) as File;
      if (file.size <= 20 * 1024 * 1024) { // Check if the file is less than or equal to 20 MB
        this.selectedFiles.push(file);
      } else {
        alert(`File ${file.name} exceeds the maximum allowed size of 20 MB.`);
      }
    }
    
  }
  getFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }
  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }
   // Handel To Add Customer
   AddSupplier(){
    this.isClicked=true
    this.SupplierForm.get('CustomerType')?.enable()
    let Model= Object.assign(this.SupplierForm.value,
      {AccountId:Number(this.SupplierForm.get('AccountId')?.value)},
      {CustomerType:Number(this.SupplierForm.get('CustomerType')?.value)},
      {Country: Number(this.SupplierForm.get('Country')?.value)},
      {
        OpeningBalance: this.SupplierForm.get('OpeningBalance')?.value === null || 
                        this.SupplierForm.get('OpeningBalance')?.value === '' 
                        ? '' 
                        : Number(this.SupplierForm.get('OpeningBalance')?.value)
      }    )
    console.log(Model);
      // Append Model
      for (const key of Object.keys(Model)){
      const value = Model[key];
      this.formData.append(key, value);
    }
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.formData.append('CustomerNoteFiles', this.selectedFiles[i]);
        // this.formData.append('CustomerNoteFiles[' + i + ']', this.selectedFiles[i]);
      }
    }
    for (var pair of this.formData.entries()){
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    this._ListsService.AddNewSupplier(this.formData).subscribe((res:any)=>{
      this.isLoading =false
      this.isClicked=false
      console.log(res);
      Swal.fire('Supplier Added Successfully','','success')
      this.SupplierForm.reset()
      this.selectedFiles=[]
      this.closeAddNewTap()
      this.getAllSupplier()
      this.formData = new FormData()
    },error=>{
      this.isLoading =false
      this.isClicked=false
      Swal.fire({icon: 'error',title:error.error,text:''})
      console.log(error);
      this.formData = new FormData()
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
  // Edit Customer
  SupplierId:any
  condition:boolean=true
  openModalToEdit(item:any){
   this.SupplierId=item.id
    this.condition=false
    this.AddNewAccType(item)
    this.SupplierForm.get('CustomerType')?.disable()

    this.SupplierForm.get('AccountId')?.disable();
    console.log(item);
    let object = this.AllAccounts.find((account: { id: any; })=>account.id==item.mainAccountId)
    let objCountr = this.AllCountriesArr.find(country=>country.value==item.country)
    console.log(objCountr);
    console.log("OK");
    
    this.SupplierForm.setValue({Name:item.name,Email:item.email,PhoneNumber:item.phoneNumber,
      MobileNumber:item.mobileNumber,Fax:item.fax,WebSite:item.webSite==null?'':item.webSite,Other:item.other==null?'':item.other,Notes:item.notes==null?'':item.notes,
      Terms:item.terms,
      OpeningBalance: item.debitBalance == null || item.debitBalance === 0
      ? (item.creditBalance == null || item.creditBalance === 0 ? '' : item.creditBalance)
      : item.debitBalance,
     //  OpeningBalance:item.openingBalance==null?'':item.openingBalance,
      AsOf: this._DatePipe.transform(item.asOf,'yyyy-MM-dd'),
      StreetAdress:item.streetAdress,P_O_Box:item.p_O_Box,CedantTRN:item.cedantTRN,
      City:item.city,Country:item.country,Province:item.province,
      PostalCode:item.postalCode,BusinessId_SocialInsuranceNo:item.businessId_SocialInsuranceNo,
      AccountNumber:item.accountNumber,DefaultExpenseCategory:item.defaultExpenseCategory,AccountId:object.id
      ,CustomerType:item.customerType,Emirates:item.emirates?item.emirates:''
    })
    this.selectedFiles=item.customerNoteFiles
    console.log("OK");
    // this.selectedFiles=
  }
  EditSupplier(){
    this.SupplierForm.get('CustomerType')?.enable()
    this.SupplierForm.get('AccountId')?.enable();

    this.isClicked=true
    let model = Object.assign({Id:this.SupplierId},this.SupplierForm.value,
      {
        OpeningBalance: this.SupplierForm.get('OpeningBalance')?.value === null || 
                        this.SupplierForm.get('OpeningBalance')?.value === '' 
                        ? '' 
                        : Number(this.SupplierForm.get('OpeningBalance')?.value)
      }  )
    console.log(model);
      // Append Model
      for (const key of Object.keys(model)){
      const value = model[key];
      this.formData.append(key, value);
    }
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        // this.formData.append('CustomerNoteFiles[' + i + ']', this.selectedFiles[i]);
        this.formData.append('CustomerNoteFiles', this.selectedFiles[i]);
      }
    }
    for (var pair of this.formData.entries()){
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    this._ListsService.EditSupplier(this.formData).subscribe((res:any)=>{
      this.isLoading =false
      this.isClicked=false
      console.log(res);
      Swal.fire('Supplier Updated Successfully','','success').then(() => {
        this.SupplierForm.reset()
        this.selectedFiles=[]
        this.closeAddNewTap()
        window.location.reload()
        this.getAllSupplier()
        this.formData = new FormData()
      });
      // this.SupplierForm.reset()
      // this.selectedFiles=[]
      // this.closeAddNewTap()
      // window.location.reload()
      // this.getAllSupplier()
      // this.formData = new FormData()
    },error=>{
      this.isLoading =false
      this.isClicked=false
      Swal.fire({icon: 'error',title:error.error,text:''})
      console.log(error);
      this.formData = new FormData()
    })
  }
  SupmitOrEditSupplier(){
    if(this.condition==true){
      this.AddSupplier()
    }else{
      this.EditSupplier()
    }
  }
  AllEmiratesArr:any[]=[]
  GetAllEmirates(){
    this._ListsService.getEmirates().subscribe((data:any)=>{
      console.log(data);
      this.AllEmiratesArr=data
    },error=>{
      console.log(error);
    })
  }
  AllCustomersTypesArr2:any[]=[]
  GetAllCustomersTypes2(){
    this._ListsService.getCustomerTypes2().subscribe((data:any)=>{
      console.log(data);
      this.AllCustomersTypesArr2=data
    },error=>{
      console.log(error);
    })
  }
  AllCustomersTypesArr:any[]=[]
  GetAllCustomersTypes(){
    this._ListsService.getCustomerTypes().subscribe((data:any)=>{
      // console.log(data);
      this.AllCustomersTypesArr=data
    },error=>{
      console.log(error);
    })
  }
  AllSupplierArr:any[]=[]
  getAllSupplier(){
    this.isLoading=true
    this._ListsService.GetAllSuppliers().subscribe((data:any)=>{
      console.log(data);
      this.AllSupplierArr=data
    },error=>{
      console.log(error);
    })
  }
  AllCountriesArr:any[]=[]
  GetAllcountry(){
    this._ListsService.getCountries().subscribe((data:any)=>{
      console.log(data);
      this.AllCountriesArr=data
    },error=>{
      console.log(error);
    })
  }

  // New AccountType 
  AddNewAccType(item: any){
    $(".overlayAccountType").fadeIn(300)
    $(".AddNewAccountType").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlayAccountType").fadeOut(300)
    $(".AddNewAccountType").animate({right: '-40%'});
  }
  ngOnInit(): void {
     this._SharedService.changeData(false, 'Add new supplier', '', true, true);
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
    this.GetAllAccounts(),
    this.getAllSupplier()
    this.GetAllCustomersTypes()
    this.GetAllCustomersTypes2()
    this.GetAllEmirates()
    this.GetAllcountry()
  }
}
