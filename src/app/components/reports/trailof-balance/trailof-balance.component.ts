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
  selector: 'app-trailof-balance',
  templateUrl: './trailof-balance.component.html',
  styleUrls: ['./trailof-balance.component.scss'],
  providers:[DatePipe]

})
export class TrailofBalanceComponent implements OnInit {
  constructor(private _DatePipe:DatePipe, private _ActivatedRoute:ActivatedRoute,private _Router:Router,private _FilesService:FilesService){}
  loading:boolean = false
  isClicked:boolean=false
  FileName:any
  SearchTrailOfBalanceForm:FormGroup = new FormGroup({
    'from':new FormControl(''),
    'to':new FormControl('',[Validators.required])
  })
  fromToDateInvalid(): boolean {
    const fromDate = this.SearchTrailOfBalanceForm.get('from')?.value||'2000-10-10';
    const toDate = this.SearchTrailOfBalanceForm.get('to')?.value||'2050-10-10';
    return fromDate && toDate && new Date(fromDate) > new Date(toDate);
  }
  isClickedBalance:boolean=false
  SearchTrailOfBalance(){
    this.isClickedBalance = true;
    // $("#SearchResults").show(300);
    let Model ={
      from:this.SearchTrailOfBalanceForm.get('from')?.value ? this._DatePipe.transform(this.SearchTrailOfBalanceForm.get('from')?.value, "yyyy-MM-dd") : '',
      to:this.SearchTrailOfBalanceForm.get('to')?.value ? this._DatePipe.transform(this.SearchTrailOfBalanceForm.get('to')?.value,  "yyyy-MM-dd"): '',
    }
    console.log(Model);
    this._FilesService.GetBalanceTrailReport(Model).subscribe(res=>{
      this.isClickedBalance = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= "Trial Of Balance.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
      this.SearchTrailOfBalanceForm.reset()
      Swal.fire({title:'File downloaded Successfully',timer:3000, timerProgressBar: true})

    },async error=>{
      console.log(error);
      
      this.isClickedBalance = false;
      // const message = await error.error.text()
      // Swal.fire({icon: 'error',title: 'Oops...',text: message});
    })
  }
  ngOnInit(): void {
  }
}
