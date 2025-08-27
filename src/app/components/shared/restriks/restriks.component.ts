import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
declare var $:any;
@Component({
  selector: 'app-restriks',
  templateUrl: './restriks.component.html',
  styleUrls: ['./restriks.component.scss']
})
export class RestriksComponent implements OnInit{
  userId:any;
  permissions:any[]=[]
  finalArr:any[]=[]
  AllPermissions:any;
  loading:boolean = false;
  isClicked:boolean = false;
  constructor(private _ActivatedRoute:ActivatedRoute, private _AuthService:AuthService, private _SharedService:SharedService){
    this.userId = this._ActivatedRoute.snapshot.paramMap.get('id');
    console.log(this.userId);
  }
  
  form:FormGroup = new FormGroup({
    // User
    'Permissions.Users.Create':new FormControl(''),
    'Permissions.Users.Update':new FormControl(''),
    'Permissions.Users.View':new FormControl(''),
    'Permissions.Users.Delete':new FormControl(''),
    // Banks
    'Permissions.Banks.View':new FormControl(''),
    'Permissions.Banks.Create':new FormControl(''),
    'Permissions.Banks.Update':new FormControl(''),
    'Permissions.Banks.Delete':new FormControl(''),
    // Governorates
    'Permissions.Governorates.View':new FormControl(''),
    'Permissions.Governorates.Add':new FormControl(''),
    'Permissions.Governorates.Update':new FormControl(''),
    'Permissions.Governorates.Delete':new FormControl(''),
    // Branch
    'Permissions.Branches.View':new FormControl(''),
    'Permissions.Branches.Create':new FormControl(''),
    'Permissions.Branches.Update':new FormControl(''),
    'Permissions.Branches.Delete':new FormControl(''),
    // Departments
    'Permissions.Departments.View':new FormControl(''),
    'Permissions.Departments.Create':new FormControl(''),
    'Permissions.Departments.Update':new FormControl(''),
    'Permissions.Departments.Delete':new FormControl(''),
    // Customers
    'Permissions.Customers.View':new FormControl(''),
    'Permissions.Customers.Create':new FormControl(''),
    'Permissions.Customers.Update':new FormControl(''),
    'Permissions.Customers.Delete':new FormControl(''),
    // Offers
    'Permissions.Offers.View':new FormControl(''),
    'Permissions.Offers.Create':new FormControl(''),
    'Permissions.Offers.Update':new FormControl(''),
    'Permissions.Offers.ConvertOfferToPolicy':new FormControl(''),
    // Policies
    'Permissions.Policies.View':new FormControl(''),
    'Permissions.Policies.Update':new FormControl(''),
    'Permissions.Policies.Renewal':new FormControl(''),
    // Claims
    'Permissions.Claims.View':new FormControl(''),
    'Permissions.Claims.Create':new FormControl(''),
    'Permissions.Claims.Payment':new FormControl(''),
    // JournalEntry
    'Permissions.JournalEntry.Add':new FormControl(''),
    'Permissions.JournalEntry.Delete':new FormControl(''),
    // Portfolios
    'Permissions.Portfolios.View':new FormControl(''),
    'Permissions.Portfolios.Create':new FormControl(''),
    'Permissions.Portfolios.FinalApprove':new FormControl(''),
    'Permissions.Portfolios.Payment':new FormControl(''),
    'Permissions.Portfolios.Approve':new FormControl(''),
    // ExchangePermits
    'Permissions.ExchangePermits.View':new FormControl(''),
    // Reports ////////////
    'Permissions.Reports.Treasury':new FormControl(''),
    'Permissions.Reports.PaidAndCollector':new FormControl(''),
    'Permissions.Reports.UnderCollector':new FormControl(''),
    'Permissions.Reports.GetInsured':new FormControl(''),
    'Permissions.Reports.CurrentAgent':new FormControl(''),
    'Permissions.Reports.SecretariatRecord':new FormControl(''),
    'Permissions.Reports.CollectionDaily':new FormControl(''),
    'Permissions.Reports.SourceRecord':new FormControl(''),
    'Permissions.Reports.ClaimDetails':new FormControl(''),
    'Permissions.Reports.Polices':new FormControl(''),
    'Permissions.Reports.Offers':new FormControl(''),
    'Permissions.Reports.Customers':new FormControl(''),
    'Permissions.Reports.DueCommissions':new FormControl(''),
    'Permissions.Reports.paidCommissions':new FormControl(''),
    // 'Permissions.Reports.BrokerageModel':new FormControl(''),
    // Endorsements ////////////
    'Permissions.Endorsements.View':new FormControl(''),
    'Permissions.Endorsements.Create':new FormControl(''),
    // CustomerSecretaries ////////////
    'Permissions.CustomerSecretaries.Create':new FormControl(''),
    // BrokerageCommissions ////////////
    'Permissions.BrokerageCommissions.Add':new FormControl(''),
    'Permissions.BrokerageCommissions.View':new FormControl(''),
    'Permissions.BrokerageCommissions.Edit':new FormControl(''),
    'Permissions.BrokerageCommissions.Pay':new FormControl(''),
    // TpaCommissions ////////////
    // 'Permissions.TpaCommissions.Add':new FormControl(''),
    'Permissions.TpaCommissions.View':new FormControl(''),
    'Permissions.TpaCommissions.Edit':new FormControl(''),
    'Permissions.TpaCommissions.Pay':new FormControl(''),
  })
  // Save & Update Permissions
  SavePermissions(){
    this.isClicked = true;
    this.finalArr = []
    let Form =this.form.value
    for (const key of Object.keys(Form)){
      const value = Form[key];
      if(value==true){
        let M={
          name:key,
          isSelected:true
        }
        this.finalArr.push(M);
      }
    }
    console.log(this.finalArr);
    let Model = {
      'userId':this.userId,
      'permissions':this.finalArr
    }
    this._AuthService.ManagePermissions(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      this.GetPermissionsForUser(this.userId)
    },error=>{
      this.isClicked = false;
      console.log(error);
      
    })

  }

  toggleItem(item:any){
    $('#'+item).toggle(600)
  }
  // GetPermissionsForUser
  GetPermissionsForUser(userId:any){
    this.loading = true;
    this._AuthService.GetPermissionsForUser(userId).subscribe(data=>{
      this.loading = false;
      this.AllPermissions = data;
      console.log(data);
      this.form.patchValue(
        // Users
        {'Permissions.Users.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Users.Create'),
        'Permissions.Users.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Users.Update'),
        'Permissions.Users.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Users.View'),
        'Permissions.Users.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Users.Delete'),
        // Banks
        'Permissions.Banks.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Banks.Create'),
        'Permissions.Banks.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Banks.Update'),
        'Permissions.Banks.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Banks.View'),
        'Permissions.Banks.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Banks.Delete'),
        // Governorates
        'Permissions.Governorates.Add':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Governorates.Add'),
        'Permissions.Governorates.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Governorates.Update'),
        'Permissions.Governorates.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Governorates.View'),
        'Permissions.Governorates.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Governorates.Delete'),
        // Branches
        'Permissions.Branches.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Branches.Create'),
        'Permissions.Branches.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Branches.Update'),
        'Permissions.Branches.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Branches.View'),
        'Permissions.Branches.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Branches.Delete'),
        // Departments
        'Permissions.Departments.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Departments.Create'),
        'Permissions.Departments.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Departments.Update'),
        'Permissions.Departments.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Departments.View'),
        'Permissions.Departments.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Departments.Delete'),
        // Customers
        'Permissions.Customers.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Customers.Create'),
        'Permissions.Customers.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Customers.Update'),
        'Permissions.Customers.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Customers.View'),
        'Permissions.Customers.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Customers.Delete'),
        // Offers
        'Permissions.Offers.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Offers.Create'),
        'Permissions.Offers.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Offers.Update'),
        'Permissions.Offers.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Offers.View'),
        'Permissions.Offers.ConvertOfferToPolicy':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Offers.ConvertOfferToPolicy'),
        // Policies
        'Permissions.Policies.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Policies.Update'),
        'Permissions.Policies.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Policies.View'),
        'Permissions.Policies.Renewal':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Policies.Renewal'),
        // Claims
        'Permissions.Claims.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Claims.Create'),
        'Permissions.Claims.Update':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Claims.Update'),
        'Permissions.Claims.Payment':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Claims.Payment'),
        'Permissions.Claims.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Claims.View'),
        // JournalEntry
        'Permissions.JournalEntry.Add':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.JournalEntry.Add'),
        'Permissions.JournalEntry.Delete':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.JournalEntry.Delete'),
        // Portfolios
        'Permissions.Portfolios.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Portfolios.Create'),
        'Permissions.Portfolios.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Portfolios.View'),
        'Permissions.Portfolios.FinalApprove':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Portfolios.FinalApprove'),
        'Permissions.Portfolios.Payment':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Portfolios.Payment'),
        'Permissions.Portfolios.Approve':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Portfolios.Approve'),
        // ExchangePermits
        'Permissions.ExchangePermits.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.ExchangePermits.View'),
        // Reports
        'Permissions.Reports.Treasury':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.Treasury'),
        // 'Permissions.Reports.BrokerageModel':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.BrokerageModel'),
        'Permissions.Reports.PaidAndCollector':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.PaidAndCollector'),
        'Permissions.Reports.UnderCollector':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.UnderCollector'),
        'Permissions.Reports.GetInsured':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.GetInsured'),
        'Permissions.Reports.CurrentAgent':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.CurrentAgent'),
        'Permissions.Reports.SecretariatRecord':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.SecretariatRecord'),
        'Permissions.Reports.CollectionDaily':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.CollectionDaily'),
        'Permissions.Reports.SourceRecord':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.SourceRecord'),
        'Permissions.Reports.ClaimDetails':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.ClaimDetails'),
        'Permissions.Reports.Polices':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.Polices'),
        'Permissions.Reports.Offers':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.Offers'),
        'Permissions.Reports.Customers':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.Customers'),
        'Permissions.Reports.paidCommissions':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.paidCommissions'),
        'Permissions.Reports.DueCommissions':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Reports.DueCommissions'),
        // Endorsements
        'Permissions.Endorsements.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Endorsements.View'),
        'Permissions.Endorsements.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.Endorsements.Create'),
        // CustomerSecretaries
        'Permissions.CustomerSecretaries.Create':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.CustomerSecretaries.Create'),
        // BrokerageCommissions
        'Permissions.BrokerageCommissions.Add':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.BrokerageCommissions.Add'),
        'Permissions.BrokerageCommissions.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.BrokerageCommissions.View'),
        'Permissions.BrokerageCommissions.Edit':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.BrokerageCommissions.Edit'),
        'Permissions.BrokerageCommissions.Pay':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.BrokerageCommissions.Pay'),
        // TpaCommissions
        // 'Permissions.TpaCommissions.Add':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.TpaCommissions.Add'),
        'Permissions.TpaCommissions.View':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.TpaCommissions.View'),
        'Permissions.TpaCommissions.Edit':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.TpaCommissions.Edit'),
        'Permissions.TpaCommissions.Pay':this.AllPermissions.permissions.some((item:any)=> item['name'] === 'Permissions.TpaCommissions.Pay'),
        
      })
    },error=>{
      this.loading = false;
      console.log(error);
    })
  }
  ngOnInit(): void {
    this._SharedService.changeData(true, '','',false,false);

    this.GetPermissionsForUser(this.userId);
  }
  
}
