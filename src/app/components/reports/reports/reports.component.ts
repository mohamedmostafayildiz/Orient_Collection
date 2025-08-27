import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  constructor(private _SharedService:SharedService,){}
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)
  isDropdownOpen = false;
  activeDropdown: string | null = null;


  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }
  toggleDropdown(dropdownId: string) {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }
  showDropdown(dropdownId: string) {
    this.activeDropdown = dropdownId;

    // this.isDropdownOpen = true;
  }
  
  hideDropdown() {
    // this.isDropdownOpen = false;
    this.activeDropdown = null;
  }
  ngOnInit(): void {
    // this._SharedService.changeData(false,'','',false,false);

    
  }
}
