import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-unpaidclaims-report',
  templateUrl: './unpaidclaims-report.component.html',
  styleUrls: ['./unpaidclaims-report.component.scss'],
  providers:[DatePipe]
})
export class UnpaidclaimsReportComponent {
  loading:boolean =false;
  AllData:any
  constructor(private _DatePipe:DatePipe,private _ReportsService:ReportsService){}
  Form:FormGroup = new FormGroup({
    start:new FormControl('',[Validators.required]),
    end:new FormControl('',[Validators.required])
  })
  FileName:any
  Search(){
    this.loading = true
    let Model={
      start:this._DatePipe.transform(this.Form.get('start')?.value,'YYYY/MM/dd'),
      end:this._DatePipe.transform(this.Form.get('end')?.value,'YYYY/MM/dd')
    }
    console.log(Model);
    this._ReportsService.UnpaidClaim(Model).subscribe((data:any)=>{
      this.loading = false;
      let blob:Blob = data.body as Blob
      this.FileName= 'UnPaidClaimReport.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
      
    },async error=>{
      this.loading = false;
      const message = await error.error.text()
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
    })
}
}
