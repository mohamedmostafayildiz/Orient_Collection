import { Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
declare var $:any;
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FilesService } from 'src/app/services/files.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-curency-exchangepermits',
  templateUrl: './curency-exchangepermits.component.html',
  styleUrls: ['./curency-exchangepermits.component.scss']
})
export class CurencyExchangepermitsComponent {
  constructor(private _FilesService:FilesService,private _ToastrService:ToastrService,private _SharedService:SharedService){}
  ngOnInit(): void {
    this._SharedService.changeData(false,'','',false,false);

  } 
  // Currency Exchange Rate File
FILEeName:any
getTempleteCustomerFile(){
  this._FilesService.GetCurrencyExchangeRateTemplete().subscribe(res=>{
    console.log(res);
    let blob:Blob = res.body as Blob
    this.FILEeName= 'Currency Exchange Rate File.xlsx'
    let a= document.createElement('a');
    a.download=this.FILEeName
    a.href=window.URL.createObjectURL(blob)
    a.click()
  })
}
CurrencyExchangeRateTempleteFile:any=''
uploadCurrencyExchangeRateTemplete(event: any){
  console.log(event);
  // Get File Object
  this.CurrencyExchangeRateTempleteFile = event.target.files[0] ?? null;
  console.log(this.CurrencyExchangeRateTempleteFile);
  event.target.value='' 
} 

//Save File
isClicked:boolean=false
formData:any = new FormData()

SaveFile(){
  this.formData.append('File',this.CurrencyExchangeRateTempleteFile);
  for (var pair of this.formData.entries()){
    console.log(pair[0]+ ', ' + pair[1]); 
  }  
  this.isClicked=true
  this._FilesService.UploadeCurrencyExchangeRateTemplete(this.formData).subscribe((res:any)=>{
    console.log(res);
    this.isClicked=false
    this.CurrencyExchangeRateTempleteFile=''
    // Swal.fire(res,'','success')
    this._ToastrService.success('File Uploaded successfully')
  },error=>{
    console.log('error');
    console.log(error);
    Swal.fire({icon: 'error',title:error.error,text:''})
    this._ToastrService.error(error.error, )
    this.isClicked=false
  })
}
}
