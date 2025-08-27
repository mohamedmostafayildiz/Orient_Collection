import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-model-brokerage',
  templateUrl: './model-brokerage.component.html',
  styleUrls: ['./model-brokerage.component.scss']
})
export class ModelBrokerageComponent implements OnInit{
  exchangePermitId:any;
  AllBrokerage:any;
  ExchangePermitTemplateDetails:any;
  CheckTable:any[]=[];
  bankTransferTable:any[]=[];
  bankDepositPaymentTable:any[]=[];
  secretariatTable:any[]=[];
  postdatedCheckTable:any[]=[];
  VisaTable:any[]=[];
  CashTable:any[]=[];
  constructor(private _ActivatedRoute:ActivatedRoute, private _ReportsService:ReportsService){
    this.exchangePermitId = this._ActivatedRoute.snapshot.paramMap.get('id')
    console.log(this.exchangePermitId);
    
  }

  getExchangePermitTemplate(id:any){
    this._ReportsService.getExchangePermitTemplate(id).subscribe((data:any)=>{
      console.log(data);
      this.AllBrokerage = data;
      this.setData();
      this.ExchangePermitTemplateDetails = data.exchangePermitTemplateDetails;
    })
  }
mappedDtos:any[]=[]
  setData(){
    this.CheckTable = this.AllBrokerage?.paymentWays?.checkPayment;
    for(let i=0;i<this.CheckTable.length;i++){
      Object.assign(this.CheckTable[i],{type:'شـيـك'})
    }
    this.bankTransferTable = this.AllBrokerage?.paymentWays?.bankTransferPayment;
    for(let i=0;i<this.bankTransferTable.length;i++){
      Object.assign(this.bankTransferTable[i],{type:'تحويـل '})
    }
    this.secretariatTable = this.AllBrokerage?.paymentWays?.useSecretariat;
    for(let i=0;i<this.secretariatTable?.length;i++){
      Object.assign(this.secretariatTable[i],{type:'تسويه امانه'})
    }
    this.VisaTable = this.AllBrokerage?.paymentWays?.visaPayments;
    for(let i=0;i<this.VisaTable?.length;i++){
      Object.assign(this.VisaTable[i],{type:'بطاقه'})
    }
    this.CashTable = this.AllBrokerage?.paymentWays?.cashPayments;
    for(let i=0;i<this.CashTable?.length;i++){
      Object.assign(this.CashTable[i],{type:'نقـدي'})
    }
    this.bankDepositPaymentTable = this.AllBrokerage?.paymentWays?.bankDepositPayments;
    for(let i=0;i<this.bankDepositPaymentTable?.length;i++){
      Object.assign(this.bankDepositPaymentTable[i],{type:'ايداع بنكي'})
    }
    this.postdatedCheckTable = this.AllBrokerage?.paymentWays?.postdatedCheckPayments;
    for(let i=0;i<this.postdatedCheckTable?.length;i++){
      Object.assign(this.postdatedCheckTable[i],{type:'شيكات اجله'})
    }
      this.mappedDtos = this.AllBrokerage?.paymentWays?.transactionWayDtos.map((dto: { paidAmount: any; }) => ({
    ...dto,
    amount: dto.paidAmount,
    }));
  }
  ngOnInit(){
    this.getExchangePermitTemplate(this.exchangePermitId)
  }
}
