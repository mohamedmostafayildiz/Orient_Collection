import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from 'src/app/services/collection.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any
@Component({
  selector: 'app-create-honsty',
  templateUrl: './create-honsty.component.html',
  styleUrls: ['./create-honsty.component.scss'],
  providers:[DatePipe]
})
export class CreateHonstyComponent implements OnInit{
  AllIndividualAndCorporate:any
  isClicked:boolean = false;
  CurrentDate:any = new Date()
  ArrCheck:any[]=[]
  ArrTransfer:any[]=[]
  constructor(private _PolicyService:PolicyService ,private _CollectionService:CollectionService 
    ,private _ToastrService:ToastrService, public _DatePipe:DatePipe,private _SharedService:SharedService){}
  
  
  HonstyForm:FormGroup = new FormGroup({
    'customerId': new FormControl('',[Validators.required]),
    'amount': new FormControl('',[Validators.required]),
    'paymentDateTime': new FormControl('',[Validators.required]),
  })
  CheckForm:FormGroup = new FormGroup({
    'checkNumber':new FormControl(''),
    'bankName':new FormControl(''),
    'amount':new FormControl(''),
    'paymentDate':new FormControl('')
  })
  TrasferForm:FormGroup = new FormGroup({
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })


  saveHonsteyCreation(){
    this.isClicked = true
    console.log(this.HonstyForm.value);
    let Model = Object.assign(this.HonstyForm.value,
      {
        paymentWays:{
          bankTransferPayment:this.ArrTransfer,
          checkPayment:this.ArrCheck
        }
      }
      )
      console.log(Model);
    this._CollectionService.CreateSecretariatWithoutPolicy(Model).subscribe(data=>{
      $(".remove").hide(300)
      $("#BankTransfer").hide(300)
      $("#BankTransfer").hide(300)
      $("#FinalSave").hide(300)
      $("#NewHonsty").show(300)
      console.log(data);
      this.isClicked = false
      this._SharedService.setAlertMessage('Secretariat Created Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Greate','Secretariat Created Successfully','success')
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  GetListOfIndividualAndCorporate(){
    this._PolicyService.GetListOfIndividualAndCorporate().subscribe(data=>{
      this.AllIndividualAndCorporate = data;
    },error=>{
      console.log(error);
    })
  }
  AllCustomers:any[]=[]
  getAllCustomers(){
    this._PolicyService.GetAllCustomers().subscribe((data:any)=>{
      this.AllCustomers = data;
    },error=>{
      console.log(error);
    })
  }
  // Payment Way
  getPaymentWay(value:any){
    if(value == 1){
      $("#Check").show(500)
      $("#BankTransfer").hide(500)
    }else if(value == 2){
      $("#Check").hide(500)
      $("#BankTransfer").show(500)
    }
  }
  PayedMoney:number = 0;
  //////////////////// Check ////////////////////
  viewCheck(){
    if((this.PayedMoney+Number(this.CheckForm.get('amount')?.value))>this.HonstyForm.get('amount')?.value){
      this._ToastrService.show('Can Not Pay More Than Total Money')
    }else{
      var item = this.ArrCheck.find(item=>this.CheckForm.get('checkNumber')?.value == item.checkNumber && this.CheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
      if(item==undefined){
        let Model= {
          'checkNumber':this.CheckForm.get('checkNumber')?.value,
          'bankName':this.CheckForm.get('bankName')?.value,
          'amount':this.CheckForm.get('amount')?.value,
          'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYYY-MM-dd')
        }
        this.PayedMoney+=Number(this.CheckForm.get('amount')?.value)
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
    this.PayedMoney-=Number(Money)
  }
      ////////////  Transfer  //////////////
viewTransfer(){
  if((this.PayedMoney+Number(this.TrasferForm.get('amount')?.value))>this.HonstyForm.get('amount')?.value){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'transferNumber':this.TrasferForm.get('transferNumber')?.value,
      'bankName':this.TrasferForm.get('bankName')?.value,
      'amount':this.TrasferForm.get('amount')?.value,
      'paymentDate': this._DatePipe.transform(this.TrasferForm.get('paymentDate')?.value, 'YYYY-MM-dd')
    }
    this.ArrTransfer.push(Model)
    this.PayedMoney+=Number(this.TrasferForm.get('amount')?.value)
    this.TrasferForm.reset()
  }
  
}
removeTrasfer(index:number, Money:any){ 
  this.ArrTransfer.splice(index, 1)
  this.PayedMoney -= Number(Money)
}
  newHonsty(){
    this.HonstyForm.reset();
    this.ArrCheck =[]
    this.ArrTransfer =[]
    $("#FinalSave").show(300)
    $("#NewHonsty").hide(300)
    this.PayedMoney = 0
  }
  ngOnInit(): void {
    this._SharedService.changeData(false,'','',false,false);

    // this.GetListOfIndividualAndCorporate()
    this.getAllCustomers()
  }
}
