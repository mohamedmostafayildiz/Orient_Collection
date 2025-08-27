import { Component } from '@angular/core';
import { ClaimsService } from 'src/app/services/claims.service';
import { CollectionService } from 'src/app/services/collection.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any
@Component({
  selector: 'app-all-claims',
  templateUrl: './all-claims.component.html',
  styleUrls: ['./all-claims.component.scss']
})
export class AllClaimsComponent {

  page:number=1;
  count:number=0;
  tableSize:number=10;
  tableSizes=[5,10,15,20];
  AllData:any;
  AllBrokerageCollections:any;
  loading:boolean= false
  fileData:any
  constructor(private _SharedService:SharedService,private _CollectionService:CollectionService, private _ClaimsService:ClaimsService){}
  GetAllClaims(){
    this.loading = true
    this._ClaimsService.GetAllClaims().subscribe(data=>{
      this.loading = false;
      this.AllData = data;
      console.log(data);
    },error=>{
      this.loading = false;
      console.log(error);
    })
  }
  // get Brokerage Collections
  getBrokerageCollections(BrokerageCollections:any){
    this.AllBrokerageCollections = BrokerageCollections;
    console.log(this.AllBrokerageCollections);
    
  }
          //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.GetAllClaims();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.GetAllClaims();
  }

  // getPrint(code:any){
  //   this._ClaimsService.getPrinted(code).subscribe((data:any)=>{
  //     console.log(data);
  //   },error=>{
  //     console.log(error);
  //   })
  // }
  // Addrisk(item:any){
  //   $(".overlayAddplan").fadeIn(300)
  //   $(".addnewplan").animate({right: '0px'});
  // }
  closeAddrisk(){
    $(".overlayAddplan").fadeOut(300)
    $(".addnewplan").animate({right: '-100%'});
  }
  Addrisk(code:any){
    this.loading = true
    $(".overlayAddplan").fadeIn(300)
    $(".addnewplan").animate({right: '0px'});
    this._ClaimsService.GetFileDataByClaimCode(code).subscribe(data=>{
      this.loading = false
      this.fileData = data;
      console.log(this.fileData);
    },error=>{
      console.log(error);
      this.loading = false
    })
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
 
 
  ngOnInit(){
    this._SharedService.changeData(false,'Claim','InitialClaim',false,false);

    this.GetAllClaims()
  }
}


