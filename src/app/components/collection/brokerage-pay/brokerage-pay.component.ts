import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
declare var $:any
import { PolicyService } from 'src/app/services/policy.service';
@Component({
  selector: 'app-brokerage-pay',
  templateUrl: './brokerage-pay.component.html',
  styleUrls: ['./brokerage-pay.component.scss'],
  providers : [DatePipe]
})
export class BrokeragePayComponent {
  page:number=1;
  count:number=0;
  tableSize:number=10;
  tableSizes=[5,8,10,15,20];

  DepositTransfer:any;
  Model:any;
  selectedFile:any = '';
  isClicked:boolean= false;
  loading:boolean= false;
  brokerCustomers:any;
  BrokerIdVal:any ='';
  TotalMony:number = 0;
  PayedMoney:any = 0;
  RemainedMoney:number = 0
  Money:any;
  CashedInputs:any;
  CurrentDate:any = new Date();
  ArrContinue:any[]=[];
  ArrCredit:any[]=[];
  ArrCheck:any[]=[];
  ArrDeposit:any[]=[];
  ArrTransfer:any[]=[];
  AddedNewChecks:any[]=[];
  ResponseIds:any[]=[];
  isSubmitted:boolean = false;
  AllData:any[]=[];
   unDo:any[]=[];
  UnDoPaymentId:any=''
  constructor(private _PolicyService:PolicyService,private _ToastrService:ToastrService,private _DatePipe:DatePipe ,private _Router:Router,private _SharedService:SharedService,
    private _CollectionService:CollectionService, private _AdminService:AdminService, private _ActivatedRoute:ActivatedRoute){
      this._ActivatedRoute.queryParams.subscribe((data:any)=>{
        this.CashedInputs = data;
        console.log(data);
        this.SearchForm.get('excelFileId')?.setValue(data?.excelFileId);
        this.SearchForm.get('insuredName')?.setValue(data?.insuredName);
        this.SearchForm.get('brokerId')?.setValue(data?.brokerId==null?'':Number(data?.brokerId)||data?.brokerId==0?'':Number(data?.brokerId))
      });
    }

