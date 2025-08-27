import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { right } from '@popperjs/core';
// import { DxTreeListModule } from 'devextreme-angular';
import { AccountsService } from 'src/app/services/accounts.service';
declare var $:any
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { __values } from 'tslib';
import { ToastrService } from 'ngx-toastr';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { FilesService } from 'src/app/services/files.service';
@Component({
  selector: 'app-accountingreport',
  templateUrl: './accountingreport.component.html',
  styleUrls: ['./accountingreport.component.scss'],
  providers:[DatePipe]
  
})
export class AccountingreportComponent {
  constructor(private _DatePipe:DatePipe, private _ActivatedRoute:ActivatedRoute,private _Router:Router,private _FilesService:FilesService){}
  loading:boolean = false
  isClicked:boolean=false
  FileName:any
  SearchForm:FormGroup = new FormGroup({
    'from':new FormControl(''),
    'to':new FormControl('')
  })
  fromToDateInvalid(): boolean {
    const fromDate = this.SearchForm.get('from')?.value||'2000-10-10';
    const toDate = this.SearchForm.get('to')?.value||'2050-10-10';
    return fromDate && toDate && new Date(fromDate) > new Date(toDate);
  }
  Search(){
    this.isClicked = true;
    // $("#SearchResults").show(300);
    let Model ={
      from:this.SearchForm.get('from')?.value ? this._DatePipe.transform(this.SearchForm.get('from')?.value, "yyyy-MM-dd") : '',
      to:this.SearchForm.get('to')?.value ? this._DatePipe.transform(this.SearchForm.get('to')?.value, "yyyy-MM-dd") : '',
      // to:this._DatePipe.transform(this.SearchForm.get('to')?.value,  "yyyy-MM-dd"),
    }
    console.log(Model);
    
    this._FilesService.GetAccountingRecordReport(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= ' من'+Model.from +' إلي'+Model.to+ " تقرير سجل القيود.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
      this.SearchForm.reset()
      Swal.fire({title:'File downloaded Successfully',timer:3000, timerProgressBar: true})

    },async error=>{
      console.log(error);
      
      this.isClicked = false;
      const message = await error.error.text()
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
    })
  }
  ngOnInit(): void {
  }
}
