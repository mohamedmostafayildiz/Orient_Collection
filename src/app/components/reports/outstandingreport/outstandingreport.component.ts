import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any
import { ReInsuranceService } from 'src/app/services/re-insurance.service';

@Component({
  selector: 'app-outstandingreport',
  templateUrl: './outstandingreport.component.html',
  styleUrls: ['./outstandingreport.component.scss'],
  providers : [DatePipe]
})
export class OutstandingreportComponent implements OnInit {
  
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe, private _ReInsuranceService:ReInsuranceService){}
  isClicked:boolean =false
  MedicalPublicationsStatistics:any
  UYList:any[]=[]
  PeriodsList:any[]=[{id:1,value:1},{id:2,value:2},{id:3,value:3},{id:4,value:4}]
  Form:FormGroup = new FormGroup({
    'underwritingYear':new FormControl(''),
    'treatyName':new FormControl('',[Validators.required]),
    'period':new FormControl('',[Validators.required]),
  })
  // UY
  GetAllUnderWritingYears(){
    this._ReInsuranceService.GetAllUnderWritingYears().subscribe((data:any)=>{
      this.UYList = data;
    })
  }
   // Treaties
   TreatiesList:any[]=[]
   GetAllTreatiesNames(year:any){
    this._ReInsuranceService.GetAllTreatiesNames(year).subscribe((data:any)=>{
      this.TreatiesList = data;
    })
  }
  // getUy
  getUY(){
    this.GetAllTreatiesNames(this.Form.get("underwritingYear")?.value)
  }
  getTreatyName(){
    this.GetAllTreatiesNames(this.Form.get("underwritingYear")?.value)
  }
  FileName:any
  Search(){
    console.log(this.Form.value);
    this.isClicked = true;
    // $("#SearchResults").show(300);
    let Model ={
      name:this.Form.get('treatyName')?.value,
      period:this.Form.get('period')?.value,
    }
    this._ReportsService.outstandingReport(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName="Out Standing Report.xlsx"
      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();this.Form.reset()

    },error=>{
      this.isClicked = false; if (error.error instanceof Blob && error.error.type === "text/plain") {
        // Convert Blob to text
        error.error.text().then((errorMessage: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
          });
        });
      } 
    })
  }
ngOnInit(): void {
  this.GetAllUnderWritingYears();
}
}



