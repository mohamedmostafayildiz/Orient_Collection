import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
declare var bootstrap :any
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];

  AllBranches:any;
  loading:boolean=false
  EditId:any
  term:any;
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  AddDepartmentForm:FormGroup =new FormGroup({
    'name':new FormControl('',[Validators.required,Validators.minLength(3)]),
});
  constructor(private _AuthService:AuthService ,private _PolicyService:PolicyService,private _SharedService:SharedService){

  }
  
 
      // Get All
  getAllDepartments(){
    this.loading=true;
    this._PolicyService.getAllDepartments().subscribe(data=>{
      this.AllBranches =data;
      this.loading=false;
      console.log(this.AllBranches);
    },error=>{
      this.loading=true;
    })
  }
  Addgovenmante(item:any){
    this.AddDepartmentForm.reset()
    $(".overlayAdd").fadeIn(300)
    $(".Addgovernmant").animate({right: '0px'});
  }
  closeAddgovenmantee(){
    $(".overlayAdd").fadeOut(300)
    $(".Addgovernmant").animate({right: '-30%'});
  }
      // Add Department
  AddDepartment(){
    this.isClicked=true
    console.log(this.AddDepartmentForm.value);
    this._PolicyService.AddDepartment(this.AddDepartmentForm.value).subscribe((res:any)=>{
      this.isClicked=false
      console.log(res);
      this.closeAddgovenmantee()
      this.getAllDepartments()
      // Swal.fire({title:res.name+' Department Added Successfully',timer:2300, timerProgressBar: true})
      this._SharedService.setAlertMessage(res.name + ' Department Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      this.isClicked=false
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  getBranchDetails(Branch:any){
    console.log(Branch);
    this.EditId = Branch.id
    this.AddDepartmentForm.get('name')?.setValue(Branch.name)
  }
  Editgovenmante(Branch:any){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    console.log(Branch);
    this.EditId = Branch.id
    this.AddDepartmentForm.get('name')?.setValue(Branch.name)
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
 SubmitEditBranch(){
  this.isClicked=true
  let Model = Object.assign(this.AddDepartmentForm.value,
    {id:this.EditId}
  )
  console.log(Model);
  
    this._PolicyService.UpdateDepartment(Model).subscribe((res:any)=>{
      this.isClicked=false
      this.closeEditgovenmantee()
      this.getAllDepartments()
      // Swal.fire({title:res.name+' Department Edited Successfully',timer:2300, timerProgressBar: true})
      this._SharedService.setAlertMessage(res.name + ' Department Edited Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      this.isClicked=false
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
      
    })
  
}
isClicked:boolean=false
//////////// Delete ////////////
deleteDepartment(){
  this.isClicked=true
  this._PolicyService.DeleteDepartment(this.USERID).subscribe((res:any)=>{
    this.isClicked=false
    console.log(res);
    this.getAllDepartments()
    this.closeNewAccType()
    this._SharedService.setAlertMessage(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });  
    // Swal.fire({title:res,timer:2300, timerProgressBar: true})
  },error=>{
    this.isClicked=false
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
}
  WhenModalOpen(){
    this.AddDepartmentForm.reset()
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllDepartments();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllDepartments();
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
    this._SharedService.changeData(false,'Add department','',false,true);
    // this._SharedService.openModal$.subscribe(() => {
    //   const modal = new bootstrap.Modal(document.getElementById('Add'));
    //   modal.show();
    // });
    this._SharedService.openModal$.subscribe((item: any) => {
      this.Addgovenmante(item); 
    });
    this.getAllDepartments();
  }
}
