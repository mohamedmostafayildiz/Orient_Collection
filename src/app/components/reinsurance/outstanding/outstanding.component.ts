import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClaimsService } from 'src/app/services/claims.service';
import { PolicyService } from 'src/app/services/policy.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any
@Component({
  selector: 'app-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.scss'],
  providers:[DatePipe]
})
export class OutstandingComponent {
  selectedMainFile:any='';
  FileName:any;
  MainFileId:any;
  formData:any = new FormData()
  loading:boolean = false
  isClicked:boolean = false;
  Quarter:any
  PolicyId:any
  // Claim1Date:any = ''
  ExcelFileId:any=''
  CurrentDate:any = new Date();

  ClaimForm:FormGroup = new FormGroup({
    'Period':new FormControl(this.CurrentDate,[Validators.required]),
    'DateOfReceipt':new FormControl('',[Validators.required]),
  })
  
  constructor(private _ClaimsService:ClaimsService,private _SharedService:SharedService,
    private _ReInsuranceService:ReInsuranceService,private _DatePipe:DatePipe
    ,private _ActivatedRoute:ActivatedRoute, private _Router:Router,private _ToastrService:ToastrService){
      this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
  }

      // get Temp
  getTempleteFile(){
    this._ClaimsService.getClaimsTempleteFileRE().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'Claims templete.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }

  Model:any = ''
  FileNoteStatus:any=''
  /////////////////////// Save Main File //////////////
  SubmitOutStanding(){
    this.isClicked = true;
    this.formData.append('PolicyId',this.PolicyId);
    this.formData.append('File',this.selectedMainFile);
    
    this.Model = Object.assign(this.ClaimForm.value,
      {EnteryDate:this._DatePipe.transform(this.CurrentDate,'yyyy-MM-dd')},
      {DateOfReceipt:this._DatePipe.transform(this.ClaimForm.get('DateOfReceipt')?.value,'yyyy-MM-dd')==null?'':this._DatePipe.transform(this.ClaimForm.get('DateOfReceipt')?.value,'yyyy-MM-dd')},
    )
    // Append Values
    for (const key of Object.keys(this.Model)){
      const value = this.Model[key];
      this.formData.append(key, value);
    }
    // Log Values
    for (var pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    
    this._ReInsuranceService.AddOutstanding(this.formData).subscribe((res:any)=>{
      console.log(res);
      this.isClicked = false;
      // Swal.fire('Outstanding Added Successfully','','success')
      this._SharedService.setAlertMessage('Outstanding Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth'});
    },error=>{
      $("#FinalBtn").show(500);
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.selectedMainFile = ''
    })
    this.formData = new FormData()
    
  }

  
  uploadMainFile(event: any){
    this.selectedMainFile = event.target.files[0] ?? null;
    event.target.value=''
  }
// Quarters
GetAvailablePeriodsForOutstanding(){
    this._ReInsuranceService.GetAvailablePeriodsForOutstanding().subscribe((data:any)=>{
      this.Quarter = data;
    })
  }
  ngOnInit(){
    this.GetAvailablePeriodsForOutstanding()
  }
}
