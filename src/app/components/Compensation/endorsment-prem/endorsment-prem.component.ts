import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppendixService } from 'src/app/services/appendix.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-endorsment-prem',
  templateUrl: './endorsment-prem.component.html',
  styleUrls: ['./endorsment-prem.component.scss']
})
export class EndorsmentPremComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  GroupNatPrem:any[]=[]
  PolicyId:any
  EndorsmentId:any
  PoicyGroup:any
  loading:boolean = false
  netPremVAl:any
  ModelArr:any[]=[]
  isClicked:boolean = false
  term:any
  EndorDate:any
  EndorType:any
  CashedInputs:any[]=[]
  netPremiumForm:FormGroup = new FormGroup({
    'netPremium':new FormControl('')
  })
  constructor(private _PolicyService:PolicyService,private _AppendixService:AppendixService,private _ActivatedRoute:ActivatedRoute, private _Router:Router){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.EndorDate = this._ActivatedRoute.snapshot.paramMap.get('date')
    this.EndorType = this._ActivatedRoute.snapshot.paramMap.get('type')
  }

        // get Policy Details By Id
  // getThePolicyById(){
  //   this.loading=true;
  //   this._AppendixService.GetGroupOfEndorsement(this.EndorsmentId).subscribe((data:any)=>{
  //     this.loading=false;
  //     // console.log(data);
  //     this.PoicyGroup = data.policyCustomerGroup
  //   },error=>{
  //     console.log(error);
  //     this.loading=false;
  //   })
  // }

  // Final Body
  // getNetPremium(target:any,id:any){
  //   var exist = this.ModelArr.find(item=>item.customerId==id);

  //   if(exist == undefined){
  //     let Model = {
  //       'customerId':id,
  //       'netPremium':Number(target.value)
  //     }
  //     this.ModelArr.push(Model)
  //     console.log(this.ModelArr);
  //   }else{
  //     var index = this.ModelArr.indexOf(exist)
  //     this.ModelArr.splice(index,1)
  //     let Model = {
  //       'customerId':id,
  //       'netPremium':Number(target.value)
  //     }
  //     this.ModelArr.push(Model)
  //     console.log(this.ModelArr);
  //   }
    
  // }
  // EndorGroups:any[]=[]
  UpdatePolicyGroupPremium(){
    this.isClicked= true
    
    for(let i= 0;i<this.CashedInputs.length;i++){
    
      // Object.assign(this.CashedInputs[i],{netPremium:this.GroupNatPrem[i]})
      this.CashedInputs[i].netPremium = this.GroupNatPrem[i];
      // this.CashedInputs[i].removeId = null
      // this.CashedInputs[i].hasClaim = null
    }
    let Model ={
      'endorsementGroups':this.CashedInputs,
      'policyId':this.PolicyId,
      'type':this.EndorType,
      'endorsementDate':this.EndorDate,
      'policySource':null,
      'brokerId':null,
      'insuredName':null

    }
    console.log(Model);
    
    this._PolicyService.UpdatePolicyGroupPremiumEndor(Model).subscribe(res=>{
      Swal.fire({
        icon: 'success',
        title: 'Group Details Edited Successfully',
        showConfirmButton: false,
        // timer: 1500
      })
      console.log(res);
      const queryParams: any = {};
      const navigationExtras: NavigationExtras = {queryParams};
      queryParams.myArray =JSON.stringify(Object.assign({data:res,file:this.CashedInputs}));
      this._Router.navigate(['/CancleUpdate',this.PolicyId,this.EndorDate,this.EndorType],navigationExtras)

      this.isClicked= false
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.isClicked= false
    })
 
}
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    // this.getThePolicyById();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    // this.getThePolicyById();
  }



  
  ngOnInit(): void {
    // this.getThePolicyById()
    const myArray = this._ActivatedRoute.snapshot.queryParamMap.get('myArray');
    if (myArray === null) {
      this.CashedInputs = new Array<string>();
    } else {
      this.CashedInputs = JSON.parse(myArray);
      console.log(this.CashedInputs);
      this.PoicyGroup = this.CashedInputs
      for(let i= 0;i<this.CashedInputs.length;i++){
        this.GroupNatPrem[i] = this.CashedInputs[i].netPremium
      }
    }
  }
}