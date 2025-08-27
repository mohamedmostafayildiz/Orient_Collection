import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-all-plans',
  templateUrl: './all-plans.component.html',
  styleUrls: ['./all-plans.component.scss']
})
export class AllPlansComponent implements OnInit{

  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;
  AllPlans:any;
  loading:boolean=false;
  CustomerTpaId:any;
  constructor(private _AdminService:AdminService, private _ActivatedRoute:ActivatedRoute){
    this.CustomerTpaId = this._ActivatedRoute.snapshot.paramMap.get('id')
    console.log(this.CustomerTpaId);
    
  }
  

  getAllTpaPalns(){
    this._AdminService.getTpaPlans().subscribe(data=>{
      this.AllPlans = data;
      console.log(data);
    })
  }
  getPlansOfCustomerTpaById(){
    this._AdminService.getPlansOfCustomerTpaById(this.CustomerTpaId).subscribe(data=>{
      this.AllPlans = data;
      console.log(data);
      
    })
  }

              //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllTpaPalns();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllTpaPalns();
  }

  ngOnInit(): void {
    if(this.CustomerTpaId==null){
      this.getAllTpaPalns();
    }else{
      this.getPlansOfCustomerTpaById();
    }
  }
}
