import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-activate-policy',
  templateUrl: './groupNetPrem.component.html',
  styleUrls: ['./groupNetPrem.component.scss']
})
export class ActivatePolicyComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  SpareArr:any[]=[]
  Over65Percentage:number =10;
  PolicyId:any
  PoicyGroup:any[]=[]
  loading:boolean = false
  netPremVAl:any
  ModelArr:any[]=[]
  isClicked:boolean = false
  term:any
  PolicyDetails:any
  SelectAll:any
  netPremiumForm:FormGroup = new FormGroup({
    'netPremium':new FormControl('')
  })
  constructor(private _SharedService:SharedService, private _PolicyService:PolicyService,private _ActivatedRoute:ActivatedRoute, private _Router:Router){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }

        // get Policy Details By Id
  getThePolicyById(){
    this.loading=true;
    this._PolicyService.getThePolicyById(this.PolicyId).subscribe(async (data:any)=>{
      
      this.loading=false;
      this.PolicyDetails = data
      console.log(data);
      
      this.PoicyGroup = await data.group  
      for(let i =0;i<this.PoicyGroup.length;i++){
        this.SpareArr.push({netPr:this.PoicyGroup[i].netPremium})
        this.valuess[i]=this.PoicyGroup[i].netPremium
      }
    },error=>{
      console.log(error);
      this.loading=false;
    })
  }

  // Final Body
  // getNetPremium(target:any,id:any){
  //   var exist = this.ModelArr.find(item=>item.customerId==id);

  //   if(exist == undefined){
  //     let Model = {
  //       'customerId':id,
  //       'netPremium':Number(target.value)
  //     }
  //     this.ModelArr.push(Model)
  //     // console.log(this.ModelArr);
  //   }else{
  //     var index = this.ModelArr.indexOf(exist)
  //     this.ModelArr.splice(index,1)
  //     // let Model = {
  //     //   'customerId':id,
  //     //   'netPremium':Number(target.value)
  //     // }
  //     // this.ModelArr.push(Model)
  //     // console.log(this.ModelArr);
  //   }
    
  // }

  UpdatePolicyGroupPremium(){
    this.isClicked= true
    for(let i=0;i<this.valuess.length;i++){
      this.ModelArr.push({
        'customerId':this.PoicyGroup[i].id,
        'netPremium':this.valuess[i]
      })
    }
    console.log(this.ModelArr);
    this._PolicyService.UpdatePolicyGroupPremium(Number(this.PolicyId), this.ModelArr).subscribe(res=>{
      // Swal.fire('Group Details Edited Successfully','','success')
      Swal.fire({
        icon: 'success',
        title: 'Group Details Edited Successfully',
        showConfirmButton: false,
        timer: 1500
      })
      this._Router.navigate(['/PolicyCalculations/'+this.PolicyId])
      this.isClicked= false
      console.log(res);
      this.ModelArr = []
    },error=>{
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.isClicked= false
      this.ModelArr = []
    })
  }
  // ///////////////////   Over 65    ////////////////////
  values:any[]=[];
  valuess:any[]=[];
  async selectAllOver(value:any){
    for(let i=0;i<this.PoicyGroup.length;i++){
      
      if(this.PoicyGroup[i].age>=65){
        if(value ==true){
          this.values[i]=true
          this.valuess[i]= this.PoicyGroup[i].netPremium*(1 + this.Over65Percentage/100)
        }else{
          this.values[i]=false
          this.valuess[i] = this.SpareArr[i].netPr
          
        }
        
      }
    }
  }
  // FinalModel(){
  //   // console.log(this.PoicyGroup);

  //   for(let i=0;i<this.valuess.length;i++){
  //     this.ModelArr.push({
  //       'customerId':this.PoicyGroup[i].id,
  //       'netPremium':this.valuess[i]
  //     })
  //   }
  //   this._PolicyService.UpdatePolicyGroupPremium(Number(this.PolicyId), this.ModelArr).subscribe(res=>{
  //     // Swal.fire('Group Details Edited Successfully','','success')
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Group Details Edited Successfully',
  //       showConfirmButton: false,
  //       timer: 1500
  //     })
  //     this._Router.navigate(['/PolicyCalculations/'+this.PolicyId])
  //     this.isClicked= false
  //     console.log(res);
  //     this.ModelArr = []
  //   },error=>{
  //     Swal.fire({icon: 'error',title:error.error,text:''})
  //     this.isClicked= false
  //     this.ModelArr = []
  //   })
  //   console.log(this.ModelArr);
  //   this.ModelArr = []
  // }
  getOver65(e:any, id:any,Premium:any, index:any){
    var exist = this.ModelArr.find(item=>item.customerId==id);
    console.log(exist);
    Premium as HTMLInputElement
    if(e == true){
      Premium.value = this.PoicyGroup[index].netPremium*(1 + this.Over65Percentage/100)
      this.valuess[index] =Number(Premium.value)
      Premium.disabled = true
      
    }else if(e == false){
      Premium.value = this.PoicyGroup[index].netPremium
      this.valuess[index] =Number(Premium.value)
      Premium.disabled = false
    }
    
  }
  CheckOverAge(){
    for(let i=0;i<this.PoicyGroup.length;i++){
      
      if(this.PoicyGroup[i].age>=65){
       
          // this.values[i]=true
          // this.valuess[i]= this.PoicyGroup[i].netPremium*this.Over65Percentage
       
          this.values[i]=false
          this.valuess[i] = this.SpareArr[i].netPr;
          this.SelectAll = false;
      
        
      }
    }
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getThePolicyById();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getThePolicyById();
  }
  
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);

    this.getThePolicyById()
  }
}
