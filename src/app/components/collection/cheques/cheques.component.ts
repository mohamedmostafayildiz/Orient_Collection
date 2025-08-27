import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionService } from 'src/app/services/transaction.service';
declare var $ : any
@Component({
  selector: 'app-cheques',
  templateUrl: './cheques.component.html',
  styleUrls: ['./cheques.component.scss']
})
export class ChequesComponent implements OnInit {
  SearchForm:FormGroup = new FormGroup({
    'chequeNumber':new FormControl(''),
    'status':new FormControl(''),
  })
  constructor(private _SharedService:SharedService,private _TransactionService:TransactionService){}
  loading:boolean=false
  AllCheqes:any[]=[]
  isClicked:boolean=false
  ArrTest:any[]=[]
    getCheckedValues(event:any,Policy:any,checked:any){
    console.log("checked",checked);
    let Id = Policy.id
    let checkboxElement = event.source; 
    // let Model ={
    //   Id
    // }
    if(checked==true){
      this.ArrTest.push(Id)
    }else{
      let item = this.ArrTest.find(item=>Policy.id==item.collectionId)
      let Index = this.ArrTest.indexOf(item)
      this.ArrTest.splice(Index, 1)
    }
    console.log(this.ArrTest);
  }


   Search(){
    this.loading = true;
    console.log(this.SearchForm.value);
    let Model =Object.assign(this.SearchForm.value)
    console.log(Model);
    this._TransactionService.GetAllReturnCheques(Model).subscribe((data:any)=>{
      console.log(data);
      this.loading = false;
      this.AllCheqes = data;
      this.SearchForm.reset()
    },error=>{
      console.log(error);
      this.loading = false;
    })
  }
  converCheck(){
    this.isClicked=true
    this._TransactionService.ConvertCheques(this.ArrTest).subscribe((data:any)=>{
      console.log(data);
      this.Search();
      this.isClicked=false
      this.ArrTest=[]
    },error=>{
      console.log(error);
      this.isClicked=false
    })
  }
  ngOnInit(): void {
    this._SharedService.changeData(false,'','',true,false);
     this._SharedService.currentMessage.subscribe(message => {
        if(message){
          $("#filters").show(300)
        }else{
          $("#filters").hide(300)
        }
      });
    this.Search()
  }
}
