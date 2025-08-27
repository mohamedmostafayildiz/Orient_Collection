import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faL } from '@fortawesome/free-solid-svg-icons';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-policy-calculations',
  templateUrl: './policy-calculations.component.html',
  styleUrls: ['./policy-calculations.component.scss']
})
export class PolicyCalculationsComponent {
  PolicyId:any;
  PolicyCaluculations:any;
  TaxValue:any;
  PolicyDetails:any
  loading:boolean = false;
  isClicked:boolean = false;
  isClickedPostReinsutance:boolean = false;
  policyCode:any;
  PolicyGroupDetails:any
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)
  constructor(private _SharedService:SharedService, private _PolicyService:PolicyService,private _ActivatedRoute:ActivatedRoute
    , private _Router:Router
    , public _ReportsService:ReportsService,
      private _ReInsuranceService:ReInsuranceService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }
  Form:FormGroup = new FormGroup({
    'bySubGroup':new FormControl('',[Validators.required]),
  })
  hasSubCom:any
  getPolicyCalculations(){
    this.loading= true;
    this._PolicyService.getPolicyCalculationns(this.PolicyId).subscribe((data:any)=>{
      this.policyCode= data.code
      this.loading= false;
      this.PolicyCaluculations = data;
      this.hasSubCom= data.hadSubCompanies
      this.TaxValue = this.PolicyCaluculations.taxes*100
      console.log(this.PolicyCaluculations);
    },error=>{
      this.loading= true;
    })
  }
  reCalculate(){
    console.log(this.TaxValue);
    this._PolicyService.getPolicyCalculationnsWithFees(this.PolicyId, this.TaxValue/100).subscribe(data=>{
      this.PolicyCaluculations = data;
      console.log(this.PolicyCaluculations);
    })
  }
  ActivatePolicy(){
    this.isClicked = true
    this._PolicyService.SubmitPolicy(this.PolicyId).subscribe(res=>{
      this.isClicked = false
      this.getPolicyCalculations()
      this.getPolicyDetails()
      this._SharedService.setAlertMessage('Policy Activated Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Policy Activated Successfully','','success')
      console.log(res);
    },error=>{
      this.isClicked = false
      // Swal.fire({icon: 'error',title:error.error,text:'',timer: 1500})
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      console.log(error);
    })
  }
  isJournalclick:boolean = false;
  AddJournalEntry(){
    this.isJournalclick = true;
    this._PolicyService.AddPolicyEntries(this.PolicyId,this.Form.get('bySubGroup')?.value==true?true:false).subscribe(res=>{
      this.isJournalclick = false;
      console.log(res);
      this._SharedService.setAlertMessage('Added to Journal Entry Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Added to Journal Entry Successfully','','success')
      this.getPolicyCalculations()
      this.getPolicyDetails()

    },error=>{
      // Swal.fire({icon: 'error',title:error.error,text:'',timer: 1500})
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
      this.isJournalclick = false;
    })
  }

  FileName:any
  // get Installment Calculation Report
  getInstallmentCalculation(){
    this._ReportsService.getInstallmentCalculationReport(this.policyCode).subscribe((res:any)=>{
      let blob:Blob = res.body as Blob;
      this.FileName= 'Installment Calculation.xlsx';
      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
    })
  }
  // get List Of Names Report
  getListOfNamesReport(){
    this._ReportsService.getListOfNamesReport(this.policyCode).subscribe((res:any)=>{
      let blob:Blob = res.body as Blob;
      this.FileName= 'List Of Names.xlsx';
      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
    })
    // this._Router.navigate(['/ModelPolicy'],{queryParams:{
    //   code:this.policyCode
    // }})
  }
  // get List Of Names Report
  getPolicyScheduling(){
    this._ReportsService.getPolicyScheduling(this.policyCode).subscribe((res:any)=>{
      let blob:Blob = res.body as Blob;
      this.FileName= 'policy Scheduling.xlsx';
      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
    })

  }
  // get Reports
  getPolicyReports(){
    this.getListOfNamesReport()
    this.getInstallmentCalculation();
    this.getPolicyScheduling();
  }
  // Policy Details
  getPolicyDetails(){
    this.loading = true
    this._PolicyService.getThePolicyById(this.PolicyId).subscribe((data:any)=>{
      this.loading = false
      this.PolicyGroupDetails =data.group
      this.PolicyDetails =data

      console.log(data);
    },error=>{
      this.loading = false;
      // console.log(error);
    })
  }
  // post To Reinsurance
  postToReinsurance(){
    this.isClickedPostReinsutance= true;
    $('#HiddenReinsurance').hide(500)
    let Model = {policyId:this.PolicyId}
    this._ReInsuranceService.PolicyReInsurance(Model).subscribe(res=>{
      this.getPolicyCalculations()
      this.getPolicyDetails()
      this.isClickedPostReinsutance= false;
      console.log(res);
    this._SharedService.setAlertMessage('Posted To Reinsurance Successfully');
    window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Posted To Reinsurance Successfully','','success')
    },error=>{
      console.log(error);
      this.isClickedPostReinsutance= false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
    })
  }
  ngOnInit(){    
    this._SharedService.changeData(true,'','',false,false);

    this.getPolicyCalculations()
    this.getPolicyDetails()
  }

  AddNewAccType(){
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
  }
  closeNewAccType(){
    $(".overlayAddplan").fadeOut(300)
    $(".addnewplan").animate({right: '-30%'});
  }
}
