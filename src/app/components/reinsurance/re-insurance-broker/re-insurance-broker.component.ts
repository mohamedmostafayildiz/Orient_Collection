import { AnimationDriver } from '@angular/animations/browser';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-re-insurance-broker',
  templateUrl: './re-insurance-broker.component.html',
  styleUrls: ['./re-insurance-broker.component.scss']
})
export class ReInsuranceBrokerComponent {
  AllContries:any;
  contryValue:any= '65';
  isClicked:boolean = false;
  AllAgencies:any[] =[
    {
        "agencyId": 1,
        "agencyName": "A.M. Best",
        "rates": [
            {
                "name": "A++ / A+",
            },
            {
                "name": "A / A-",
            },
            {
                "name": "B++ / B+",
            }
        ]
    },
    {
        "agencyId": 2,
        "agencyName": "Fitch",
        "rates": [
            {
                "name": "AAA",
            },
            {
                "name": "AA",
            },
            {
                "name": "A",
            },
            {
                "name": "BBB",
            }
        ]
    },
    {
        "agencyId": 3,
        "agencyName": "Moody's",
        "rates": [
            {
                "name": "Aaa",
            },
            {
                "name": "Aa",
            },
            {
                "name": "A",
            },
            {
                "name": "Baa",
            }
        ]
    },
    {
        "agencyId": 4,
        "agencyName": "S&P",
        "rates": [
            {
                "name": "AAA",
            },
            {
                "name": "AA",
            },
            {
                "name": "A",
            },
            {
                "name": "BBB",
            }
        ]
    }
]
  AllRates:any
  constructor(private _AdminService:AdminService,private _ReInsuranceService:ReInsuranceService,private _SharedService:SharedService){}
  Form:FormGroup = new FormGroup({
    'name':new FormControl('',[Validators.required]),
    'country':new FormControl(1,[Validators.required]),
    'notes':new FormControl(''),
    'lostedOrNotListed':new FormControl('',[Validators.required]),
    'authorityCode':new FormControl(''),
    'rateId':new FormControl(),
    'rateTypeId':new FormControl(),
    'ratingAgency':new FormControl('',[Validators.required]),
    'agencyRate':new FormControl('',[Validators.required])
  })
  // All Countries
  getCountries(){
    this._AdminService.getCountries().subscribe(data=>{
      this.AllContries =data;
    })
  }
  // Company Status
  getCompanyStatus(value:any){
    if(value ==true){
      $("#AuthCode").show(400)
      this.Form.get("authorityCode")?.setValidators([Validators.required]);
      this.Form.get("authorityCode")?.updateValueAndValidity();
    }else{
      $("#AuthCode").hide(400)
      this.Form.get("authorityCode")?.setValue('');
      this.Form.get("authorityCode")?.setValidators(null);
      this.Form.get("authorityCode")?.updateValueAndValidity();
    }
  }
  // Raiting Company
  getSelectedRatingAgency(){
    if(this.Form.get("ratingAgency")?.value=='Other'){
      this.Form.get("ratingAgency")?.setValue('')
      this.Form.get("agencyRate")?.setValue('')
      $("#agencyRate").hide(300);
      // $("#agencyName").hide(300);
      $("#OtherRating").show(300);
      $("#OtherRatingAgency").show(300);
    }else{
      this.Form.get("agencyRate")?.setValue('')
      $("#OtherRatingAgency").hide(300);
      $("#OtherRating").hide(300);
      $("#agencyRate").show(300);
      let Exist = this.AllAgencies.find(item=>item.agencyName == this.Form.get("ratingAgency")?.value);
      console.log(Exist);
      this.AllRates= Exist.rates;
    }
  }
  // Submit 
  SubmitReInCompany(){
    this.isClicked= true;
    let Model = Object.assign(this.Form.value,{brokerOrReInsurance:1});
    console.log(Model);
    this._ReInsuranceService.AddNewReInsuranceCompany(Model).subscribe(res=>{
      this.isClicked= false;
      console.log(res);
      this._SharedService.setAlertMessage('Company Broker Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Good job!','Company Broker Added Successfully','success');
      this.Form.reset();
    },error=>{
      console.log(error);
      this.isClicked= false;
      Swal.fire({icon: 'error',title: 'Oops...', text: error.error,});
    })
  }

  ngOnInit(){
    this.getCountries()
    localStorage.setItem("act_Nav",'Reinsurance Broker')
  }
}
