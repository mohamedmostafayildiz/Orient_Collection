import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any
import { DatePipe } from '@angular/common';
import { ClaimsService } from 'src/app/services/claims.service';
@Component({
  selector: 'app-claims-collection',
  templateUrl: './claims-collection.component.html',
  styleUrls: ['./claims-collection.component.scss'],
  providers : [DatePipe]

})
export class ClaimsCollectionComponent implements OnInit {
  isClicked:boolean=false
  FileName:any

  constructor(private _ClaimsService:ClaimsService, private _DatePipe:DatePipe){}
  SearchForm:FormGroup = new FormGroup({
    'From':new FormControl(''),
    'To':new FormControl(''),
    'PolicyCode':new FormControl(''),
    'TPAType':new FormControl('')
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
    this._ClaimsService.CreateClaimsDetailsReport(Model).subscribe((res:any)=>{
      this.isClicked = false;
      // console.log(res);
        let blob:Blob = res.body as Blob
        this.FileName= 'ClaimsDetails.xlsx'
        let a= document.createElement('a');
        a.download=this.FileName;
        a.href=window.URL.createObjectURL(blob);
        a.click();
        Swal.fire({title:'Report downloaded Successfully',timer:3000, timerProgressBar: true})
    }
    ,async error=>{
      this.isClicked = false;
      const message = await error.error.text()
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
    }
  )
  }
  ResetForm(){
    this.SearchForm.reset()
  }
  ngOnInit(): void {
    this.getTpaType()
  }
}
