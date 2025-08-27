import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { englishOnlyValidator, arabicTextValidator} from 'src/app/services/text-validators';
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/services/admin.service';
declare var $:any;
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss']
})
export class RiskComponent implements OnInit {
 
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;

  loading:boolean=false;
  isClicked:boolean =false;
  arrCate:any[]=[]
  arrTest:any[]=[];
  AllItems:any[]=[];
  categoryid:any
  categoryBenfitArr:any[]=[]

  constructor(private _SharedService:SharedService, private _ToastrService:ToastrService,private _AdminService:AdminService){}
  
  Form:FormGroup =new FormGroup({
    'id': new FormControl(null),
    'arabicName':new FormControl('',[Validators.required,arabicTextValidator()]),
    'englishName':new FormControl('',[Validators.required,englishOnlyValidator()]),});
  
EDitForm:FormGroup =new FormGroup({
    'benfitId':new FormControl('',[Validators.required]),
});
get arabicText() {
  return this.Form.get('arabicName')
}
get englishText(){
  return this.Form.get('englishName')
}

getText(){
  if(this.Form.get('arabicName')?.status == 'INVALID'){
    this._ToastrService.error('Text Shoud be arabic', " Well Done");
  }
}


  WhenModalOpen(){
    this.Form.reset();
    this.arrCate=[]
  }
  // Add Accounts Numbers
  view(){
    // var exixs = this.arrCate.find(item=>this.Form.value.arabicName == item.arabicName)
    // console.log(exixs);
    let Model = Object.assign(this.Form.value)
    console.log(Model);
    
    
    // if(exixs==undefined){
      this.arrCate.push(Model);
      console.log(this.arrCate);
      this.Form.reset()
    // }else{
    //   this._ToastrService.show('This Category already existed')
    // }
    // console.log(this.arrCate);
  }
  // Add Bank
  AddRisk(){
    this.isClicked =true
    this._AdminService.AddRisk(this.arrCate).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      this.getAllRisks()
      this.closeAddrisk()
      // Swal.fire({title:'Risk/Risks Added Successfully',timer:3000, timerProgressBar: true})
      this._SharedService.setAlertMessage(' Risk/Risks Added Successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.arrCate =[];
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrCate =[];
    })
  }
  remove(index:number){
    this.arrCate.splice(index, 1)
  }
             //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllRisks();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllRisks();
  }
  

 
  editaddArr:any[]=[]
  benefitIdCounter: number = 1;

  editAdd() {
    // Clone the form value to avoid direct mutation
    let Model = Object.assign({}, this.EDitForm.value);
  
    // Assign a unique ID to the new benefit
    const newBenefit = {
      ...Model,
      id: this.benefitIdCounter++
    };
  
    console.log(newBenefit);
  
    // Push the new benefit to the editaddArr
    this.editaddArr.push(newBenefit);
    console.log(this.editaddArr);
  
    // Optionally, reset the form and the editaddArr after adding
    // this.editaddArr = [];
    // this.EDitForm.reset();
  }
  getCategoryBenfit() {
    if (this.CurrentActivity && this.CurrentActivity.id) {
      this._AdminService.GetAllCategoriesBenfits(this.CurrentActivity.id).subscribe((data: any) => {
        // console.log(data);
        this.categoryBenfitArr = data;
      });
    }
  }
  removeBenfit(index:number){
    this.categoryBenfitArr.splice(index,1)
  }
  AllBenfitsArr:any
  // getAllBenfits(){
  //   this._AdminService.GetAllBenfits().subscribe((data:any)=>{
  //     // console.log(data);
  //     this.AllBenfitsArr = data
  //     // console.log(this.AllBenfitsArr);
      
  //   })
  // }
  // Edite Category
  CurrentActivity:any
  openEditModal(Category:any){
    console.log(Category);
    this.CurrentActivity=Category
    this.Form.setValue({id: Category.id,arabicName:Category.arabicName,englishName:Category.englishName})
    // this.EDitForm.setValue({id:Category.benfits.id,arabicName:Category.benfits.arabicName,englishName:Category.benfits.englishName,maxLimit:Category.benfits.maxLimit,})
    
    this.editaddArr = Category.benefits
    // this.getCategoryBenfit()

  }
  Editgovenmante(Category:any){
    $(".overlayEdit").fadeIn(300)
    $(".Editgovernmant").animate({right: '0px'});
    console.log(Category);
    this.CurrentActivity=Category
    this.Form.setValue({id: Category.id,arabicName:Category.arabicName,englishName:Category.englishName})
  }
  closeEditgovenmantee(){
    $(".overlayEdit").fadeOut(300)
    $(".Editgovernmant").animate({right: '-30%'});
  }
  formData:any = new FormData();
  // AddBenfit(){
  //   const selectedCategoryId = this.Form.get('id')?.value;
  //   console.log(selectedCategoryId);
  //   let benefitId = this.EDitForm.value.benfitId;
  //   console.log(benefitId);
  // this._AdminService.AddBenfitToCategory(benefitId,selectedCategoryId).subscribe((data:any)=>{
  //   console.log(data);
  //   console.log(benefitId);
  //   let selectedBenefit = this.AllBenfitsArr.find((benfit:any) => benfit.id == benefitId);
  //   console.log(selectedBenefit);
  //   if (selectedBenefit) {
  //     this.categoryBenfitArr.push(selectedBenefit);
  //   }
  //   console.log( this.categoryBenfitArr);
  //   Swal.fire({title:'Benfit Added Successfully',timer:3000, timerProgressBar: true})
  // },error=>{
  //   console.log(error);
  //   Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  // })
  // }

  saveRiskEdit(){
    this.isClicked = true
    if (this.CurrentActivity) {
      // let Model = Object.assign(this.Form.value, { benfitId: this.categoryBenfitArr.map(benefit => benefit.id) });
      let Model = Object.assign(this.Form.value);
      console.log(Model);    
      this._AdminService.EditCategory(Model).subscribe((res) => {
        this.isClicked = false
        console.log(res);
        this.closeEditgovenmantee()
        this.getAllRisks();
        Swal.fire({ title: "Good job!", text: "Risk Updated Successfully", icon: "success" })
        this.formData = new FormData();
      }, error => {
        console.log(error);
        this.isClicked = false
        this.formData = new FormData();
        Swal.fire({ icon: "error", title: "Oops...", text: error.error });
      });
    }
  }
  //Delet Benfit Category
  RiskId:any
  deleteRisk(){
  
    
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirmed, proceed with the delete API call
        this._AdminService.DeleteRisk(this.USERID).subscribe(
          (data:any) => {
            Swal.fire('Deleted!',data);
            this.closeNewAccType()
            this.getAllRisks();
          },
          (error) => {
            console.log(error);
            // Show error message if delete operation fails
            Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If user canceled, show cancellation message
        Swal.fire('Cancelled','Your item is safe :)','error'
        );
      }
    });
  }

    // Get All
    getAllRisks(){
      this.loading = true;

    this._AdminService.GetAllRisks().subscribe((data:any)=>{
      this.loading = false;
      this.AllItems =data;

      console.log(this.AllItems);
    },error=>{
      console.log(error);
      this.loading = false;

    })
  }
  // loadData() {
  //   this.loading = true;
  
  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 2000); 
  // }
  Addrisk(item:any){
    $(".overlayAdd").fadeIn(300)
    $(".Addgovernmant").animate({right: '0px'});
  }
  closeAddrisk(){
    $(".overlayAdd").fadeOut(300)
    $(".Addgovernmant").animate({right: '-30%'});
  }
// Delete
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
    this._SharedService.changeData(false,'Add new risk','',true,true);
    this._SharedService.openModal$.subscribe((item: any) => {
      this.Addrisk(item); // Change 'edit' to 'add' as needed
    });
    this._SharedService.currentMessage.subscribe(message => {
      if(message){
        $("#filters").show(300)
      }else{
        $("#filters").hide(300)
      }
    });

    // this.getCategoryBenfit()
    this.getAllRisks()
    // this.getAllBenfits()
    // this.loadData()
  }
}
