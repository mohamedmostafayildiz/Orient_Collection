import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
declare var $:any
declare var bootstrap:any

@Component({
  selector: 'app-governorates',
  templateUrl: './governorates.component.html',
  styleUrls: ['./governorates.component.scss']
})
export class GovernoratesComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];

  AllItems:any
  loading:boolean=false
  isClicked:boolean=false
  EditId:any
  term:any;
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  Form:FormGroup =new FormGroup({
    'name':new FormControl('',[Validators.required,Validators.minLength(3)]),
  });
  constructor(private _AuthService:AuthService , private _PolicyService:PolicyService,private _SharedService:SharedService){
  }
      // Get All
  getAllGovernorates(){
    this.loading=true;
    this._PolicyService.getAllGovernorates().subscribe(data=>{
      this.AllItems =data;
      this.loading=false;
      console.log(this.AllItems);
    },error=>{
      this.loading=true;
    })
  }
  Addgovenmante(item:any){
    this.Form.reset()
    $(".overlayAdd").fadeIn(300)
    $(".Addgovernmant").animate({right: '0px'});
  }
  closeAddgovenmantee(){
    $(".overlayAdd").fadeOut(300)
    $(".Addgovernmant").animate({right: '-30%'});
  }
      // Add Governorates
      isSuccess:boolean = false;
      successMessage:any
  AddItem(){
    this.isClicked = true;
    console.log(this.Form.value);
    
    this._PolicyService.AddGovernorates(this.Form.value).subscribe((res:any)=>{
      this.isClicked = false;
      this.isSuccess = true;
      console.log(res);
      this.Form.reset()
      this.getAllGovernorates()
      this.closeAddgovenmantee()
      this._SharedService.setAlertMessage(res.name + ' governorate Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // this.successMessage = res.name + ' Department Added Successfully';

      // Swal.fire({title:res.name+'Department Added Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  getBranchDetails(item:any){
    console.log(item);
    this.EditId = item.id
    this.Form.get('name')?.setValue(item.name)
  }
  Editgovenmante(item:any){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    console.log(item);
    this.EditId = item.id
    this.Form.get('name')?.setValue(item.name)
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
 SubmitEditBranch(){
  this.isClicked = true;
  let Model = Object.assign(this.Form.value,
    {id:this.EditId}
  )
  console.log(Model);
  
    this._PolicyService.UpdateGovernorates(Model).subscribe((res:any)=>{
      this.isClicked = false;
      this.getAllGovernorates()
      this.closeEditgovenmantee()
      // Swal.fire({title:res.name+' Governorates Edited Successfully',timer:2300, timerProgressBar: true})
      this._SharedService.setAlertMessage(res.name + ' Governorate Edited Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      this.isClicked = false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
    })
}
//////////// Delete ////////////
deleteDepartment(){
  this.isClicked=true
  this._PolicyService.DeleteGovernorates(this.USERID).subscribe((res:any)=>{
    this.isClicked=false
    console.log(res);
    this.getAllGovernorates()
    this.closeNewAccType()
    // Swal.fire({title:res,timer:2300, timerProgressBar: true})
    this._SharedService.setAlertMessage(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });  
    },error=>{
    this.isClicked=false
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
}
  WhenModalOpen(){
    this.Form.reset()
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllGovernorates();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllGovernorates();
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
    // New AccountType 
    USERID:any
    AddNewAccType(id:any){
      console.log(id);
      this.USERID=id
      
      $(".overlay").fadeIn(300)
      $(".delet").animate({right: '0px'});
    }
    closeNewAccType(){
      $(".overlay").fadeOut(300)
      $(".delet").animate({right: '-30%'});
    }

  ngOnInit(): void {
    this._SharedService.changeData(false,'Add governorate','',false,true);
    // this._SharedService.openModal$.subscribe(() => {
    //   const modal = new bootstrap.Modal(document.getElementById('Add'));
    //   modal.show();
    // });
    this._SharedService.openModal$.subscribe((item: any) => {
      this.Addgovenmante(item); // Change 'edit' to 'add' as needed
    });
    this.getAllGovernorates();
  }
}
