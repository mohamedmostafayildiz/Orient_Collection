import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $:any

@Component({
  selector: 'app-commission-permission',
  templateUrl: './commission-permission.component.html',
  styleUrls: ['./commission-permission.component.scss']
})
export class CommissionPermissionComponent {
  staticIndexes:any

  BrokerIdVal:any =''
  brokerCustomers:any
  TotalMony:number = 0
  isClicked:boolean = false;
  AllPolices:any=[
    {a:"1",b:"Ahmed",c:"Amr",d:"0",e:"6000",f:"6500",g:"400",h:"12-11-2023"},
    {a:"2",b:"Hany",c:"Ali",d:"0",e:"6200",f:"6500",g:"600",h:"13-11-2023"},
    {a:"3",b:"Ahman",c:"Mohamed",d:"0",e:"900",f:"900",g:"1500",h:"5-11-2024"},
    {a:"4",b:"Ramy",c:"Magdy",d:"0",e:"6000",f:"800",g:"300",h:"19-11-2023"}
  ]

  SearchForm:FormGroup = new FormGroup({
    'Code':new FormControl(''),
    'InsuredName':new FormControl(''),
    'BrokerId':new FormControl(''),
    'UnderWritingYear':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl('')
  })

  getCheckedValues(checked:any ,price:any,i:any){
    this.staticIndexes = i
    $("#PaymnetWays").show(500)
    if(checked==true){
      
      this.TotalMony += Number(price)
    }else{
      this.TotalMony -= Number(price)
    }
  }
      // Search
Search(){
  $("#SearchResults").show(500) //
}
SaveCommissionPermission(){
  $("#PrintButton").show(600)
  this.AllPolices.splice(this.staticIndexes , 1)
}
PrintCommissionPermission(){

}
}
