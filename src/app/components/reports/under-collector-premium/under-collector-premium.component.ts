import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-under-collector-premium',
  templateUrl: './under-collector-premium.component.html',
  styleUrls: ['./under-collector-premium.component.scss'],
  providers : [DatePipe]
})
export class UnderCollectorPremiumComponent {
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe,private _SharedService:SharedService){}
  isClicked:boolean =false
  MedicalPublicationsStatistics:any
  SearchForm:FormGroup = new FormGroup({
    'to':new FormControl(''),
    'policyCode':new FormControl(''),
    'ClientName':new FormControl('')
  })
  FileName:any

  Search(){
    console.log(this.SearchForm.get('to')?.value);
    
    this.isClicked = true;
    $("#SearchResults").show(300);
    let Model ={
      PolicyCode:this.SearchForm.get("policyCode")?.value,
      ClientName:this.SearchForm.get("ClientName")?.value,
      To:this.SearchForm.get('to')?.value==''||this.SearchForm.get('to')?.value==null?'':this._DatePipe.transform(this.SearchForm.get('to')?.value,"yyyy-MM-dd"),
      From:'',
      brokerId:''
    }
    console.log(Model);
    
    this._ReportsService.UnderCollectorPremium(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= "سجل اقساط تحت التحصيل.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
      this._SharedService.setAlertMessage(`${this.FileName} downloaded successfully`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },async error=>{
      this.isClicked = false;
      const message = await error.error.text()
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
      
    })
  }
}
