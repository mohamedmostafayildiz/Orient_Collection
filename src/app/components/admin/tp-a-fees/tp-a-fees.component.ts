import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
declare var $:any
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-tp-a-fees',
  templateUrl: './tp-a-fees.component.html',
  styleUrls: ['./tp-a-fees.component.scss']
})
export class TpAFeesComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  feesEditId:any
  loading:boolean =false
  TpaCustomersFees:any;
  term:any;
  isClicked:boolean = false

  BusinessTypes:any
  InsuranceClasses:any
  CommisionTypes:any;
  paymentWays:any
  pctCommission:any;
  addCommissionErrorMsg:any;
  pct:any=''
  amount:any=''
  CustomerId:any
  validCommistionSelects:boolean=false;
  brokerCustomers:any
  constructor(private _AdminService:AdminService, private _ToastrService:ToastrService,private _SharedService:SharedService){}

  comisionForm = new FormGroup({
    'fees':new FormControl('',[Validators.required]),
  })
  /////// Add ////////////////////
  // submitCommissionToCustomerForm(){
  //   this.isClicked = true;
  //   let Model =Object.assign(this.comisionForm.value,
  //     {pct:this.pct/100},
  //     {commissionType:null},
  //     {amount:0},
  //     {paymentWay:null},
  //   )
  //     console.log(Model);
      
  //   this._AdminService.AddCommissionToCustomer(Model).subscribe(data=>{
  //     this.isClicked = false;
  //     console.log(data);
  //     document.getElementById("close")?.click()
  //     Swal.fire('Good job!','Commission Added Successfully','success')
  //     this.GetAllTpaFees()
  //   },error=>{
  //     this.isClicked = false;
  //     Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  //     console.log(error);
  //     this.addCommissionErrorMsg=error.error;
  //     this._ToastrService.error(this.addCommissionErrorMsg , 'Error Occurred');
  //   })
    
  // }
  ////////////// Edit ///////////////
  idEdit:any;
  getDetailsToEdit(item:any){
    this.idEdit =item.id
    this.comisionForm.get('fees')?.setValue(item.fees);
  }
  Editgovenmante(item:any){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    this.idEdit =item.id
    this.comisionForm.get('fees')?.setValue(item.fees);
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
  SubmitEdit(){
    this.isClicked = true;
    let Model =Object.assign(this.comisionForm.value,
      {id:this.idEdit},
      
    )
    console.log(Model);

    this._AdminService.EditTpaFees(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      // Swal.fire('Edited Successfully','','success')
      this._SharedService.setAlertMessage('Edited Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.GetAllTpaFees()
      this.closeEditgovenmantee()
    },error=>{
      this.isClicked = false;
      Swal.fire({
        icon: 'error',
        title: error.error,
        text: '',
      })
    })
  }
  
  GetAllTpaFees(){
    this.loading=true;
    this._AdminService.GetAllTpaFees().subscribe(data=>{
    this.loading=false
      this.TpaCustomersFees=data
      console.log(data);
    },error=>{
      this.loading=false
    })
  }
  check1(e:any){
    this.pct=e.target.value;
  }



           //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.GetAllTpaFees();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.GetAllTpaFees();
  }
  //get Business Types
  getBusinessTypes(){
    this._AdminService.getBusinessTypes().subscribe(data=>{
      this.BusinessTypes=data;
    })
  }
    //get Insurance Types
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe(data=>{
      this.InsuranceClasses=data;
    })
  }

  getTpaCustomer(){
    this._AdminService.getAllCustomers(2).subscribe((data:any)=>{
      this.brokerCustomers =data;
    })
  }
  ngOnInit(): void {
    this._SharedService.changeData(false,'','',true,false);
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });

    this.GetAllTpaFees()
    this.getBusinessTypes();
    this.getTpaCustomer();
    this.getInsuraneClass();
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
