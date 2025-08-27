import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClaimsService } from 'src/app/services/claims.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-update-claim-status',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss'],
  providers:[DatePipe]
})
export class ClaimComponent {
  PolicyId:any;
  selectedMainFile:any='';
  selectedComfirmedFile:any='';
  selectedModalFile:any;
  FileName:any;
  TpaId:any;
  listOfTpa:any;
  MainFileId:any;
  formData:any = new FormData()
  formData2:any = new FormData()
  AllFiles:any[]=[]
  loading:boolean = false
  netPremVAl:any
  ModelArr:any[]=[]
  isClicked:boolean = false
  ClaimAmount:any
  ClaimPaid:any
  itemId:any
  // Claim1Date:any = ''
  ExcelFileId:any=''
  CurrentDate:any = new Date()
  After10Days:any = new Date()
  ManageForm:FormGroup = new FormGroup({
    'PayedClaimAmount':new FormControl('',[Validators.required]),
    'Status':new FormControl('',[Validators.required]),
    'Note':new FormControl('')
  })
  ClaimForm:FormGroup = new FormGroup({
    'DateOfEntryOfClaim':new FormControl(this.CurrentDate,[Validators.required]),
    'DateOfReceiptOfTheClaim':new FormControl('',[Validators.required]),
    'GrossAmount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),
    'ClaimForMonth':new FormControl('',[Validators.required]),
    'Discount':new FormControl(''),
  })
  
  constructor(private _ClaimsService:ClaimsService,
    private _PolicyService:PolicyService,private _DatePipe:DatePipe
    ,private _ActivatedRoute:ActivatedRoute, private _Router:Router,private _ToastrService:ToastrService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    // this.After10Days.setDate(this.CurrentDate.getDate() + 10)
    this._ActivatedRoute.queryParams.subscribe((data:any)=>{
      this.ExcelFileId = data.excelFileId;
    })
  }

