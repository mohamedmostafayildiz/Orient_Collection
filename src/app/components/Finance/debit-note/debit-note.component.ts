import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { ListsService } from 'src/app/services/lists.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss'],
  providers:[DatePipe]

})
export class DebitNoteComponent {
  isSubmitted:boolean=false
  isLoading:boolean=false
  CreditEntryArr1:any=[]
  DepitEntryArr1:any[]=[]
  referncenumber1:any
  constructor(private _DatePipe:DatePipe,private _AccountsService:AccountsService,private _ListsService:ListsService){}
  // Depit Note Entry
  DepitEntryNoteForm:FormGroup = new FormGroup({
    'entryType':new FormControl('',[Validators.required]),
    'duedate':new FormControl('',[Validators.required]),
    'invoivcedate':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'currency':new FormControl('',[Validators.required]),
    'mainAccountId':new FormControl('',[Validators.required]),
    'subAccountId':new FormControl(''),
    'referenceNumber':new FormControl('',[Validators.required]),
  })
   ModelType:any={}
  AddDepitEntry(){
    if(this.DepitEntryNoteForm.get('entryType')?.value==true){
      this.ModelType={
        'entryType':3,
        "credit": this.DepitEntryNoteForm.get('amount')?.value,
        "debit": 0,
        'mainAccountId':this.DepitEntryNoteForm.get('mainAccountId')?.value==''?null:Number(this.DepitEntryNoteForm.get('mainAccountId')?.value),
        'subAccountId':this.DepitEntryNoteForm.get('subAccountId')?.value==''?null:Number(this.DepitEntryNoteForm.get('subAccountId')?.value),
        'referenceNumber':this.DepitEntryNoteForm.get('referenceNumber')?.value==''?null:this.DepitEntryNoteForm.get('referenceNumber')?.value,
        'currency':Number(this.DepitEntryNoteForm.get('currency')?.value),
        'duedate': this._DatePipe.transform(this.DepitEntryNoteForm.get('duedate')?.value, 'YYY-MM-dd'),
        'invoivcedate': this._DatePipe.transform(this.DepitEntryNoteForm.get('invoivcedate')?.value, 'YYY-MM-dd'),
        'amount':this.DepitEntryNoteForm.get('amount')?.value,

      }
          console.log(this.ModelType);
    // if(this.CreditEntryNoteForm.get('entryType')?.value== true){
      console.log("1");
      this.CreditEntryArr1.push(this.ModelType);
      console.log("this.CreditEntryArr",this.CreditEntryArr1);
      this.DepitEntryNoteForm.reset()
      this.referncenumber1=this.getTotalAddCreditEntry1()-this.getTotalDepitEntry1()
      
    }else{
       this.ModelType={
        'entryType':3,
        "credit": 0,
        "debit": this.DepitEntryNoteForm.get('amount')?.value,
        'mainAccountId':this.DepitEntryNoteForm.get('mainAccountId')?.value==''?null:Number(this.DepitEntryNoteForm.get('mainAccountId')?.value),
        'subAccountId':this.DepitEntryNoteForm.get('subAccountId')?.value==''?null:Number(this.DepitEntryNoteForm.get('subAccountId')?.value),
        'referenceNumber':this.DepitEntryNoteForm.get('referenceNumber')?.value==''?null:this.DepitEntryNoteForm.get('referenceNumber')?.value,
        'currency':Number(this.DepitEntryNoteForm.get('currency')?.value),
        'duedate': this._DatePipe.transform(this.DepitEntryNoteForm.get('duedate')?.value, 'YYY-MM-dd'),
        'invoivcedate': this._DatePipe.transform(this.DepitEntryNoteForm.get('invoivcedate')?.value, 'YYY-MM-dd'),
        'amount':this.DepitEntryNoteForm.get('amount')?.value,
      }
           console.log(this.ModelType);
    // if(this.CreditEntryNoteForm.get('entryType')?.value== true){
      console.log("1");
      this.DepitEntryArr1.push(this.ModelType);
      console.log("this.DepitEntryArr1",this.DepitEntryArr1);
      this.DepitEntryNoteForm.reset()
      this.referncenumber1=this.getTotalAddCreditEntry1()-this.getTotalDepitEntry1()
    }
    // let Model={
    //   'mainAccountId':this.DepitEntryNoteForm.get('mainAccountrId')?.value,
    //   'subAccountId':this.DepitEntryNoteForm.get('subAccountId')?.value==null?'':this.DepitEntryNoteForm.get('subAccountId')?.value,
    //   'refrenceNumber':this.DepitEntryNoteForm.get('refrenceNumber')?.value==null?'':this.DepitEntryNoteForm.get('refrenceNumber')?.value,
    //   'amount':this.DepitEntryNoteForm.get('amount')?.value,
    //   'currency':this.DepitEntryNoteForm.get('currency')?.value,
    //   'duedate': this._DatePipe.transform(this.DepitEntryNoteForm.get('duedate')?.value, 'YYY-MM-dd'),
    //   'invoivcedate': this._DatePipe.transform(this.DepitEntryNoteForm.get('invoivcedate')?.value, 'YYY-MM-dd')


    // }
    // console.log(Model);
    // if(this.DepitEntryNoteForm.get('entryType')?.value== true){
    //   console.log("1");
    //   this.CreditEntryArr1.push(Model);
    //   console.log("this.CreditEntryArr1",this.CreditEntryArr1);
    //   this.DepitEntryNoteForm.reset()
    //   this.referncenumber1=this.getTotalAddCreditEntry1()-this.getTotalDepitEntry1()
    // }else{
    //   console.log("2");
    //   this.DepitEntryArr1.push(Model);
    //   console.log("this.DepitEntryArr1",this.DepitEntryArr1);
    //   this.DepitEntryNoteForm.reset()
    //   this.referncenumber1=this.getTotalAddCreditEntry1()-this.getTotalDepitEntry1()
    // }
  }
  removeCreditEntry1(index:number){
    this.CreditEntryArr1.splice(index, 1)
    this.referncenumber1=this.getTotalAddCreditEntry1()-this.getTotalDepitEntry1()
  }
  removeDepitEntry1(index:number){
    this.DepitEntryArr1.splice(index, 1)
    this.referncenumber1=this.getTotalAddCreditEntry1()-this.getTotalDepitEntry1()
  }
  getTotalAddCreditEntry1(): number {
    return this.CreditEntryArr1.reduce((sum: any, item: { amount: any; }) => sum + (item.amount || 0), 0);
  }

