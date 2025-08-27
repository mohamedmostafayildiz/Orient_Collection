import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit{
  
  errorEsist:boolean =false;
  isClicked:boolean =false;
  Roles:any;
  errorMsg:any
  constructor(private _SharedService:SharedService, private _AuthService:AuthService, private _Router:Router, public _ToastrService:ToastrService,private _PolicyService:PolicyService){}

SignUPForm:FormGroup =new FormGroup({
    'firstName':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'lastName':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'userName':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'email':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'gender':new FormControl(''),
    'phoneNumber':new FormControl(''),
    'departmentId':new FormControl(''),
    'branchId':new FormControl(''),
    'password':new FormControl('',[Validators.required,Validators.minLength(3)])
});
// userAddedSuccessfully: boolean = false; // Flag to show the success message


  submitSignUpForm(){
      this.isClicked=true;
      let Model = Object.assign(this.SignUPForm.value,
        {role:'Employee'},
        )
        console.log(Model);
      this._AuthService.signUp(Model).subscribe((res:any) =>{
      this.isClicked=false;
      // this._ToastrService.success(res.massage, " Well Done");
      // this.userAddedSuccessfully = true;

      // Swal.fire(
      //   'Good job!',
      //   res.massage,
      //   'success'
      // )
      this._SharedService.setAlertMessage(res.massage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.SignUPForm.reset()
      this._Router.navigate(['/Users'])

      // this.get
        console.log(res);
      },error=>{
      this.errorMsg=error.error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
      this._ToastrService.error(this.errorMsg, "Error Eccurred");
        this.errorEsist =true;
        this.isClicked=false;
        console.log(error);
      })
    }
  getRoles(){
    this._AuthService.getRoles().subscribe(data=>{
      this.Roles=data;
    })
  }

  signup1:AnimationOptions={
    path:'assets/imgs/signup1.json'
  }
  AllBranches:any
  AllDepartments:any
  userName:any;
    // Get All
    getAllDepartments(){
      this._PolicyService.getAllDepartments().subscribe(data=>{
        this.AllDepartments =data;
      },error=>{
      })
    }
    getAllBranches(){
      this._PolicyService.getAllBranches().subscribe(data=>{
        this.AllBranches = data
      })
    }
    // First Name
  getFirstName(){
      this.userName = this.SignUPForm.get('firstName')?.value +'.'+ this.SignUPForm.get('lastName')?.value ;
      console.log(this.userName);
      this.SignUPForm.get('userName')?.setValue(this.userName)
  }
    // Last Name
  getLastName(){
      this.userName = this.SignUPForm.get('firstName')?.value +'.'+ this.SignUPForm.get('lastName')?.value ;
      console.log(this.userName);
      this.SignUPForm.get('userName')?.setValue(this.userName)
  }
ngOnInit(): void {
  this._SharedService.changeData(true,'','',false,false);

  this.getAllBranches()
  this.getRoles()
  this.getAllDepartments()
}

}
