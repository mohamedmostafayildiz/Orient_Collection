import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ListsService } from 'src/app/services/lists.service';
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-add-benefit',
  templateUrl: './add-benefit.component.html',
  styleUrls: ['./add-benefit.component.scss']
})
export class AddBenefitComponent implements OnInit{
  tpaPlanId:any
  benefitTypeValue:any=''
  BenefitsTypes:any;
  planName:any

  Form:FormGroup = new FormGroup({
    'name':new FormControl('',[Validators.required]),
    'arabicName':new FormControl('',[Validators.required]),
    'coverage':new FormControl('',[Validators.required]),
    'maximumLimit':new FormControl('',[Validators.required]),
    'notes':new FormControl(''),
  })
  constructor(private _ActivatedRoute:ActivatedRoute, private _ListsService:ListsService ,private _AdminService:AdminService){
    this.tpaPlanId = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.planName = this._ActivatedRoute.snapshot.paramMap.get('planName');
}
  getBenefitsTypes(){
    this._ListsService.getBenefitsTypes().subscribe(data=>{
      this.BenefitsTypes=data;
      console.log(data);
      
    })
  }
  coverageCondition(e:any){
    if(e.value==0){
      console.log("0");
      $("#coverageRadio").hide(400);
      this.Form.get('coverage')?.setValue(1)
    }else if(e.value==1){
      console.log("1");
      $("#coverageRadio").show(400)
      this.Form.get('coverage')?.setValue('')
    }
    else if(e.value==2){
      console.log("2");
      $("#coverageRadio").hide(400)
      this.Form.get('coverage')?.setValue(0)
    }
    }

  submitAddBenefitForm(){
    let Model = Object.assign(this.Form.value,
      {benefitType:Number(this.benefitTypeValue)},
      {tpaPlanId:this.tpaPlanId})
    console.log(Model);

    this._AdminService.AddBenefitToPlan(Model).subscribe(res=>{
      console.log(res);
      Swal.fire(
        'Good job!',
        'This Benefit Added Successfully',
        'success'
      )
    },error=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
    })
    
  }

ngOnInit(): void {
    this.getBenefitsTypes();
  }
}
