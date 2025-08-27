import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any
import { DatePipe } from '@angular/common';
import { ClaimsService } from 'src/app/services/claims.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-claims-ratio',
  templateUrl: './claims-ratio.component.html',
  styleUrls: ['./claims-ratio.component.scss'],
  providers : [DatePipe]
})
export class ClaimsRatioComponent {
  isClicked:boolean=false
  FileName:any

  constructor(private _ClaimsService:ClaimsService, private _DatePipe:DatePipe,private _SharedService:SharedService){}
  SearchForm:FormGroup = new FormGroup({
    'PolicyCode':new FormControl('',[Validators.required]),
    'OutStanding':new FormControl('',[Validators.required]),
    'IBNR':new FormControl('',[Validators.required])
  })
  additionalTypes:any[]=[]
  getTpaType(){
    this._ClaimsService.GetTpaTypes().subscribe((data:any)=>{
      console.log(data);
      this.additionalTypes=data
    })
  }
  Search(){
    this.isClicked = true;
    let Model ={
      policyCode:this.SearchForm.get('PolicyCode')?.value,
      outStanding:this.SearchForm.get('OutStanding')?.value,
      iBNR:this.SearchForm.get('IBNR')?.value,
    }
    console.log(Model);
    this._ClaimsService.LossRatioReport(Model).subscribe(res=>{
      this.isClicked = false;
      // console.log(res);
        let blob:Blob = res.body as Blob
        this.FileName= 'LossRatioReport.xlsx'
        let a= document.createElement('a');
        a.download=this.FileName;
        a.href=window.URL.createObjectURL(blob);
        a.click();
        this._SharedService.setAlertMessage(`${this.FileName} downloaded successfully`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Swal.fire({title:'File downloaded Successfully',timer:3000, timerProgressBar: true})
    },async error=>{
      this.isClicked = false;
      const message = await error.error.text()
      // console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
    }) 
  }
  ResetForm(){
    this.SearchForm.reset()
  }
  ngOnInit(): void {
    this.getTpaType()
  }
}
