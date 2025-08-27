import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from 'src/app/services/collection.service';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-model-daily-collection',
  templateUrl: './model-daily-collection.component.html',
  styleUrls: ['./model-daily-collection.component.scss'],
  providers:[DatePipe]
})
export class ModelDailyCollectionComponent {
  AllData:any
  AllCollectionJournalForms:any
  loading:boolean = false;
  constructor(private _ReportsService:ReportsService ,public _DatePipe:DatePipe){}
  Form:FormGroup = new FormGroup({
    start:new FormControl('',[Validators.required]),
    end:new FormControl('',[Validators.required])
  })
  
  SubmitForm(){
    this.loading = true
    let Model={
      start:this._DatePipe.transform(this.Form.get('start')?.value,'YYYY/MM/dd'),
      end:this._DatePipe.transform(this.Form.get('end')?.value,'YYYY/MM/dd')
    }
    this._ReportsService.CollectionJournalForm(Model).subscribe((data:any)=>{
      this.loading = false;
      console.log(data);
      this.AllData= data;
      this.AllCollectionJournalForms=data.collectionJournalForms;
      // console.log(this.AllCollectionJournalForms);
      
    },error=>{
      this.loading = false;
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      });
    })
    
  }
}
