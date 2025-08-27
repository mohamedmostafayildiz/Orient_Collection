import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-early-and-collect',
  templateUrl: './early-and-collect.component.html',
  styleUrls: ['./early-and-collect.component.scss']
})
export class EarlyAndCollectComponent implements OnInit{

  brokerIdValue:any
  insuranceClassValue:any
  BusinessTypeValue:any ='0'
  InsuranceClasses:any
  BusinessTypes:any
  addEarlyErrrorMsg:any
  brokerCustomers:any
  arr:any[]=[]
  constructor(private _AdminService:AdminService, private _ToastrService:ToastrService){}

  Form:FormGroup = new FormGroup({
    'from':new FormControl(''),
    'to':new FormControl(''),
    'pre':new FormControl(''),
    'amount':new FormControl(''),
    'includeHolidays':new FormControl(false)
  })


  SubmitAddEarly(){
    let Model ={
      customerId:this.brokerIdValue,
      businessType:this.BusinessTypeValue,
      insuranceClass:this.insuranceClassValue,
      earlyCollectorData:this.arr
    }
    console.log(Model);
    this._AdminService.addEarlyCollect(Model).subscribe(data=>{
      Swal.fire(
        'Good job!',
        'Early & Collect Commission Added Successfully',
        'success'
      )
      this._ToastrService.success( "Early Collect Added Successfully","Well Done" )
      console.log(data);
    },error=>{
      console.log(error.error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
        
      })
      this.addEarlyErrrorMsg=error.error;
      this._ToastrService.error(this.addEarlyErrrorMsg , 'Error Occurred');
    })
    
  }
  getBrokerCustomer(){
    this._AdminService.getAllCustomers(3).subscribe((data:any)=>{
      this.brokerCustomers =data;
      console.log(this.brokerCustomers);
    })
  }
      //get Insurance Types
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe(data=>{
      this.InsuranceClasses=data;
    })
  }
      //get Business Types
  getBusinessTypes(){
    this._AdminService.getBusinessTypes().subscribe(data=>{
      this.BusinessTypes=data;
    })
  }
   // Add And view Item From Lose Participation List
   view(){
    let Model={
      from:this.Form.get('from')!.value,
      to:this.Form.get('to')!.value,
      pre:this.Form.get('pre')!.value,
      amount:this.Form.get('amount')!.value,
      includeHolidays:this.Form.get('includeHolidays')!.value,
    }
    this.arr.push(Model);
    this.Form.get('from')!.setValue('')
    this.Form.get('to')!.setValue('')
    this.Form.get('pre')!.setValue('')
    this.Form.get('amount')!.setValue('')
    this.Form.get('includeHolidays')!.setValue(false)
    console.log(this.arr);
  }
   //Remove item From Loss Participations List
   remove(index:number){
    this.arr.splice(index, 1)
  }
  ngOnInit(): void {
    this.getInsuraneClass();
    this.getBusinessTypes()
    this.getBrokerCustomer()
  }
}
