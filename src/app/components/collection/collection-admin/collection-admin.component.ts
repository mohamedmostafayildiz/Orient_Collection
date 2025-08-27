import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-collection-admin',
  templateUrl: './collection-admin.component.html',
  styleUrls: ['./collection-admin.component.scss']
})
export class CollectionAdminComponent implements OnInit{
  isClicked:boolean= false
  isClicked2:boolean= false
  loading:boolean= false
  brokerCustomers:any
  BrokerIdVal:any =''
  TotalMony:number = 0
  AllPortfolio:any
  PortflioCollections:any
 
  constructor(private _ToastrService:ToastrService, private _Router:Router,private _SharedService:SharedService
    , private _AdminService:AdminService, private _CollectionService:CollectionService){}


  SearchForm:FormGroup = new FormGroup({
    'code':new FormControl(''),
    'Insured':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl(''),
    'Decision':new FormControl('pending'),
  })

  selectedFile:any = ''
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  ArrTest:any[]=[];
  getApproveDecision(id:any,target:any){

    let Exist= this.ArrTest.find(item=>item.id ==id)
    
    if(Exist==undefined){
      if(target.value==''){
      }else{
        let Model= {
          id:id,
          isApproved :JSON.parse(target.value)
        }
        this.ArrTest.push(Model)
      }
    }else{
      if(target.value==''){
        let Index = this.ArrTest.indexOf(Exist)
        this.ArrTest.splice(Index,1)
      }else{
        let Model= {
          id:id,
          isApproved :JSON.parse(target.value)
        }
        let Index = this.ArrTest.indexOf(Exist)
        this.ArrTest.splice(Index,1)
        this.ArrTest.push(Model)
      }
    }
    console.log(this.ArrTest);
    if(target.value == 'true'){
      target.style.backgroundColor = '#E2F2E9';
    }else if(target.value == 'false'){
      target.style.backgroundColor = '#FBECEC';
    }else{
      target.style.backgroundColor = '#FFF';
    }
    if(this.ArrTest.length==0){
      $('#Save').hide(300)
    }else{
      $('#Save').show(300)
    }
  }

    ////////////////////=> Search <=//////////////////
    // {BrokerId:this.BrokerIdVal}
Search(){
  this.loading = true;
    console.log(this.SearchForm.value);
    let Model =Object.assign(this.SearchForm.value,{BrokerId:this.BrokerIdVal})
    this._CollectionService.GetAllPortfolio(Model).subscribe(data=>{
      console.log(data);
      
      this.loading = false;
      this.AllPortfolio = data;
    },error=>{
      console.log(error);
      this.loading = false;
    })
}
// GetAllPortfolio(){
//   this.loading = true;
//   this._CollectionService.GetAllPortfolio(0).subscribe(data=>{
//     this.loading = false;
//     this.AllPortfolio= data;
//     // console.log(data);
    
//   },error=>{
//     this.loading = false;
//     console.log(error);
    
//   })
// }
  ///////////////////  Sumbit Portfolios //////////////
SumbitPortfolios(){
  this.isClicked2 = true
  console.log(this.ArrTest);
  this._CollectionService.SumbitPortfolios(this.ArrTest).subscribe(res=>{
    this.isClicked2 = false
    console.log(res);
    this.Search();
    // Swal.fire('Good job!','Portfolio/Portfolios Submitted Successfully','success');
    this._SharedService.setAlertMessage('Portfolio/Portfolios Submitted Successfully');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.ArrTest = [];
  },error=>{
    this.isClicked2 = false
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
  
}
getPortflioCollections(collections:any){
  this.PortflioCollections = collections
  console.log(this.PortflioCollections);
  $(".overlayPortflioCollections").fadeIn(300)
  $(".closePortflioCollections").animate({right: '0px'});
}
closePortflioCollections(){
  $(".overlayPortflioCollections").fadeOut(300)
  $(".closePortflioCollections").animate({right: '-30%'});
}
//get Broker Customers
getBrokerCustomers(){
  this._AdminService.getAllBrokers().subscribe(data=>{
    console.log(data);
    
    this.brokerCustomers= data;
  })
}
  ngOnInit() {
    this._SharedService.changeData(false,'','',true,false);
    this._SharedService.currentMessage.subscribe(message => {
        if(message){
          $("#filters").show(300)
        }else{
          $("#filters").hide(300)
        }
      });
    this.getBrokerCustomers()
    this.Search()
  }
}
