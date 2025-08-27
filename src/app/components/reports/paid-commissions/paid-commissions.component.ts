import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any
@Component({
  selector: 'app-paid-commissions',
  templateUrl: './paid-commissions.component.html',
  styleUrls: ['./paid-commissions.component.scss'],
  providers : [DatePipe]
})
export class PaidCommissionsComponent {
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe,private _AdminService:AdminService,private _sharedservices:SharedService){}
  isClicked:boolean =false
  MedicalPublicationsStatistics:any
  SearchForm:FormGroup = new FormGroup({
    'From':new FormControl(''),
    'To':new FormControl(''),
    'PolicyCode':new FormControl(''),
    'ClientName':new FormControl(''),
    'BrokerId':new FormControl(''),
  })
  FileName:any
  brokerCustomers:any

  Search(){
    this.isClicked = true;
    $("#SearchResults").show(300);
    
    let Model =Object.assign(this.SearchForm.value,
      { From:this.SearchForm.get('From')?.value==''||this.SearchForm.get('From')?.value==null?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd"),
        To:this.SearchForm.get('To')?.value==''||this.SearchForm.get('To')?.value==null?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")
      }
    )
    console.log(Model);
    
    this._ReportsService.PaidCommissions(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= " عمولات منصرفة.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
      this._sharedservices.setAlertMessage(`${this.FileName} downloaded successfully`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },async error=>{
      console.log(error);
      
      this.isClicked = false;
      const message = await error.error.text()
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
      
    })
  }
    //get Broker Customers
    getBrokerCustomers(){
      this._AdminService.getAllCustomers(3).subscribe(data=>{
        this.brokerCustomers= data;
      })
    }


    ngOnInit(): void {

      this.getBrokerCustomers();
    }
}
