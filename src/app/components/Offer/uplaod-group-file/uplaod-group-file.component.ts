import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-uplaod-group-file',
  templateUrl: './uplaod-group-file.component.html',
  styleUrls: ['./uplaod-group-file.component.scss']
})
export class UplaodGroupFileComponent implements OnInit{

  FileName:any
  selectedFile:any
  isClickedDocumnet:boolean=false
  OfferId:any
  AllPolicyGroup:any
  loading:boolean = false;
  constructor(public _location:Location,private _PolicyService:PolicyService , private _Router:Router, private _ActivatedRoute:ActivatedRoute,private _SharedService:SharedService){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.OfferId=Number(this.OfferId)
  }

  getTempleteFile(){
    this._PolicyService.getGroupTempleteFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'group templete.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }

  uploadFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile);
  }
        //Save File
  SaveGroup(){
    this.isClickedDocumnet=true
    var formData = new FormData()
    formData.append('employeesFile',this.selectedFile);
    this._PolicyService.UploadGroupFile(this.OfferId,formData).subscribe(res=>{
      this.isClickedDocumnet=false
      this._Router.navigate(['/Calculations/'+this.OfferId])
      console.log(res);
      this.getGroupOfPolicy()
      // Swal.fire(res,'','success')
      this._SharedService.setAlertMessage(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.isClickedDocumnet=false
    })
  }
  getGroupOfPolicy(){
    this._PolicyService.getGroupOfPolicy(this.OfferId).subscribe(data=>{
      this.AllPolicyGroup = data;
      console.log(data);
    },error=>
    {
      console.log(error)
    })
  }
  ngOnInit(): void {
    this.getGroupOfPolicy()
  }
}