  ///////////////// Payment Way /////////////////
  getPaymentWay(value:any){
    $("#PaymentFile").show(500)
    $("#Bodyy").show(500)
    if(value == 3){
      $("#Check").show(500)

      $("#continue").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 5){
      $("#BankTransfer").show(500)

      $("#Check").hide(500)
      $("#continue").hide(500)
    }else if(value == 1){
      $("#Check").hide(500)
      $("#BankTransfer").hide(500)

      $("#continue").show(500)
    }
  }
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  
  SearchForm:FormGroup = new FormGroup({
    'PolicyCode':new FormControl(''),
    'PermitNumber':new FormControl(''),
    'PortfolioCode':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl(''),
    'status':new FormControl(''),
    'BrokerId':new FormControl('',[Validators.required]),
  })
  CheckForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required])
  })
  TrasferForm:FormGroup = new FormGroup({
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  ContinueForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })

  ///////////////////// Search /////////////////////
  InnerModelSeaerch(){
    $("#SearchResults").show(500)  //
    
    this.Model = Object.assign(
      {PortfolioCode:this.SearchForm.get('PortfolioCode')?.value==null?'':this.SearchForm.get('PortfolioCode')?.value},
      {status:this.SearchForm.get('status')?.value==null?'':this.SearchForm.get('status')?.value},
      {PermitNumber:this.SearchForm.get('PermitNumber')?.value==null?'':this.SearchForm.get('PermitNumber')?.value},
      {PolicyCode:this.SearchForm.get('PolicyCode')?.value==null?'':this.SearchForm.get('PolicyCode')?.value},
      {BrokerId:this.SearchForm.get('BrokerId')?.value},
      {From:this.SearchForm.get('From')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd")},
      {To:this.SearchForm.get('To')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")}
      )
    
  }
Search(){
  $("#Bodyy").show(300);
  this.isClicked = true;
  this.InnerModelSeaerch();
  console.log(this.Model);
  this._CollectionService.GetAllBrokerageCommissions(this.Model).subscribe((data:any)=>{
    this.isClicked = false;
    console.log(data);
    this.AllData = data;
    $("#SearchResults").show(500);
  },error=>{
    this.isClicked = false;
    console.log(error);
  })
  // this._Router.navigate(['/BrokeragePayment'],{
  //   queryParams:{excelFileId:this.Model.excelFileId,brokerId:this.BrokerIdVal,
  //   from:this.Model.from,to:this.Model.to,policyCode:this.Model.policyCode}
  // })
}

checkIfAxceeded(e:any, input:any, IndexIdDate:any,CheckBox:any){
  input as HTMLInputElement
  this.AllData[IndexIdDate].remaining =e.max-e.value
  
  if(Number(e.value)<Number(e.max)){
    
  }else if(Number(e.value)>Number(e.max)){
    input.value= e.max
    CheckBox.disabled=false
    this.AllData[IndexIdDate].remaining =0
    this._ToastrService.show('','Can not Exceed Max Value')
  }else if(Number(e.value)==Number(e.max)){
  }
  if(e.value>0){
    CheckBox.disabled=false
  }else{
    CheckBox.disabled=true
  }
}

ArrTest:any[]=[]
getCheckedValues(id:any,checked:any,Money:any){

  if(checked==true){
    this.TotalMony =this.TotalMony+= Number(Money)
    this.ArrTest.push(id)
  }else{
    this.TotalMony=this.TotalMony -= Money
    let roundedResult = this.TotalMony.toFixed(2);
    this.TotalMony = Number(roundedResult)
    let item = this.ArrTest.find(item=>id==item)
    let Index = this.ArrTest.indexOf(item)
    this.ArrTest.splice(Index, 1)
  }
  console.log(this.ArrTest);
}

// getCheckedValues(id:any,checked:any,Money:any){
//   $("#UploadFile").show(500)
//   let Exisit = this.ArrTest.find(item=>id==item)
  

//   if(checked==true){
//     // Money.disabled = true
//     this.TotalMony += Number(Money)
//     // LaterDate.disabled = true
//     if(Exisit==undefined){
      
//       this.ArrTest.push(id)
//     }else{
//       let Index = this.ArrTest.indexOf(Exisit)
//       this.ArrTest.splice(Index)
//       this.ArrTest.push(id)
//     }
//   }else{
//     this.TotalMony -= Number(Money)
//     // Money.disabled = false
//     // LaterDate.disabled = false
//     let item = this.ArrTest.find(item=>id==item)
//     let Index = this.ArrTest.indexOf(item)
//     this.ArrTest.splice(Index, 1)
//   }
//   console.log(this.ArrTest);
// }
  ////////////  Check  //////////////
  viewCheck(){
    // console.log(item.bankName);
    if((this.PayedMoney+Number(this.CheckForm.get('amount')?.value))>this.TotalMony){
      this._ToastrService.show('Can Not Pay More Than Total Money')
    }else{
      var item = this.ArrCheck.find(item=>this.CheckForm.get('checkNumber')?.value == item.checkNumber
      && this.CheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
      if(item==undefined){
        let Model= {
          'amount':this.CheckForm.get('amount')?.value,
          'bankName':this.CheckForm.get('bankName')?.value,
          'checkNumber':this.CheckForm.get('checkNumber')?.value,
          'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYY-MM-dd')
        }
        this.PayedMoney+=Number(this.CheckForm.get('amount')?.value);
        this.RemainedMoney = this.TotalMony - this.PayedMoney;
        let roundedResult = this.RemainedMoney.toFixed(2);
        this.RemainedMoney = Number(roundedResult)
  
        this.ArrCheck.push(Model);
        this.CheckForm.reset()
      }else{
        this._ToastrService.show('This Ckeck is Already Exist')
      }
    }
    console.log(this.ArrCheck);
    
  }
   //Remove item From Loss Participations List
   removeCheck(index:number,Money:any){
    this.ArrCheck.splice(index, 1)
    this.PayedMoney-=Number(Money)
    let roundedResult2 = this.PayedMoney.toFixed(2);
    this.PayedMoney = Number(roundedResult2)
    console.log(this.ArrCheck);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    let roundedResult = this.RemainedMoney.toFixed(2);
    this.RemainedMoney = Number(roundedResult)
  }
      ////////////  Transfer  //////////////
  viewTransfer(){
    if((this.PayedMoney+Number(this.TrasferForm.get('amount')?.value))>this.TotalMony){
      this._ToastrService.show('Can Not Pay More Than Total Money')
    }else{
      let Model={
        'transferNumber':this.TrasferForm.get('transferNumber')?.value,
        'bankName':this.TrasferForm.get('bankName')?.value,
        'amount':this.TrasferForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.TrasferForm.get('paymentDate')?.value, 'YYYY-MM-dd')
      }
      this.ArrTransfer.push(Model)
      this.PayedMoney = this.PayedMoney+=Number(this.TrasferForm.get('amount')?.value)
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      let roundedResult = this.RemainedMoney.toFixed(2);
      this.RemainedMoney = Number(roundedResult)
      this.TrasferForm.reset()
    }
    
  }
  removeTrasfer(index:number, Money:any){
    this.ArrTransfer.splice(index, 1);
    this.PayedMoney -= Number(Money);
    let roundedResult2 = this.PayedMoney.toFixed(2);
    this.PayedMoney = Number(roundedResult2)
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    let roundedResult = this.RemainedMoney.toFixed(2);
    this.RemainedMoney = Number(roundedResult)
  }
      ////////////  continue  /////////////////
  viewContinue(){
    if((this.PayedMoney+Number(this.ContinueForm.get('amount')?.value))>this.TotalMony){
      this._ToastrService.show('Can Not Pay More Than Total Money')
    }else{
      let Model={
        amount:this.ContinueForm.get('amount')?.value,
        paymentDate:this._DatePipe.transform(this.CurrentDate, 'YYYY-MM-dd')
      }
      this.ArrContinue.push(Model)
      this.PayedMoney+=Number(this.ContinueForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      let roundedResult = this.RemainedMoney.toFixed(2);
      this.RemainedMoney = Number(roundedResult)
      this.ContinueForm.reset();
    }
    
  }
  removeContinue(index:number, Money:any){
    this.ArrContinue.splice(index, 1)
    this.PayedMoney -= Number(Money);
    let roundedResult2 = this.PayedMoney.toFixed(2);
    this.PayedMoney = Number(roundedResult2)
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    let roundedResult = this.RemainedMoney.toFixed(2);
    this.RemainedMoney = Number(roundedResult)
  }
//get Broker Customers
getBrokerCustomers(){
  this._AdminService.getAllBrokers().subscribe(data=>{
    console.log("data",data);
    
    this.brokerCustomers= data
  })
}
////////////// GetListInsuredNames ///////////////////
isClicked2:boolean =false;
getUnDoPaymentId(Checked:any,PaymentId:any){
  if(this.UnDoPaymentId!=''){
    this.unDo[this.UnDoPaymentId]=false;
  }
  if(Checked==true){
    this.UnDoPaymentId = PaymentId;
  }else{
    this.UnDoPaymentId =''
  }
  console.log(this.UnDoPaymentId);
}
ChangeBrokerageCommissionStatus(){
  this.isClicked2 = true;
  this._CollectionService.ChangeBrokerageCommissionStatus(this.UnDoPaymentId).subscribe(res=>{
    this.isClicked2 = false;
    console.log(res);
    Swal.fire('Good job!',res,'success')
    this.UnDoPaymentId = '';
    this.Search()
  },error=>{
    this.isClicked2 = false;
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
  })
}
      ////////////=>  Add Payment   <=/////////
CkeckValue:any[]=[]
AddPayment(){
  this.isSubmitted = true;
  let Model ={
    "BrokerId":this.SearchForm.get("BrokerId")?.value,
    'TotalAmount':this.TotalMony,
    "brokerageCommissions":this.ArrTest,
    "paymentWays":{
      "bankTransferPayment":this.ArrTransfer,
      "checkPayment":this.ArrCheck,
      "agentsAccountPayment":this.ArrContinue
    },
  }
  console.log(Model);
  this._CollectionService.BrokerageCommissionPayment(Model).subscribe(res=>{
    this.isSubmitted = false;
    console.log(res);
    // Swal.fire('Good job!','Added Successfully','success')
    this._SharedService.setAlertMessage('Added Successfully');
    window.location.reload()
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.TotalMony = 0
    this.PayedMoney = 0
    this.ArrTest = []
    $("#PaymnetWays").hide(500)
    $("#TrasferForm").hide(500)
    $("#NewPay").show(500)
    $(".removei").hide(500)
    $(".removeii").hide(500)
    $(".removeiii").hide(500)
    $("#searchBtn").hide(500)
    $("#Check").hide(500)
    $("#UpdateClaimBtn").hide(500)
    $(".HideCheck").hide(500)
    $(".chechBox").hide(500)
    this.ResponseIds = []
  },error=>{
    this.isSubmitted = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
  })
}
    // New Payment
NewPayment(){
  
  $("#NewPay").hide(500)
  this.ArrCheck = []
  this.ArrTransfer = []
  this.ArrContinue = []
  this.AllData = []
  $(".removei").show(500)
  $("#UpdateClaimBtn").show(500)
  $(".removeii").show(500)
  $(".removeiii").show(500)
  $("#searchBtn").show(500)
  $(".chechBox").show(500)
  $("#Check").hide(500)
  $("#BankTransfer").hide(500)
  $("#continue").hide(500)
}
// Get Collection Payment Ways
loadingPaymentWays:boolean = false;
CollectionPaymentWays:any={}
GetCollectionPaymentWays(CollectionId:any){
  $("#CollectionPayementWays").show(500)
  this.loadingPaymentWays = true;
  this._CollectionService.getCollectionPaymentWays(CollectionId).subscribe((data:any)=>{
    this.loadingPaymentWays = false;
    this.CollectionPaymentWays= data
    console.log(data);
  },error=>{
    this.loadingPaymentWays = false;
  })
}
        //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.Search();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.Search();
  }
  AllBanks:any
  getAllBanks(){
    this._PolicyService.getAllBanks().subscribe((data:any)=>{
      this.AllBanks =data;
      console.log(this.AllBanks);
    },error=>{
    })
  }
  //////////////// History ////////////////
  BrokerageDetails:any
  HistoryLoading:Boolean =false;
  GetHistory(Id:any){
    // $("#CollectionPayementWays").hide(300)
    $(".overlayPortflioCollections").fadeIn(300)
    $(".closePortflioCollections").animate({right: '0px'});
    this.HistoryLoading = true
    this._CollectionService.GetBrokerageHistory(Id).subscribe(data=>{
      this.HistoryLoading = false
      console.log(data);  
      this.BrokerageDetails = data;
    },error=>{
      this.HistoryLoading = false
    })
  }
  closeHistory(){
    $(".overlayPortflioCollections").fadeOut(300)
    $(".closePortflioCollections").animate({right: '-30%'});
  }
  ngOnInit(){
    this._SharedService.changeData(true,'','',true,false);
    this._SharedService.currentMessage.subscribe(message => {
          if(message){
            $("#filters").show(300)
          }else{
            $("#filters").hide(300)
          }
    });
    this.getBrokerCustomers();
    this.getAllBanks()
  }
}