      // get Temp
  getTempleteFile(){
    this._ClaimsService.getClaimsTempleteFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'Claims templete.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }

  Model:any = ''
  FileNamee:any
  FileNoteStatus:any=''
  /////////////////////// Save Main File //////////////
  EnableFinalBtn:boolean=false
  SubmitClaim(){
    for(let i=0;i<=this.AllFiles.length;i++){
      let Exist = this.AllFiles.find(item=>item.status=='pending')
      if(!Exist){
        this.EnableFinalBtn=false
      }else{
        this.EnableFinalBtn=true
      }
    }
    this.formData.append('policyId',this.PolicyId)
    this.formData.append('ExcelFile',this.selectedMainFile);
    
    this.Model = Object.assign(this.ClaimForm.value,
      {Discount:this.ClaimForm.get('Discount')?.value==null?'':this.ClaimForm.get('Discount')?.value},  
      {DateOfEntryOfClaim:this._DatePipe.transform(this.ClaimForm.get('DateOfEntryOfClaim')?.value,'yyyy-MM-dd')},
      {DateOfReceiptOfTheClaim:this._DatePipe.transform(this.ClaimForm.get('DateOfReceiptOfTheClaim')?.value,'yyyy-MM-dd')==null?'':this._DatePipe.transform(this.ClaimForm.get('DateOfReceiptOfTheClaim')?.value,'yyyy-MM-dd')},
      {paymentDate:this._DatePipe.transform(this.ClaimForm.get('paymentDate')?.value,'yyyy-MM-dd')==null?'':this._DatePipe.transform(this.ClaimForm.get('paymentDate')?.value,'yyyy-MM-dd')},
      )
    
      // Append Values
      for (const key of Object.keys(this.Model)){
        const value = this.Model[key];
        this.formData.append(key, value);
      }
      // Log Values
      for (var pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
      }
    
    this._ClaimsService.AddClaim(this.formData).subscribe((res:any)=>{
      $("#FinalBtns").show(500)
      $("#uploadFilesTap").show(500)
      this.FileNamee= res[0].fileName
      this.AllFiles = res
      this._Router.navigate(['/Claim',this.PolicyId],{
        queryParams:{excelFileId:res.excelFileId}
      })
      console.log(res);
      $('#claimTable').show(500)
      this.isClicked=false
      this.ExcelFileId = res.excelFileId
      Swal.fire('Claim Added Successfully','','success')
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.isClicked=false
      this.selectedMainFile = ''
    })
    this.formData = new FormData()
    
  }

  
  uploadMainFile(event: any){
    this.selectedMainFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  uploadComfirmedFiles(event: any){
    this.selectedComfirmedFile = event.target.files[0] ?? null;
    event.target.value='' 
  }

  getListOfTpa(){
    this._PolicyService.getListOfTpa().subscribe(data=>{
      this.listOfTpa = data;
    })
  } 

  ////////////////////////////  Modal /////////////////////

  getClaimValue(id:any,claimVal:any){
    this.itemId = id;
    this.ClaimAmount = claimVal
    console.log(claimVal);
    this.ManageForm.get('PayedClaimAmount')?.setValue(claimVal);
  }

  ReceivingTheClaim(e:any){
    $("#setllement").show(500)
    let After10Days =new Date()
    After10Days = new Date(e.target.value)
    After10Days.setDate(After10Days.getDate() + 10)
    
    this.ClaimForm.get("paymentDate")?.setValue(After10Days)

  }


  values:any[]=[]
  values2:any[]=[]
  ArrTest:any[]=[]

  // Select All
  SelectAll(){
    // for(let i=0;i<this.AllFiles;i++){

    // }SubmitClaim
    this.ArrTest = []
    this.IndexesArr = []
    for(let i=0; i< this.AllFiles.length;i++){
      if(this.AllFiles[i].status!="Reject"||this.AllFiles[i].status!="rejected"){
        this.values[i]=true;
        this.IndexesArr.push(i)
      }
    }
    console.log(this.IndexesArr);
  }

  // Get Item Id
  IndexesArr:any[]=[]
  getItemId(Checked:any,i:any){
    if(Checked ==true){
      this.IndexesArr.push(i);
    }else{
      let index = this.IndexesArr.indexOf(i);
      this.IndexesArr.splice(index , 1)
    }
    console.log(this.IndexesArr); 
  }

  FilesArr:any[]=[]

  viewFile(){
    var item = this.FilesArr.find(item=>item.name ==this.selectedComfirmedFile.name)
    if(item== undefined){
      let model = {
        FileNote:this.selectedComfirmedFile,
        status:this.FileNoteStatus
      }
      this.FilesArr.push(model)
      console.log(this.FilesArr);
      this.selectedComfirmedFile = ''
      this.FileNoteStatus = ''
    }else{
      this._ToastrService.show('',"This File Already Exist")
    }
  }
  remove(i:any){
  this.FilesArr.splice(i, 1)
  }
  //////////////=> Submit Items <=/////////////////
  SubmitItems(Decision:any, FinalBtn:any){
    FinalBtn as HTMLButtonElement
    if(Decision==1){

      this.IndexesArr.forEach(element => {
        this.AllFiles[element].status = 'Confirm'
      });
    }else{
      this.IndexesArr.forEach(element => {
        this.AllFiles[element].status = 'Reject'
      })
    }
    this.IndexesArr= []      

    //Enable btn 
    for(let i=0;i<=this.AllFiles.length;i++){
      let Exist = this.AllFiles.find(item=>item.status=='pending')
      if(!Exist){
        FinalBtn.disabled=false
      }else{
        FinalBtn.disabled=true

      }
    }

    
  }

//////////////////// Final Save  ///////////////////
finalSave(){
  this.formData2.append('policyId',this.PolicyId)
  this.formData2.append('FileName',this.FileNamee)
  this.formData2.append('File',this.selectedMainFile) 
  // this.formData2.append('FileClaims',this.AllFiles)
  // }          // Append Model
  for (const key of Object.keys(this.Model)){
    const value = this.Model[key];
    this.formData2.append(key, value);
  }
  // file Claims
  for(var i=0;i<this.AllFiles.length;i++){
    if(this.AllFiles[i].status=='Confirm'||this.AllFiles[i].status=='confirmed'){
      this.formData2.append('FileClaims['+ i +'].status',1)
    }else if(this.AllFiles[i].status=='Reject'||this.AllFiles[i].status=='rejected'){
      this.formData2.append('FileClaims['+ i +'].status',2)
    }
    this.formData2.append('FileClaims['+ i +'].id',this.AllFiles[i].fileClaimsId)
    
  } 
  // append Files
  for(let i=0;i<this.FilesArr.length;i++){
    this.formData2.append('FileNotes['+ i +'].fileNote',this.FilesArr[i].FileNote)
    this.formData2.append('FileNotes['+ i +'].status',this.FilesArr[i].status)
  }

  // log
  for (var pair of this.formData2.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }
  this._ClaimsService.UpdateSatus(this.formData2).subscribe(data=>{
    console.log(data);
    this.ExcelFileId = data;
    $(".remove").hide(500)
    $("#FinalBtns").hide(500)
    $("#AddClaimBtn").hide(500)
    $("#uploadFilesTap").hide(500)
    $("#newClaimBtn").show(500)
    Swal.fire('Process Completed Successfully','File Code is:' + data , 'success')
  },error=>{
    console.log(error);
    Swal.fire({icon: 'error',title:error.error,text:'Enter Date Again'})
    // this.ClaimForm.reset();
    // this.AllFiles.find(item=>item.status==5)
    for(let i=0; i< this.AllFiles.length;i++){
        this.values[i]='';
    }
    this.AllFiles=[]
    this.IndexesArr=[]
    this.FilesArr=[]
    this.FileNamee = ''
    this.selectedMainFile = ''
    this.Model = ''
    this.EnableFinalBtn = false;
  })
  this.formData2 = new FormData()
  this.IndexesArr = []
}

NewClaim(){
  for(let i=0; i< this.AllFiles.length;i++){
    this.values[i]='';
  }
  this.AllFiles=[]
  this.IndexesArr=[]
  this.FilesArr=[]
  this.FileNamee = ''
  this.selectedMainFile = ''
  this.Model = ''
  $("#newClaimBtn").hide(500)
  $("#AddClaimBtn").show(500)
  $(".remove").show(500)
}

  ngOnInit(){
    this.getListOfTpa()
  
  }
}
