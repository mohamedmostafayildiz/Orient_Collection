import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from 'src/app/services/policy.service';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-all-endorsment',
  templateUrl: './all-endorsment.component.html',
  styleUrls: ['./all-endorsment.component.scss'],
  providers: [DatePipe]
})
export class AllEndorsmentComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[5,8,10,15,20];
  term:any;
  AllData:any[]=[];
  loading:boolean = false;
  constructor(private _PolicyService:PolicyService ,private _DatePipe:DatePipe,private _SharedService:SharedService,private _ReInsuranceService:ReInsuranceService){}
  SearchForm:FormGroup = new FormGroup({
    'PolicyCode':new FormControl(''),
    'EndorsementCode':new FormControl(''),
    'EndorsementType':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl('')
  })


  Search(){
    this.loading = true;
    $("#SearchResults").show(300);
    console.log(this.SearchForm.get('From')?.value);
    
    let Model ={
      From:this.SearchForm.get('From')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd"),
      To:this.SearchForm.get('To')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd"),
      PolicyCode:this.SearchForm.get("PolicyCode")?.value,
      EndorsementCode:this.SearchForm.get("EndorsementCode")?.value,
      EndorsementType:this.SearchForm.get("EndorsementType")?.value
    }
    console.log(Model);
    
    this._PolicyService.getAllEndorsements(Model).subscribe((data:any)=>{
      this.loading = false;
      this.AllData = data;
      console.log(data);
    },error=>{
      console.log(error);
      this.loading = false;
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
  // post To Reinsurance
  postToReinsurance(EndoresmentId:any){
    // this.isClickedPostReinsutance= true;
    let Model = {endoresmentId:EndoresmentId}
    this._ReInsuranceService.PolicyReInsurance(Model).subscribe(res=>{
      this.Search();
      console.log(res);
      this._SharedService.setAlertMessage('Endoresment Posted To Reinsurance Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Endoresment Posted To Reinsurance Successfully','','success')
    },error=>{
      console.log(error);
      // this.isClickedPostReinsutance= false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
    })
  }

  ngOnInit(): void {
    this._SharedService.changeData(false,'Endorsment','InitialEndorsment',true,false);
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });
  }
}
