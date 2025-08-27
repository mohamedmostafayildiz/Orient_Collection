import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReportsService } from 'src/app/services/reports.service';
declare var $:any
@Component({
  selector: 'app-finnanceclaimsreport',
  templateUrl: './finnanceclaimsreport.component.html',
  styleUrls: ['./finnanceclaimsreport.component.scss'],
  providers : [DatePipe]
})
export class FinnanceclaimsreportComponent implements OnInit{
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe){}
  ngOnInit(): void {
  }
  isClicked:boolean =false
  MedicalPublicationsStatistics:any
  SearchForm:FormGroup = new FormGroup({
    'start':new FormControl('',[Validators.required]),
    'end':new FormControl('',[Validators.required])
  })
  FileName:any

  Search(){
    this.isClicked = true;
    $("#SearchResults").show(300);
    let Model ={
      start:this._DatePipe.transform(this.SearchForm.get('start')?.value,"yyyy-MM-dd"),
      end:this._DatePipe.transform(this.SearchForm.get('end')?.value,"yyyy-MM-dd"),
    }
    this._ReportsService.FinanceClaimsReport(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= ' من'+Model.start +' إلي'+Model.end+ " تقرير التعويضات.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();

    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There are no data',
      });
    })
  }
}
