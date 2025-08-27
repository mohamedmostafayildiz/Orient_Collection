import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any
import { DatePipe } from '@angular/common';
import { ClaimsService } from 'src/app/services/claims.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-rejected-claims',
  templateUrl: './rejected-claims.component.html',
  styleUrls: ['./rejected-claims.component.scss'],
  providers : [DatePipe]

})
export class RejectedClaimsComponent {
  values:any[]=[]
  AllRejectedArr:any[]=[]
  isClicked:boolean =false
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  loading:boolean = false;
  constructor(private _ClaimsService:ClaimsService, private _DatePipe:DatePipe,private _SharedService:SharedService){}
  SearchForm:FormGroup = new FormGroup({
    'From':new FormControl(''),
    'To':new FormControl(''),
    'PolicyCode':new FormControl(''),
    'TPAType':new FormControl('')
  })
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
    // GetAllRejectedClaims(){
    //   this._ClaimsService.GetAllRejectedClaims().subscribe((data:any)=>{
    //     console.log(data);
    //     this.AllRejectedArr = data
    //   })
    // }
    additionalTypes:any[]=[]
    getTpaType(){
      this._ClaimsService.GetTpaTypes().subscribe((data:any)=>{
        console.log(data);
        this.additionalTypes=data
      })
  
    }
    Search(){
      this.isClicked = true;
      // $("#SearchResults").show(300);
      let Model ={
        from: this.SearchForm.get('From')?.value 
        ? this._DatePipe.transform(this.SearchForm.get('From')?.value, 'yyyy-MM-dd') 
        : '',
        to: this.SearchForm.get('To')?.value 
        ? this._DatePipe.transform(this.SearchForm.get('To')?.value, 'yyyy-MM-dd') 
        : '',
        policyCode:this.SearchForm.get('PolicyCode')?.value,
        tPAType:this.SearchForm.get('TPAType')?.value,
      }
      console.log(Model);
      this._ClaimsService.GetAllRejectedClaims(Model).subscribe((data:any)=>{
        this.isClicked = false;
        this.AllRejectedArr = data;
        console.log(data);
      },error=>{
        console.log(error);
        this.isClicked = false;
      })
  
      
    }
    ResetForm(){
      this.SearchForm.reset()
      this.Search()
    }
      // Get Item Id
  IndexesArr:any[]=[]
  getItemId(Checked:any,i:any,Id:any,Status:any){
    if(Checked ==true){
      this.IndexesArr.push({
        fileClaimsIds:Id,
        status:1
      })
      // this.IndexesArr.push(Model);
      console.log(this.IndexesArr); 

    }else{
      // let index = this.IndexesArr.indexOf(i);
      // this.IndexesArr.splice(index , 1)
      const item = this.IndexesArr.find(item => item.fileClaimsIds == Id);
      // if (item) {
        this.IndexesArr.splice(item, 1);
        console.log(this.IndexesArr); 

      // }
      console.log(this.IndexesArr); 
    }
  }
  SelectAll(){
    // this.ArrTest = []
    this.IndexesArr = []
    for(let i=0; i< this.AllRejectedArr.length;i++){
      if(this.AllRejectedArr[i].status =="rejected"){
        // this.IndexesArr.push(i)
        this.values[i]=true;
        this.IndexesArr.push({
          fileClaimsIds:this.AllRejectedArr[i].id,
          status:1
        })
        // this.IndexesArr.push(i)
      }
    }
    console.log(this.IndexesArr);
  }
  ClaimStatus:any
  SubmitItems(){
    this.isClicked =true
    this._ClaimsService.UpdateStatusformRejectedtoconfirm(this.IndexesArr).subscribe((data:any)=>{
      console.log(data);
      // this.ClaimStatus=data[0].status
      Swal.fire('Claim Updated Successfully','','success')
      for(let i=0; i< this.AllRejectedArr.length;i++){
        this.values[i]=false;
      }
      this.Search()
      // window.location.reload();
      this.isClicked = false
    },error=>{
      console.log(error);
      this.isClicked = false
      for(let i=0; i< this.AllRejectedArr.length;i++){
        this.values[i]=false;
      }
    })
    this.IndexesArr = []

  }
  ngOnInit(): void {
    this._SharedService.changeData(false,'','',false,false);

    this.Search();
    this.getTpaType();
    // this.GetAllRejectedClaims();
  }

}
