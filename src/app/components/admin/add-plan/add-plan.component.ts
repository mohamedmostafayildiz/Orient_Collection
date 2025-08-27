import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent {
  constructor(private _AdminService:AdminService){}
  typeOfServiceValue:any;
  GeographicalScopeVAlue:any
  palnForm:FormGroup=new FormGroup({
    'planName':new FormControl('',[Validators.required]),
    'annualMaxLimit':new FormControl('',[Validators.required]),
    'accommodationClass':new FormControl('',[Validators.required]),
  })
  submitPlan(){
    let Model =Object.assign(this.palnForm.value,
      {typeOfService:this.typeOfServiceValue},
      {geographicalScope:this.GeographicalScopeVAlue},
      {customerId:1})
      console.log(Model);
    this._AdminService.AddNewPlan(Model).subscribe((data:any)=>{
      console.log(data);
      Swal.fire(
        'Good job!',
        'Plan '+ data.planName +" Added Successfully",
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
}
