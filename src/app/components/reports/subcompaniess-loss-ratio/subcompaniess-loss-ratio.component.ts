import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any
import { DatePipe } from '@angular/common';
import { ClaimsService } from 'src/app/services/claims.service';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-subcompaniess-loss-ratio',
  templateUrl: './subcompaniess-loss-ratio.component.html',
  styleUrls: ['./subcompaniess-loss-ratio.component.scss'],
  providers : [DatePipe]
})
export class SubcompaniessLossRatioComponent implements OnInit {
  AllPolices:any[]=[]
  subCompanyArr:any[]=[]
  isClicked:boolean = false
  constructor(private _SharedService:SharedService,private _ClaimsService:ClaimsService, private _DatePipe:DatePipe,private _PolicyService:PolicyService,private _ToastrService:ToastrService,){
    
  }
  insuredObject:any
  SearchForm:FormGroup = new FormGroup({
    'PolicyCode':new FormControl('',[Validators.required]),
    'InsuredId':new FormControl({ value: '', disabled: true },[Validators.required]),
    // 'subCompanyData':new FormControl('',[Validators.required])
  })
  SupcompanyData:FormGroup = new FormGroup({
    'subCompanyId':new FormControl('',[Validators.required]),
    'outStanding':new FormControl('',[Validators.required]),
    'ibnr':new FormControl('',[Validators.required])
  })
  GetAllPolicies(){
    this._PolicyService.getAllPolices().subscribe((data:any)=>{
      console.log(data);
      this.AllPolices = data
    },error=>{
      console.log(error);
    })
  }
  onPolicyCodeChange(e:any){
    console.log(e);
    const Code = e
    this.insuredObject=this.AllPolices.find(item=>item.policyCode==Code)
    console.log(this.insuredObject);
    if (this.insuredObject) {
      this.SearchForm.get('InsuredId')?.setValue(this.insuredObject.insuredId);
      this.SearchForm.get('InsuredId')?.enable();
    } else {
      // If no valid policy, reset and disable the InsuredId field
      this.SearchForm.get('InsuredId')?.reset();
      this.SearchForm.get('InsuredId')?.disable();
    }
    $('#supCompany').show(500)
  }

  Add(){
    // let Model = Object.assign(this.SupcompanyData.value,{subCompanyId:this.insuredObject.insuredId})
    // console.log(Model);
    let Object = this.subCompanyArr.find(item=>item.subCompanyId==this.SupcompanyData.get('subCompanyId')?.value)
    if(Object==undefined){
      this.subCompanyArr.push(this.SupcompanyData.value)
      console.log(this.subCompanyArr);
      this.SupcompanyData.reset()
    }
    else{
      this._ToastrService.show('The supcompany Already Exist')

    }
   
    
  }
  remove(index:number){
    this.subCompanyArr.splice(index, 1)
  }
  
  
  FileName:any
  // Search(){
  //   this.isClicked = true;
  //   let Model ={
  //     policyCode:this.SearchForm.get('PolicyCode')?.value,
  //     insuredId:this.SearchForm.get('InsuredId')?.value,
  //     subdompanydata: JSON.stringify(this.subCompanyArr)
  //   }
  //   console.log(Model);
  //   this._ClaimsService.SubCompaniesLossRatioReport(Model).subscribe(res=>{
  //     this.isClicked = false;
  //     console.log(res);
  //       let blob:Blob = res.body as Blob
  //       this.FileName= 'SubCompaniesLossRatioReport.xlsx'
  //       let a= document.createElement('a');
  //       a.download=this.FileName;
  //       a.href=window.URL.createObjectURL(blob);
  //       a.click();
  //       Swal.fire({title:'File downloaded Successfully',timer:3000, timerProgressBar: true})
  //   },async error=>{
  //     this.isClicked = false;
  //     const message = await error.error.text()
  //     Swal.fire({icon: 'error',title: 'Oops...',text: message});
  //   }) 
  // }
  Search1(){
    let Model={
      policyCode:this.SearchForm.get('PolicyCode')?.value,
      insuredId:this.SearchForm.get('InsuredId')?.value,
      subCompanyData: this.subCompanyArr
    }
    console.log(Model);
    
    this._ClaimsService.SubCompaniesLossRatioReportPut(Model).subscribe((res:any)=>{
      // console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= 'SubCompaniesLossRatio.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();
      this._SharedService.setAlertMessage(`${this.FileName} downloaded successfully`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire({title:'File downloaded Successfully',timer:3000, timerProgressBar: true})
    }
    ,async error=>{
      this.isClicked = false;
      const message = await error.error.text()
      // console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: message});
    }
  )
  }
  ResetForm(){
    this.SearchForm.reset()
  }
  ngOnInit(): void {
    // this.GetAllPolicies()
    this.getPolicesWithSupCompanyId()
    // this.SearchForm.get('PolicyCode')?.valueChanges.subscribe((selectedPolicyCode: any) => {
    //   const selectedPolicy = this.AllPolices.find(policy => policy.policyCode === selectedPolicyCode);
    //   if (selectedPolicy) {
    //     this.SearchForm.get('InsuredId')?.setValue(selectedPolicy.insuredId);
    //     this.SearchForm.get('InsuredId')?.enable();
    //   } else {
    //     this.SearchForm.get('InsuredId')?.reset();
    //     this.SearchForm.get('InsuredId')?.disable();
    //   }
    // })
  }
  getPolicesWithSupCompanyId(){
    this._ClaimsService.getPolicesWithSupCompanyId().subscribe((data:any)=>{
      console.log(data);
      this.AllPolices = data
    },error=>{
      console.log(error);
    })
  }

}
