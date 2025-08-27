import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppendixService } from 'src/app/services/appendix.service';
import { PolicyService } from 'src/app/services/policy.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';

declare var $:any

@Component({
  selector: 'app-cancel-update',
  templateUrl: './cancel-update.component.html',
  styleUrls: ['./cancel-update.component.scss']
})
export class CancelUpdateComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  CashedInputs:any
  PolicyId:any
  EndorsmentId:any
  PoicyGroup:any
  loading:boolean = false
  isClickedPostReinsutance:boolean = false
  netPremVAl:any
  ModelArr:any[]=[]
  isClicked:boolean = false
  term:any
  PolicyCaluculations:any
  constructor(private _PolicyService:PolicyService,private _AppendixService:AppendixService,
    private _ActivatedRoute:ActivatedRoute, private _Router:Router,private _ReInsuranceService:ReInsuranceService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    // this.EndorsmentId = this._ActivatedRoute.snapshot.paramMap.get('id2')
  }
  CancelingEndorsmentForm:FormGroup = new FormGroup({
    stamp:new FormControl('',[Validators.required]),
    supervision:new FormControl('',[Validators.required]),
    policyHolders:new FormControl('',[Validators.required]),
    imprintStamp:new FormControl('',[Validators.required]),
    issueFees:new FormControl('',[Validators.required]),
    grossPremium:new FormControl('',[Validators.required]),
    policyRevision:new FormControl('',[Validators.required]),
    taxes:new FormControl('',[Validators.required]),
    totalSumInsured:new FormControl('',[Validators.required]),
    tpaFeesPCT:new FormControl('',[Validators.required]),
    brokeragePCT:new FormControl('',[Validators.required]),
  })
        // get Policy Details By Id
  // getEndorsementById(){
  //   this.isClicked=true;
  //   this._AppendixService.getEndorsementById(this.EndorsmentId).subscribe((data:any)=>{
  //     this.isClicked=false;
  //     console.log(data);
  //     this.PoicyGroup = data.group
  //     this.PolicyCaluculations = data
  //     this.setFormValues()
  //   },error=>{
  //     console.log(error);
  //     this.isClicked=false;
  //   })  
  // }

            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    // this.getEndorsementById();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    // this.getEndorsementById();
  }




  UpdateEndorsement(){
    this.isClicked = true;
  let Model = Object.assign(this.CancelingEndorsmentForm.value,
    {
      code:this.PolicyCaluculations.code,
      jsonCode:this.PolicyCaluculations.jsonCode,
      endorsementType:this.PolicyCaluculations.endorsementType,
      policyId:Number(this.PolicyId),
      insuredName:this.PolicyCaluculations.insuredName,
      brokerId:this.PolicyCaluculations.brokerId,
      endorsementDate:this.PolicyCaluculations.endorsementDate,
      netPremium:this.PolicyCaluculations.netPremium,
      // stamp:this.PolicyCaluculations.stamp,
      // policyHolders:this.PolicyCaluculations.policyHolders,
      // policyRevision:this.PolicyCaluculations.policyRevision,
      // supervision:this.PolicyCaluculations.supervision,
      // imprintStamp:this.PolicyCaluculations.imprintStamp,
      // issueFees:this.PolicyCaluculations.issueFees,
      // grossPremium:this.PolicyCaluculations.grossPremium,
      // totalSumInsured:this.PolicyCaluculations.totalSumInsured,
      tpaFees:this.PolicyCaluculations.tpaFees,
      brokerage:this.PolicyCaluculations.brokerage,
      tpaFeesPCT:this.PolicyCaluculations.tpaFeesPCT,
      brokeragePCT:this.PolicyCaluculations.brokeragePCT,
      taxes:this.PolicyCaluculations.taxes,
      
      removedGroupsId:this.PolicyCaluculations.removedGroupsId,
      updatePolicyDto:this.PolicyCaluculations.updatePolicyDto,
      endorsementGroups:this.CashedInputs.file==undefined?null:this.CashedInputs.file,
    })
  console.log(Model);
    this._AppendixService.UpdateEndorsement(Model).subscribe(async (data:any)=>{
      console.log(data);
      
      $("#ActivateEndorsment").hide(300)
      await this.getPolicyDetails()
      $("#PostReinsurance").show(300)
      $("#NewEndorsment").show(300)
      this.isClicked = false;
      console.log(data);
      // this.PolicyCaluculations =data
      this.EndorsmentId = data.id
    },error=>{
      console.log(error);
      this.isClicked = false;
      Swal.fire({icon: "error",title: "Oops...",text: error.error,});
    })
    // this.setFormValues()
}
  setFormValues(){
    this.CancelingEndorsmentForm.patchValue({
      stamp:this.PolicyCaluculations?.stamp,
      supervision:this.PolicyCaluculations?.supervision,
      policyHolders:this.PolicyCaluculations?.policyHolders,
      imprintStamp:this.PolicyCaluculations?.imprintStamp,
      issueFees:this.PolicyCaluculations?.issueFees,
      grossPremium:this.PolicyCaluculations?.grossPremium,
      policyRevision:this.PolicyCaluculations?.policyRevision,
      totalSumInsured:this.PolicyCaluculations?.totalSumInsured
    })
  }
  // ActivateEndorsement(){
  //   this._AppendixService.SaveEndorsement(Number(this.EndorsmentId)).subscribe(res=>{
  //     console.log(res);
  //     // this.getEndorsementById()
  //   })
  // }
  updateGrossPriVal(){
    this.CancelingEndorsmentForm.get('grossPremium')?.setValue(
      this.CancelingEndorsmentForm.get('stamp')?.value+
      this.CancelingEndorsmentForm.get('issueFees')?.value+
      this.CancelingEndorsmentForm.get('imprintStamp')?.value+
      this.CancelingEndorsmentForm.get('policyRevision')?.value+
      this.CancelingEndorsmentForm.get('policyHolders')?.value+
      this.CancelingEndorsmentForm.get('supervision')?.value+Number(this.PolicyCaluculations?.netPremium)
    )
  }
  PolicyData:any
  // Policy Details
  getPolicyDetails(){
    this.loading = true
    this._PolicyService.getThePolicyById(this.PolicyId).subscribe((data:any)=>{
      this.loading = false
      this.PolicyData =data
      console.log(data);
    },error=>{
      this.loading = false;
      // console.log(error);
    })
  }
  // post To Reinsurance
  postToReinsurance(){
    this.isClickedPostReinsutance= true;
    let Model = {endoresmentId:this.EndorsmentId}
    this._ReInsuranceService.PolicyReInsurance(Model).subscribe(res=>{
      this.getPolicyDetails()
      $("#PostReinsurance").hide(300)
      this.isClickedPostReinsutance= false;
      console.log(res);
      Swal.fire('Endoresment Posted To Reinsurance Successfully','','success')
    },error=>{
      console.log(error);
      this.isClickedPostReinsutance= false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
    })
  }
  ngOnInit(){
    // this.getEndorsementById()
    this.getPolicyDetails()
    const myArray = this._ActivatedRoute.snapshot.queryParamMap.get('myArray');
    if (myArray === null) {
      this.CashedInputs = new Array<string>();
    } else {
      this.CashedInputs = JSON.parse(myArray);
      console.log(this.CashedInputs);
      this.PolicyCaluculations = this.CashedInputs.data
      this.setFormValues()
    }
  }
}