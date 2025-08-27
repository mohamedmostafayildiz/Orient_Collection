import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
declare var $:any;
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-basic-comision',
  templateUrl: './basic-comision.component.html',
  styleUrls: ['./basic-comision.component.scss']
})
export class BasicComisionComponent implements OnInit{
  
  BusinessTypeValue:any ='0'
  insuranceClassValue:any;
  commissionTypeValue:any;
  paymentWayValue:any='0'
  BusinessTypes:any
  InsuranceClasses:any
  CommisionTypes:any;
  paymentWays:any
  pctCommission:any;
  addCommissionErrorMsg:any;
  pct:any=''
  amount:any=''
  brokerIdValue:any
  CustomerId:any
  validCommistionSelects:boolean=false;
  brokerCustomers:any;
  loading:boolean = false;

  constructor(private _SharedService:SharedService, private _ActivatedRoute:ActivatedRoute ,private _AdminService:AdminService, private _ToastrService:ToastrService){}

  comisionForm = new FormGroup({
    'per':new FormControl(''),
  })
  check1(e:any){
    this.pct=e.target.value;
  }
  check2(e:any){
    this.amount=e.target.value
  }
          // Commistion selects Form Validations
  CommissionSelectValidation(){
    if(this.insuranceClassValue!=null && this.commissionTypeValue!=null){
      this.validCommistionSelects=true;
    }
  }

  getBrokerCustomer(){
    this._AdminService.getAllCustomers(3).subscribe((data:any)=>{
      this.brokerCustomers =data;
      console.log(this.brokerCustomers);
    })
  }
  getCommissionTypeValue(e:any){
    console.log(e.value);
    if(e.value==1){
      $("#wayOfPayment").hide(300)
      this.paymentWayValue= '1'
    }else if(e.value=2){
      $("#wayOfPayment").show(300)
    }
  }
  submitCommissionToCustomerForm(){
    this.loading = true;
    let Model =Object.assign(
      {pct:Number(this.pct/100)},
      {amount:Number(this.amount)},
      {businessType:this.BusinessTypeValue},
      {insuranceClass:this.insuranceClassValue},
      {commissionType:this.commissionTypeValue},
      {paymentWay:this.paymentWayValue},
      {customerId:this.brokerIdValue}
      )
      console.log(Model);
      
    this._AdminService.addCommissionToCustomer(Model).subscribe(data=>{
      this.loading = false;
      console.log(data);
      this._SharedService.setAlertMessage('Commission Added Successfully !');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      
      document.getElementById("close")?.click()
      // Swal.fire(
      //   'Good job!',
      //   'Commission Added Successfully',
      //   'success'
      // )
      // this._ToastrService.success("Commission Added Successfully","Well Done" )
    },error=>{
      this.loading = false;
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
        
      })
      console.log(error);
      this.addCommissionErrorMsg=error.error;
      this._ToastrService.error(this.addCommissionErrorMsg , 'Error Occurred');
    })
    
  }

      //get Business Types
      getBusinessTypes(){
        this._AdminService.getBusinessTypes().subscribe(data=>{
          this.BusinessTypes=data;
        })
      }
        //get Insurance Types
      getInsuraneClass(){
        this._AdminService.getInsuraneClass().subscribe(data=>{
          this.InsuranceClasses=data;
        })
      }
        //get Commission Types
      getCommissionTypes(){
        this._AdminService.getCommissionTypes().subscribe(data=>{
          this.CommisionTypes=data;
        })
      }
        //getPayment Ways
        getPaymentWays(){
        this._AdminService.getPaymentWays().subscribe(data=>{
          this.paymentWays=data;
          console.log(data);   
        })
      }
    
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);

    this.getBusinessTypes();
    this.getInsuraneClass();
    this.getCommissionTypes();
    this.getPaymentWays();
    this.getBrokerCustomer()
  }
}