  getTotalDepitEntry1(): number {
    return this.DepitEntryArr1.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
   finalArray:any[]=[]
     isclicked:boolean=false
    FinalSave(){
      this.isSubmitted=true
      this.finalArray = this.CreditEntryArr1.concat(this.DepitEntryArr1);
      console.log("this.finalArray",this.finalArray);
      this._AccountsService.AddDebitNote(this.finalArray).subscribe((data:any)=>{
          console.log(data);
          Swal.fire('AddedSucces')
          this.isSubmitted=false
          this.CreditEntryArr1=[]
          this.DepitEntryArr1=[]
        },error=>{
          console.log(error);
          this.isSubmitted=false
        })
    }
  
  AllSupArr:any[]=[]
  MainAccpuntID:any
GetAllSupAccounts(e:any){
  this.AllInsurars=[]
  // this.accountTransactionsForm.get('subAccountId')?.setValue('')
  // this.accountTransactionsForm.get('subOfSubAccountId')?.setValue('')
  console.log("ok");
  console.log(e.target.value);
  this.MainAccpuntID=e.target.value
  let object=this.AllAccountsForRecieptAndPayments.filter((item: { mainId: any; })=>item.mainId==e.target.value)
  console.log(object);
  this.AllSupArr=[]
  this.AllSupArr.push(...object)
  console.log(this.AllSupArr);
  if(this.AllSupArr.length==0){
      this._AccountsService.GetAllInsurerForAccount(this.MainAccpuntID).subscribe((data:any)=>{
        console.log(data);
        this.AllInsurars=data
      })
    }
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
// getName(id:any){
//   const account = this.AllAccounts.find((item: { id: any; })=>item.id==id)
//   // console.log(account);
//   if(account){
//     return account.name;
//   }  
// }
getaccountNamee(customerId:string):string{
  let object=this.AllAccountsForRecieptAndPayments.find((item: { id: string; })=>item.id==customerId)
  return object?.name
}
getsupaccountName(customerId:string):string{
  let object=this.AllSupArr.find((item: { id: string; })=>item.id==customerId)
  return object?.name
}
getcurrincyName(customerId:string):string{
  let object=this.AllCurrinces.find((item: { id: string; })=>item.id==customerId)
  return object?.value
}
getinsurerName(customerId:string):string{
  let object=this.AllInsurars.find((item: { id: string; })=>item.id==customerId)
  return object?.name
}
AllCurrinces:any[]=[]
GetAllCurrinces(){
  this._ListsService.getCurrencies().subscribe((data:any)=>{
    console.log("AllCurrinces",data)
    this.AllCurrinces=data
  })
}
  AllAccountsForRecieptAndPayments:any[]=[]
  GetAllAccountsForRecieptAndPayments(){
    this.isLoading = true;
    this._AccountsService.GetAllAccountsForRecieptAndPayments().subscribe((data:any)=>{
      this.isLoading = false;
    console.log(data);
    this.AllAccountsForRecieptAndPayments = data
    },error =>{
    this.isLoading = false;
    console.log(error);  
    })
  }



  ngOnInit(): void {
    this.GetAllAccountsForRecieptAndPayments()
    this.GetAllCurrinces()
  }

}
