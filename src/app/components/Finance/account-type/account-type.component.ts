
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $ :any
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent {
  // ngOnInit(): void {
  //   this._SharedService.changeData(false, 'Add new Account type', '', true, true);
  //   this._SharedService.openModal$.subscribe((item: any) => {
  //     this.Addgovenmante(item);
  //   });

  //   this.EditAccountTypeForm = this.fb.group({
  //     AccountType: ['', Validators.required],
  //     Details: ['', Validators.required]
  //   });

  //   this.AddAccountTypeForm = this.fb.group({
  //     Name: ['', Validators.required]
  //   });

  //   this.ViewDetailsForm = this.fb.group({ // New form for viewing and editing details
  //     Description: ['', Validators.required]
  //   });

  //   this.count = this.AllAccountType.length;

  //   this._SharedService.currentMessage.subscribe(message => {
  //     if (message) {
  //       $("#filters").show(300);
  //     } else {
  //       $("#filters").hide(300);
  //     }
  //   });
  //       this.GetAllAccountTyps()

  // }

  TypeName:any
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any
  AccountType:any[]=[]
  isLoading:boolean=false
  isClicked:boolean=false
  constructor(private _TransactionService:TransactionService, private _ToastrService:ToastrService, private _SharedService:SharedService){}
//Pagination Methods
onTableDataChange(event:any){
  this.page=event;
  this.GetAllAccountTyps()
  }
  onTableSizeChange(event:any){
  this.tableSize=event.target.value;
  this.page=1;
  this.GetAllAccountTyps()
  }
  AccDetailsForm:FormGroup =new FormGroup ({
    "details" : new FormControl('',[Validators.required]),
  })
  EditDetailsForm:FormGroup =new FormGroup ({
    "discription" : new FormControl(''),
  })
  // New AccountType 
  AddNewAccType(item: any){
    $(".overlayAccountType").fadeIn(300)
    $(".AddNewAccountType").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlayAccountType").fadeOut(300)
    $(".AddNewAccountType").animate({right: '-40%'});
    this.TypeName=''
  }
  // Type Showing Details
  TypeDetails:any[]=[]
  showDetails(details:any){
    $(".overlayTypeDetails").fadeIn(300)
    $(".showtypeDetails").animate({right: '0px'});
    console.log(details);
    this.TypeDetails=details
  }
  closeshowDetails(){
    $(".overlayTypeDetails").fadeOut(300)
    $(".showtypeDetails").animate({right: '-40%'});
    $("#details").hide(300)

  }
  // Edit Account Type
  EditAccType(){
    $(".overlayEditAccountType").fadeIn(300)
    $(".EditAccountType").animate({right: '0px'});
  }
  closeEditAccType(){
    $(".overlayEditAccountType").fadeOut(300)
    $(".EditAccountType").animate({right: '-40%'});
    this.TypeName=''
    this.EditDetailsForm.reset()
  }
  // Edit account Type
  ArrofTypyes:any[]=[]

  ID:any
  openEditDetailsModal(item:any){
    console.log(item);
    this.EditAccType();
    this.ID = item.id
    this.TypeName = item.name
    this.ArrofTypyes = item.details && Array.isArray(item.details) ? item.details : [];
  }
  // Add TypeName
  AddTypeName(){
    this.isClicked =true
    this._TransactionService.AddNewType(this.TypeName).subscribe((data:any)=>{
      this.isClicked =false
      console.log(data);
      Swal.fire({title:'Type Added Successfully',timer:3000, timerProgressBar: true}) 
      this.TypeName=''
      this.GetAllAccountTyps()
      this.closeNewAccType();
    },error=>{
      this.isClicked =false
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  EditAdd(){
    let Exit = this.ArrofTypyes.find(item=>item.discription == this.EditDetailsForm.get('discription')?.value)
    if(Exit==undefined){
      let Model = Object.assign(this.EditDetailsForm.value,{accounTypeId:this.ID})
      this.ArrofTypyes.push(Model)
      console.log( this.ArrofTypyes);
      this.EditDetailsForm.reset();
    }else{
      this._ToastrService.show('This description already existed')
    }
   
  }
  removee(index:number){
    this.ArrofTypyes.splice(index, 1)
  }
  gettypename(id:any):string{
    var object= this.AccountType.find(item=>item.id == id)
    return object?object.name:"--";
  }
  EditTypeName(){
    console.log("Welcom");
    this.isClicked=true
    let Model = Object.assign({id:this.ID,name:this.TypeName,details:this.ArrofTypyes})
    console.log(Model);
    this._TransactionService.UpdateType(Model).subscribe((data:any)=>{
      this.isClicked=false
      console.log(data);
      Swal.fire({title:'Type Added Successfully',timer:3000, timerProgressBar: true}) 
      this.TypeName=''
      this.ArrofTypyes=[]
      this.EditDetailsForm.reset()
      this.GetAllAccountTyps()
      this.closeEditAccType();
    },error=>{
      console.log(error);
      this.isClicked=false
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  descripionId:any
  open(item:any){
    console.log(item);
    $('#details').show(500)
    this.AccDetailsForm.get('details')?.setValue(item.discription)
    this.descripionId=item.id
  }
  EditAccountTpeDetails(){
    this.isClicked=true
    let Model = Object.assign({id:this.descripionId},{discription:this.AccDetailsForm.get('details')?.value})
    console.log(Model);
    
    this._TransactionService.UpdateDetails(Model).subscribe((data:any)=>{
      this.isClicked=false
      console.log(data);
      Swal.fire({title:'Details Updated Successfully',timer:3000, timerProgressBar: true}) 
      this.AccDetailsForm.reset()
      this.GetAllAccountTyps()
      this.closeshowDetails();
      $('#details').hide(500)
    },error=>{
      this.isClicked=false
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  
  GetAllAccountTyps(){
    this.isLoading = true;
    this._TransactionService.GetAllTypes().subscribe((data:any)=>{
      console.log(data);
      this.isLoading = false;
      this.AccountType=data
    },error=>{
      console.log(error);
      this.isLoading = false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  ngOnInit(): void {
    this.GetAllAccountTyps()

        this._SharedService.changeData(false, 'Add new Account type', '', true, true);
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
  }
}
