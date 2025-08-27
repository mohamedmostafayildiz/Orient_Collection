import { Component } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import { ClaimComponent } from '../../Compensation/claim/claim.component';
import { ClaimsService } from 'src/app/services/claims.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-claims-exchange-permits',
  templateUrl: './claims-exchange-permits.component.html',
  styleUrls: ['./claims-exchange-permits.component.scss']
})
export class ClaimsExchangePermitsComponent {
  page:number=1;
  count:number=0;
  tableSize:number=10;
  tableSizes=[5,10,15,20];
  AllData:any;
  AllBrokerageCollections:any;
  loading:boolean= false
  constructor(private _CollectionService:CollectionService, private _ClaimsService:ClaimsService,private _SharedService:SharedService){}
  GetAllClaimsPermits(){
    this.loading = true
    this._ClaimsService.GetAllClaimsPermits().subscribe(data=>{
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
    this.GetAllClaimsPermits();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.GetAllClaimsPermits();
  }
 // Delete
 deleteClaim(id:any){

    
  // Show SweetAlert2 confirmation dialog
  Swal.fire({
    title: 'Delete Exchange Permit',
    text: "Are you sure you want to delete this Exchange Permit ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirmed, proceed with the delete API call
      this._ClaimsService.RemoveExchangePermit(id).subscribe((data) => {
          // Show success message
          // Swal.fire(
          //   'Deleted!',
          //   'Exchange Permit Deleted Successfully',
          //   'success'
          // );
          this._SharedService.setAlertMessage('Exchange Permit Deleted Successfully');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.GetAllClaimsPermits();
        },
        (error) => {
          console.log(error);
          // Swal.fire(
          //   'Error!',
          //   'There was an error deleting the Exchange Permit. Please try again.',
          //   'error'
          // );
          Swal.fire({icon: 'error',title:error.error,text:''})

        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // If user canceled, show cancellation message
      Swal.fire(
        'Cancelled',
        'Your Exchange Permit is safe 😊',
        'error'
      );
    }
  });
  
  
}
  // getPrint(code:any){
  //   this._ClaimsService.getPrinted(code).subscribe((data:any)=>{
  //     console.log(data);
  //   },error=>{
  //     console.log(error);
  //   })
  // }
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
    this.GetAllClaimsPermits()
  }
}
