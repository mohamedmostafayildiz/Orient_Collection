import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-all-early-collect',
  templateUrl: './all-early-collect.component.html',
  styleUrls: ['./all-early-collect.component.scss']
})
export class AllEarlyCollectComponent implements OnInit{
  constructor(private _AdminService:AdminService){}
  
  loading:boolean=false;
  allEarlyCollect:any

  getEarlyCollect(){
    this.loading=true
    this._AdminService.getEarlyCollect().subscribe(data=>{
      this.allEarlyCollect=data
      console.log(data);
      this.loading=false
    })
  }


  ngOnInit(): void {
    this.getEarlyCollect();
  }
}
