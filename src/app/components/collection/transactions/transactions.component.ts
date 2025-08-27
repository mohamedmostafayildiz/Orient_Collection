import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from 'src/app/services/collection.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  constructor(private _SharedService:SharedService,private _TranslateService:TransactionService,private _ToastrService:ToastrService,private _CollectionService:CollectionService){}
   selectedChartofAccountFile:any=''
  uploadLegacyDetailsFile(event: any){
    this.selectedChartofAccountFile = event.target.files[0] ?? null;
    event.target.value='' 
  }
   FILEeName:any
  getTempleteFile(){
    this._TranslateService.GetTrabsactionTemplete().subscribe(res=>{
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FILEeName= 'Transactions.xlsx'
      let a= document.createElement('a');
      a.download=this.FILEeName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
    //Save File
  isClickedDocumnet:boolean=false
  transactionNumbers:any[]=[]
  RepeatedAllTransactions:any[]=[]
  Save(){
    var formData = new FormData()
    formData.append('File',this.selectedChartofAccountFile);
    this.isClickedDocumnet=true
    this._TranslateService.UploadTransactionTemplete(formData).subscribe((res:any)=>{
      console.log("res",res);
       if (res.isSuccess) {
      if (res.transactionNumbers?.length > 0) {
        this.transactionNumbers=res.transactionNumbers
         // case: file uploaded but duplicates
    this.RepeatedAllTransactions = this.AllTransactions.filter((t: any) =>
      this.transactionNumbers.includes(t.transactionNo.toString())
    );
        console.log(" this.RepeatedAllTransactions", this.RepeatedAllTransactions);

        // case: file uploaded but duplicates
        this._ToastrService.warning(
          `File uploaded successfully but ${res.transactionNumbers.length} repeated transactions found: ${res.transactionNumbers.join(', ')}`,
          'Duplicate Transactions'
        );
      }  
      else {
        // case: transactions created successfully
        this._ToastrService.success('File uploaded and transactions added successfully', 'Success');
        this.transactionNumbers=[]

      }
    } else {
      this._ToastrService.error('File upload failed', 'Error');
    }
      this.isClickedDocumnet=false
      this.selectedChartofAccountFile=null
      this.selectedChartofAccountFile=''
      // Swal.fire(res,'','success')
      // this._ToastrService.success('File Uploaded successfully' )
    },error=>{
      console.log('error');
      console.log(error);
      this._ToastrService.error(error.error, )
      this.isClickedDocumnet=false
    })
  }
  isClicked3:boolean=false
  loading:boolean=false
  AllTransactions:any[]=[]
GetAllTransactions(){
  this.loading = true;
  const Model = ''; // خليه يفضل زي ما هو

  console.log('Model before sending: ', Model);

  this._CollectionService.GetAllTransactions(Model).subscribe(
    (res:any) => {
      console.log('this.AllTransactions', res);
      this.loading = false;
      this.AllTransactions = res.createTransactions;
    },
    (err) => {
      console.log(err);
      this.loading = false;
    }
  );
}
  ngOnInit(): void {
    this.GetAllTransactions()
    this._SharedService.changeData(false, '', '', true, false);

  }
}
