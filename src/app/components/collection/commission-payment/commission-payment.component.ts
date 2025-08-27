import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $:any
@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.scss'],
  providers : [DatePipe]
})
export class CommissionPaymentComponent {
  DepositTransfer:any
  selectedFile:any = ''
  isClicked:boolean= false
  brokerCustomers:any
  BrokerIdVal:any =''
  TotalMony:number = 0
  PayedMoney:any = 0
  Money:any
  CurrentDate:any = new Date()
  ArrCash:any[]=[]
  ArrCredit:any[]=[]
  ArrCheck:any[]=[]
  ArrDeposit:any[]=[]
  ArrTransfer:any[]=[]
  ArrHonsty:any[]=[]
  AddedNewChecks:any[]=[]
  AllPolices:any=[
    {a:"1",b:"Ahmed",c:"Amr",d:"0",e:"6000",tax:'5',netCommission:"5800",f:"6500",g:"400",h:"12-11-2023"},
    {a:"2",b:"Hany",c:"Ali",d:"0",e:"6200",tax:'5',netCommission:"4200",f:"6500",g:"600",h:"13-11-2023"},
    {a:"3",b:"Ahman",c:"Mohamed",d:"0",e:"900",tax:'5',netCommission:"5000",f:"900",g:"1500",h:"5-11-2024"},
    {a:"4",b:"Ramy",c:"Magdy",d:"0",e:"6000",tax:'5',netCommission:"3800",f:"800",g:"300",h:"19-11-2023"}
  ]
  constructor(private _ToastrService:ToastrService,private _DatePipe:DatePipe){}

  ///////////////// Payment Way /////////////////
  getPaymentWay(value:any){
    $("#PaymentFile").show(500)
    $("#Bodyy").show(500)
    if(value == 3){
      $("#Check").show(500)
  
  
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 5){
      $("#BankTransfer").show(500)

      $("#BankDeposit").hide(500)
      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
    }
  }
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  
  SearchForm:FormGroup = new FormGroup({
    'Code':new FormControl(''),
    'InsuredName':new FormControl(''),
    'BrokerId':new FormControl(''),
    'UnderWritingYear':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl('')
  })
  CheckForm:FormGroup = new FormGroup({
    '1':new FormControl(''),
    '2':new FormControl(''),
    '3':new FormControl(''),
    '4':new FormControl('')
  })
  CreditForm:FormGroup = new FormGroup({
    '1':new FormControl(''),
    '2':new FormControl(''),
    '3':new FormControl(''),
    '4':new FormControl('')
  })
  DepositForm:FormGroup = new FormGroup({
    '1':new FormControl(''),
    '2':new FormControl(''),
    '3':new FormControl(''),
    '4':new FormControl('')
  })
  TrasferForm:FormGroup = new FormGroup({
    '1':new FormControl(''),
    '2':new FormControl(''),
    '3':new FormControl(''),
    '4':new FormControl('')
  })


  getCheckedValues(checked:any ,price:any){

    $("#PaymnetWays").show(500)
    if(checked==true){
      
      this.TotalMony += Number(price)
    }else{
      this.TotalMony -= Number(price)
    }
  }
    // Search
Search(){
  $("#SearchResults").show(500) //
}

viewCheck(){
  if((this.PayedMoney+Number(this.CheckForm.get('3')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    var item = this.ArrCheck.find(item=>this.CheckForm.get('1')?.value == item.a && this.CheckForm.get('2')?.value.toLowerCase() == item.b.toLowerCase())
    if(item==undefined){
      let Model= {
        'a':this.CheckForm.get('1')?.value,
        'b':this.CheckForm.get('2')?.value,
        'c':this.CheckForm.get('3')?.value,
        'd': this._DatePipe.transform(this.CheckForm.get('4')?.value,'dd-MM-YYYY')
      }
      this.PayedMoney+=Number(this.CheckForm.get('3')?.value)
      this.ArrCheck.push(Model);
      this.CheckForm.reset()
      // this.uploadPlanEvent='';
    }else{
      this._ToastrService.show('This Ckeck is Already Exist')
    }
  }
}
 //Remove item From Loss Participations List
 removeCheck(index:number,Money:any){
  this.ArrCheck.splice(index, 1)
  this.PayedMoney-=Number(Money)
}
    ////////////  Cash  /////////////////
viewCash(){
  if((this.PayedMoney+Number(this.Money))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      money:this.Money
    }
    this.ArrCash.push(Model)
    this.PayedMoney+=Number(this.Money)
    this.Money=''
  }
}
removeCash(index:number, Money:any){
  this.ArrCash.splice(index, 1)
  this.PayedMoney -= Number(Money)
}
    ////////////  Credit  //////////////
viewCredit(){
  if((this.PayedMoney+Number(this.CreditForm.get('4')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'a':this.CreditForm.get('1')?.value,
      'b':this.CreditForm.get('2')?.value,
      'c': this._DatePipe.transform(this.CreditForm.get('3')?.value, 'dd-MM-YYYY'),
      'd':this.CreditForm.get('4')?.value
    }
    this.ArrCredit.push(Model)
    this.PayedMoney+=Number(this.CreditForm.get('4')?.value)
    this.CreditForm.reset()
  }
  
}
removeCredit(index:number, Money:any){
  this.ArrCredit.splice(index, 1)
  this.PayedMoney -= Number(Money)
}
    ////////////  Deposit  //////////////
viewDeposit(){
  if((this.PayedMoney+Number(this.DepositForm.get('3')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'a':this.DepositForm.get('1')?.value,
      'b':this.DepositForm.get('2')?.value,
      'c':this.DepositForm.get('3')?.value,
      'd': this._DatePipe.transform(this.DepositForm.get('4')?.value, 'dd-MM-YYYY')
    }
    this.ArrDeposit.push(Model)
    this.PayedMoney+=Number(this.DepositForm.get('3')?.value)
    this.DepositForm.reset()
  }
  
}
removeDeposit(index:number, Money:any){
  this.ArrDeposit.splice(index, 1)
  this.PayedMoney -= Number(Money)
}
    ////////////  Transfer  //////////////
viewTransfer(){
  if((this.PayedMoney+Number(this.TrasferForm.get('3')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'a':this.TrasferForm.get('1')?.value,
      'b':this.TrasferForm.get('2')?.value,
      'c':this.TrasferForm.get('3')?.value,
      'd': this._DatePipe.transform(this.TrasferForm.get('4')?.value, 'dd-MM-YYYY')
    }
    this.ArrTransfer.push(Model)
    this.PayedMoney+=Number(this.TrasferForm.get('3')?.value)
    this.TrasferForm.reset()
  }
  
}
removeTrasfer(index:number, Money:any){
  this.ArrTransfer.splice(index, 1)
  this.PayedMoney -= Number(Money)
}

}
