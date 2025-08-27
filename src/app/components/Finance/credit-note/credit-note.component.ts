import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { ListsService } from 'src/app/services/lists.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent {
  isSubmitted:boolean=false
  isLoading:boolean=false
  CreditEntryArr:any=[]
  DepitEntryArr:any[]=[]
  referncenumber:any
  constructor(private _AccountsService:AccountsService,private _ListsService:ListsService){}
   // Credit Note Entry
   CreditEntryNoteForm:FormGroup = new FormGroup({
    'entryType':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'currency':new FormControl('',[Validators.required]),
    'mainAccountId':new FormControl('',[Validators.required]),
    'subAccountId':new FormControl(''),
    'referenceNumber':new FormControl('',[Validators.required]),
  })
  MainAmount:any
  ModelType:any={}
  AddCreditEntry(){
    if(this.CreditEntryNoteForm.get('entryType')?.value==true){
      this.ModelType={
        'entryType':2,
        "credit": this.CreditEntryNoteForm.get('amount')?.value,
        "debit": 0,
        'mainAccountId':this.CreditEntryNoteForm.get('mainAccountId')?.value==''?null:Number(this.CreditEntryNoteForm.get('mainAccountId')?.value),
        'subAccountId':this.CreditEntryNoteForm.get('subAccountId')?.value==''?null:Number(this.CreditEntryNoteForm.get('subAccountId')?.value),
        'referenceNumber':this.CreditEntryNoteForm.get('referenceNumber')?.value==''?null:this.CreditEntryNoteForm.get('referenceNumber')?.value,
        'currency':Number(this.CreditEntryNoteForm.get('currency')?.value),
        'amount':this.CreditEntryNoteForm.get('amount')?.value,

      }
          console.log(this.ModelType);
    // if(this.CreditEntryNoteForm.get('entryType')?.value== true){
      console.log("1");
      this.CreditEntryArr.push(this.ModelType);
      console.log("this.CreditEntryArr",this.CreditEntryArr);
      this.CreditEntryNoteForm.reset()
      this.referncenumber=this.getTotalAddCreditEntry()-this.getTotalDepitEntry()
      
    }else{
       this.ModelType={
        'entryType':2,
        "credit": 0,
        "debit": this.CreditEntryNoteForm.get('amount')?.value,
        'mainAccountId':this.CreditEntryNoteForm.get('mainAccountId')?.value==''?null:Number(this.CreditEntryNoteForm.get('mainAccountId')?.value),
        'subAccountId':this.CreditEntryNoteForm.get('subAccountId')?.value==''?null:Number(this.CreditEntryNoteForm.get('subAccountId')?.value),
        'referenceNumber':this.CreditEntryNoteForm.get('referenceNumber')?.value==''?null:this.CreditEntryNoteForm.get('referenceNumber')?.value,
        'currency':Number(this.CreditEntryNoteForm.get('currency')?.value),
        'amount':this.CreditEntryNoteForm.get('amount')?.value,
      }
           console.log(this.ModelType);
    // if(this.CreditEntryNoteForm.get('entryType')?.value== true){
      console.log("1");
      this.DepitEntryArr.push(this.ModelType);
      console.log("this.DepitEntryArr",this.DepitEntryArr);
      this.CreditEntryNoteForm.reset()
      this.referncenumber=this.getTotalAddCreditEntry()-this.getTotalDepitEntry()
    }

      
    // }else{
    //   console.log("2");
    //   this.DepitEntryArr.push(this.ModelType);
    //   console.log("this.DepitEntryArr",this.DepitEntryArr);
    //   this.CreditEntryNoteForm.reset()
    //   this.referncenumber=this.getTotalAddCreditEntry()-this.getTotalDepitEntry()
    // }
  }
  removeCreditEntry(index:number){
    this.CreditEntryArr.splice(index, 1)
    this.referncenumber=this.getTotalAddCreditEntry()-this.getTotalDepitEntry()
  }
  removeDepitEntry(index:number){
    this.DepitEntryArr.splice(index, 1)
    this.referncenumber=this.getTotalAddCreditEntry()-this.getTotalDepitEntry()
  }
  getTotalAddCreditEntry(): number {
    return this.CreditEntryArr.reduce((sum: any, item: { amount: any; }) => sum + (item.amount || 0), 0);
  }

  getTotalDepitEntry(): number {
    return this.DepitEntryArr.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  finalArray:any[]=[]
  isclicked:boolean=false
  FinalSave(){
    this.isSubmitted=true
    this.finalArray = this.CreditEntryArr.concat(this.DepitEntryArr);
    console.log("this.finalArray",this.finalArray);
    this._AccountsService.AddCreditNote(this.finalArray).subscribe((data:any)=>{
        console.log(data);
        Swal.fire('AddedSucces')
        this.isSubmitted=false
        this.CreditEntryArr=[]
        this.DepitEntryArr=[]
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
