import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $ :any

@Component({
  selector: 'app-offer-versions',
  templateUrl: './offer-versions.component.html',
  styleUrls: ['./offer-versions.component.scss']
})
export class OfferVersionsComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[20,8,10,15,5];

  loading:boolean= false
  OfferVersions:any;
  versionPlans:any[]=[];
  versionGroup:any[]=[];
  versionDetailsLoading:boolean = false
  offerId:any
  
  constructor(private _SharedService:SharedService, private _PolicyService:PolicyService,private _ActivatedRoute:ActivatedRoute){
      this.offerId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }



    // Offer Versions
  getOfferVersions(){
    this.loading = true
    this._PolicyService.getOfferVersions(this.offerId).subscribe(data=>{
      console.log(data);
      
      this.loading = false
      this.OfferVersions = data;
      console.log(this.versionPlans);
    },error=>{
      this.loading = false;
    })
  }

  showplans(){
    $(".overlay").fadeIn(300)
    $(".delet").animate({right: '0px'});
  }
  closeshowplans(){
    $(".overlay").fadeOut(300)
    $(".delet").animate({right: '-30%'});
  }

// Show groups
  ShowGroup(){
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
  }
  closeShowGroup(){
    $(".overlayAddplan").fadeOut(300)
    $(".addnewplan").animate({right: '-30%'});
  }



  // Version Details
  getVersionDetails(VersionNo:any,type:any){
    console.log(type);
    if(type==1){
      $(".overlay").fadeIn(300)
      $(".delet").animate({right: '0px'});
    } else if(type==2){
      $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
    }
    this.versionDetailsLoading = true

    this._PolicyService.getVersionDetails(this.offerId,VersionNo).subscribe((data:any)=>{
      this.versionDetailsLoading = false
      // plans
      this.versionPlans = data.plans
      // Group
      this.versionGroup = data.customerGroups
      console.log(this.versionGroup);
    },error=>{
      this.versionDetailsLoading = false
      console.log(error);
      Swal.fire({
        icon: 'error',
        title:error.error,
      })
    })
  }




//Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getOfferVersions();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getOfferVersions();
  }

    // for DropDown icons
    isDropdownOpen = false;
    hoverRow: number | null = null;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  showDropdown() {
    this.isDropdownOpen = true;
  }
  
  hideDropdown() {
    this.isDropdownOpen = false;
  }
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);
    this.getOfferVersions();
  }

}
