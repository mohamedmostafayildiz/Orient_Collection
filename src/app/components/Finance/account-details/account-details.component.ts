import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/services/transaction.service';
declare var $: any;
declare var $:any
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent {
  TypeName:any
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any
  selectedAccountType:any
  arrTest:any[]=[]
  AccountType:any[]=[]
  isClicked:boolean=false
  isLoading:boolean=false
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
  // // New Account Details
  AddNewAccDetails(item:any){
    $(".overlayAccountDetails").fadeIn(300)
    $(".AddNewAccountDetails").animate({right: '0px'});
  }
  closeNewAccDetails(){
    $(".overlayAccountDetails").fadeOut(300)
    $(".AddNewAccountDetails").animate({right: '-40%'});
    this.selectedAccountType=''
    this.AccDetailsForm.reset()
    this.arrTest=[]
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
       // Account Details
  View(){
    let Exit = this.arrTest.find(item=>item.discription == this.AccDetailsForm.get('details')?.value)
    if(Exit == undefined){
      let Model = Object.assign({discription:this.AccDetailsForm.get('details')?.value},{typeId:this.selectedAccountType})
      this.arrTest.push(Model);
      console.log(Model);
      this.AccDetailsForm.reset()
    }else{
      this._ToastrService.show('This details already existed')
    }
  }
     remove(index:number){
      this.arrTest.splice(index, 1)
    }
    AddAccountTpeDetails(){
      this.isClicked=true
      this._TransactionService.AddNewDetails(this.arrTest).subscribe((data:any)=>{
        console.log(data);
        Swal.fire({title:'Details Added Successfully',timer:3000, timerProgressBar: true}) 
        this.selectedAccountType=''
        this.GetAllAccountTyps()
        this.closeNewAccDetails();
        this.isClicked=false
  
      },error=>{
        console.log(error);
        this.isClicked=false
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
      this._SharedService.changeData(false, 'Add new account details', '', true, true);
    this._SharedService.openModal$.subscribe((item: any) => {
      this.AddNewAccDetails(item);
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
