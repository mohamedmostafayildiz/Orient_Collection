import { Component, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
declare var $ : any
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-all-exchange-premit',
  templateUrl: './all-exchange-premit.component.html',
  styleUrls: ['./all-exchange-premit.component.scss']
})
export class AllExchangePremitComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=15;
  tableSizes=[15,10,5];
  AllExchangePermits:any;
  AllBrokerageCollections:any;
  loading:boolean= false
  constructor(private _CollectionService:CollectionService,private _SharedService:SharedService){}
  getAllExchangePermits(){
    this.loading = true
    this._CollectionService.getAllExchangePermits().subscribe(data=>{
      this.loading = false;
      this.AllExchangePermits = data;
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
    $(".overlayPortflioCollections").fadeIn(300)
    $(".closePortflioCollections").animate({right: '0px'});
    
  }
  closePortflioCollections(){
    $(".overlayPortflioCollections").fadeOut(300)
    $(".closePortflioCollections").animate({right: '-30%'});
  }
          //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllExchangePermits();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllExchangePermits();
  }
  ngOnInit(){
    this._SharedService.changeData(false,'','',false,false);

    this.getAllExchangePermits()
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
}
