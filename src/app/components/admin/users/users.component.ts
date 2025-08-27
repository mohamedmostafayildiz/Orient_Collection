import { STRING_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
// import { pipe, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)


  selectedRoleValue:any;
  selectedGenderValue:any
  Roles:any
  Users:any;
  loading:boolean=false
  CustomerTypeId:any;
  term:any
  departmentId:any
  userId:any
  EditUserForm:FormGroup =new FormGroup({
    'firstName':new FormControl('',[Validators.required,Validators.minLength(5)]),
    'lastName':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'userName':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'email':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'phoneNumber':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'isLocked':new FormControl(false),
    'lockDate':new FormControl('')
});
  ChangePasswordForm:FormGroup =new FormGroup({
    'newPassword':new FormControl('',[Validators.required]),
    'confirmPassword':new FormControl('')
  });
  constructor(private _SharedService:SharedService,private _AuthService:AuthService ,private _ActivatedRoute:ActivatedRoute, private _Router:Router){
    this.CustomerTypeId=this._ActivatedRoute.snapshot.paramMap.get('id');
    console.log(this.CustomerTypeId); 
  }
  
  getUserDetails(user:any){
    console.log(user);
    this.userId=user.id
    this.departmentId=user.departmentId
    this.selectedRoleValue=String(user.roleId)
    this.selectedGenderValue=String(user.genderId)
    this.EditUserForm.get('firstName')?.setValue(user.firstName);
    this.EditUserForm.get('lastName')?.setValue(user.lastName);
    this.EditUserForm.get('userName')?.setValue(user.userName);
    this.EditUserForm.get('email')?.setValue(user.email);
    this.EditUserForm.get('phoneNumber')?.setValue(user.phoneNumber);
    this.EditUserForm.get('password')?.setValue(user.password);
    this.EditUserForm.get('isLocked')?.setValue(user.isLocked);
    this.EditUserForm.get('lockDate')?.setValue(user.lockDate);
  }

  getUsers(){
    this.loading=true;
    this._AuthService.getAllUsers().subscribe(data=>{
      this.Users =data;
      this.loading=false;
      console.log(this.Users);
    },error=>{
      console.log(error);
      if(error.status==0){
        this._Router.navigate(['/Forbidden'])
      }
    })
  }
  getRoles(){
    this._AuthService.getRoles().subscribe(data=>{
      this.Roles=data;
    })
  }
  Editgovenmante(user:any){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    console.log(user);
    this.userId=user.id
    this.departmentId=user.departmentId
    this.selectedRoleValue=String(user.roleId)
    this.selectedGenderValue=String(user.genderId)
    this.EditUserForm.get('firstName')?.setValue(user.firstName);
    this.EditUserForm.get('lastName')?.setValue(user.lastName);
    this.EditUserForm.get('userName')?.setValue(user.userName);
    this.EditUserForm.get('email')?.setValue(user.email);
    this.EditUserForm.get('phoneNumber')?.setValue(user.phoneNumber);
    this.EditUserForm.get('password')?.setValue(user.password);
    this.EditUserForm.get('isLocked')?.setValue(user.isLocked);
    this.EditUserForm.get('lockDate')?.setValue(user.lockDate);
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
  submitEditUser(){
    console.log(this.EditUserForm.status);
    
    this.isClicked=true
    let Model= Object.assign(this.EditUserForm.value,
      {role:Number(this.selectedRoleValue)},
      {departmentId:Number(this.departmentId)},
      {gender:Number(this.selectedGenderValue)},
      {id:this.userId}
      )
  console.log(Model);
  this._AuthService.EditUser(Model).subscribe(res=>{
    this,this.isClicked=false
    console.log(res);
    // Swal.fire(
    //   'Good job!',
    //   'Customer Edited Successfully !',
    //   'success'
    // )
    this._SharedService.setAlertMessage(' User Edited Successfully !');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getUsers();
    // document.getElementById('clodeEditModal')?.click()
    this.closeEditgovenmantee()
  },
  error=>{
    this.isClicked=false
    console.log(error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error,
    })
    
  })
  }
       // Show Locked with Animation
  isLockedToggle(){
    if(this.EditUserForm.get('isLocked')!.value==true){
    $("#lockDate").show(500)
    }else{
    $("#lockDate").hide(500)
    this.EditUserForm.get('lockDate')?.setValue('')
    }
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getUsers();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getUsers();
  }
  //////////////Delete User ///////////
 
  deleteUser(){
    console.log("Ok");
    
    this.loading =true;
    this.isClicked =true;
    this._AuthService.DeleteUser(this.USERID).subscribe(data=>{
      this.isClicked =false;
      this.loading =false;
      console.log(data);
      this.getUsers()
      this.closeNewAccType()
      this._SharedService.setAlertMessage(' User Deleted Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },error=>{
      this.loading =false;
      this.isClicked =false;
      console.log(error);
    })
  }
  /////////////////////// Change Password/////////
  isClickedChange:boolean= false
  optionItems:any=''
  SubChangePassword(){
    this.isClickedChange= true;
    let Model = {
      "userId":this.ID,
      "newPassword":this.ChangePasswordForm.get("newPassword")?.value
    }
    console.log(Model);
    this._AuthService.changePassword(Model).subscribe(res=>{
      $("#Forgot").modal('toggle')
      this.isClickedChange= false;
      this._SharedService.setAlertMessage(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Swal.fire('Good job!',res,'success')
    },error=>{
      let Error =JSON.parse(error.error);
      console.log(Error);
      
      
          for (let i=0;i<Error.length;i++){ 
            this.optionItems += `<p >${Error[i].description}</p>` 
          }
          
      this.isClickedChange= false;
      Swal.fire({icon: 'error',title: 'Oops...',html:this.optionItems})
    })
  }
  checkPass(){
    // console.log(this.ChangePasswordForm.get('newPassword')?.value);
    console.log(this.ChangePasswordForm.get('confirmPassword')?.value);
    if(this.ChangePasswordForm.get('newPassword')?.value==this.ChangePasswordForm.get('confirmPassword')?.value){
      this.ChangePasswordForm.get('confirmPassword')?.setErrors(null)
    }else{
      this.ChangePasswordForm.get('confirmPassword')?.setErrors({'incorrect': true})
    }
    
  }
  ngOnInit(): void {
    this._SharedService.changeData(false, 'Add new user','signup',true,false);
    this.getUsers();
    this.getRoles();
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });

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

    ID:any
    isClicked:boolean=false
    getUserId(id:any){
      this.ID = id;
      $(".overlayAdd").fadeIn(300)
      $(".Addgovernmant").animate({right: '0px'});
      this.ChangePasswordForm.reset();
    }
    closeEditPassword(){
      $(".overlayAdd").fadeOut(300)
      $(".Addgovernmant").animate({right: '-30%'});
    }
}
