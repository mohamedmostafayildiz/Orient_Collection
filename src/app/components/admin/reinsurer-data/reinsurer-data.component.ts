import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reinsurer-data',
  templateUrl: './reinsurer-data.component.html',
  styleUrls: ['./reinsurer-data.component.scss']
})
export class ReinsurerDataComponent implements OnInit{
  loading:boolean = false
  customerId:any
  constructor(private _AdminService:AdminService,private _ActivatedRoute:ActivatedRoute){
    this.customerId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }
  

  ReInsurerForm:FormGroup = new FormGroup({
    'reten':new FormControl('', [Validators.required]),
    'addReten':new FormControl('', [Validators.required]),
    'distribution':new FormControl('', [Validators.required]),
  })

  SubmitReInsurerForm(){
    this.loading = true
    console.log(this.ReInsurerForm.value);
    let Model = Object.assign(this.ReInsurerForm.value,{customerId:this.customerId})
    this._AdminService.AddReinsurerData(Model).subscribe(res=>{
      this.loading = false
      console.log(res);
      Swal.fire('Added Successfully','','success')
    },error=>{
      this.loading = false
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''}  )
    })
  }
 
  ngOnInit(): void {
  }
}

