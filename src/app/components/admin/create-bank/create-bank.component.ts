import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
declare var bootstrap: any;

import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)
  AllBanks:any[]=[]
  loading:boolean=false
  EditId:any
  term:any
  accountNumber:any='';
  isClicked:boolean =false;

  AddBankForm:FormGroup =new FormGroup({
    'bankName':new FormControl('',[Validators.required]),
    'bankCode':new FormControl('',[Validators.required]),
    'bankAccount':new FormControl('',[Validators.required]),
    'iBan':new FormControl(''),
    'swiftCode':new FormControl(''),
});
  constructor(private _SharedService:SharedService, private _Router:Router,private _AuthService:AuthService ,private _PolicyService:PolicyService, private _ToastrService:ToastrService){
    if(!this.permissions.includes('Permissions.Banks.View')){
      this._ToastrService.show('عفوا ! ليس لديك صلاحية')
      this._Router.navigate(['/Forbidden'])
    }
  }
    //Delete Bank 
  idDelete:any
  getIdToDelete(id:any){
    this.idDelete = id;
  }
  deleteBank(){
    this.loading =true;
    this.isClicked =true;
    this._PolicyService.DeleteBankById(this.USERID).subscribe(data=>{
      this.isClicked =false;
      this.loading =false;
      console.log(data);
      this.getAllBanks()
      this.closeNewAccType()
      this._SharedService.setAlertMessage(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });  
    },error=>{
      this.loading =false;
      this.isClicked =false;
      console.log(error);
    })
  }
      // Get All
  getAllBanks(){
    this.loading=true;
    this._PolicyService.getAllBanks().subscribe((data:any)=>{
      this.AllBanks =data;
      this.loading=false;
      console.log(this.AllBanks);
    },error=>{
      this.loading=false;
    })
  }
  BankAccounts:any;
    //get Bank By Id
  // getBankAccounts(BankAccounts:any){
  //   this.BankAccounts = BankAccounts;
  //   console.log(this.BankAccounts);
    
  // }
    //get Bank By Id
  // getBankById(id:any){
  //   console.log(id);
  //   this._PolicyService.getBankById(id).subscribe(data=>{
  //     console.log(data);
  //   })
    
  // }
  Addgovenmante(item:any){
    this.AddBankForm.reset()
    $(".overlayAdd").fadeIn(300)
    $(".Addgovernmant").animate({right: '0px'});
  }
  closeAddgovenmantee(){
    $(".overlayAdd").fadeOut(300)
    $(".Addgovernmant").animate({right: '-30%'});
  }
      // Add Bank
  AddBank(){
    this.isClicked =true
    let Model = Object.assign(this.AddBankForm.value,{'bankAccounts':this.arrTest});
    console.log(Model);
    
    this._PolicyService.AddBank(Model).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      this.closeAddgovenmantee()
      this.getAllBanks()

      // Swal.fire({title:res.bankName+' Bank Added Successfully',timer:2300, timerProgressBar: true})
      this._SharedService.setAlertMessage(res.bankName + ' Bank Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }

    // Edit
  getBankDetails(Bank:any){
    console.log(Bank);
    this.EditId = Bank.bankId
    this.AddBankForm.get('bankName')?.setValue(Bank.bankName)
    this.AddBankForm.get('bankCode')?.setValue(Bank.bankCode)
    this.AddBankForm.get('iBan')?.setValue(Bank.iBan)
    this.AddBankForm.get('swiftCode')?.setValue(Bank.swiftCode)
    this.AddBankForm.get('bankAccount')?.setValue(Bank.bankAccount)
    this.arrTest=Bank.bankAccounts
  }
  Editgovenmante(Bank:any){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    console.log(Bank);
    this.EditId = Bank.bankId
    this.AddBankForm.get('bankName')?.setValue(Bank.bankName)
    this.AddBankForm.get('bankCode')?.setValue(Bank.bankCode)
    this.AddBankForm.get('iBan')?.setValue(Bank.iBan)
    this.AddBankForm.get('swiftCode')?.setValue(Bank.swiftCode)
    this.AddBankForm.get('bankAccount')?.setValue(Bank.bankAccount)
    this.arrTest=Bank.bankAccounts
  
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
 SubmitEditBank(){
  this.isClicked =true
    let Model = Object.assign(this.AddBankForm.value,{'bankAccounts':this.arrTest},{'bankId':this.EditId });
    console.log(Model);
    this._PolicyService.UpdateBank(Model).subscribe((res:any)=>{
      this.isClicked =false;
      // $("#Edit").modal('toggle')
      this.closeEditgovenmantee()
      this.getAllBanks()
      // Swal.fire({title:res.bankName+' Bank Edited Successfully',timer:2300, timerProgressBar: true})
      this._SharedService.setAlertMessage(res.bankName + ' Bank Edited Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      this.isClicked =false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
      
    })
  
}
  WhenModalOpen(){
    this.AddBankForm.reset()
    this.arrTest =[];
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllBanks();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllBanks();
  }
  // Add Accounts Numbers
  arrTest:any[]=[];
  view(){
    var exixs = this.arrTest.find(item=>this.accountNumber == item)
    console.log(exixs);
    
    if(exixs==undefined){
      
      this.arrTest.push(this.accountNumber);
      this.accountNumber='';
    }else{
      this._ToastrService.show('This Account Number Is already exist')
    }
    console.log(this.arrTest);
  }
  remove(index:number){
    this.arrTest.splice(index, 1)
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
  // New AccountType 
  USERID:any
  AddNewAccType(id:any){
    console.log(id);
    this.USERID=id
    
    $(".overlay").fadeIn(300)
    $(".delet").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlay").fadeOut(300)
    $(".delet").animate({right: '-30%'});
  }

  ngOnInit(): void {
    this.getAllBanks();
    this._SharedService.changeData(false,'Add new bank','',true,true);
    // this._SharedService.openModal$.subscribe(() => {
    //   const modal = new bootstrap.Modal(document.getElementById('Add'));
    //   modal.show();
    // });
    this._SharedService.openModal$.subscribe((item: any) => {
      this.Addgovenmante(item); // Change 'edit' to 'add' as needed
    });
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });
  }
}
