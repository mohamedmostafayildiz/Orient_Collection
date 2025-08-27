import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-model-portfolio',
  templateUrl: './model-portfolio.component.html',
  styleUrls: ['./model-portfolio.component.scss']
})
export class ModelPortfolioComponent implements OnInit{
  PortfolioId:any;
  collectionTypeId:any
  AllPortfolio:any;
  loading:boolean =false;
  CurrentDate = new Date();
  arrayOfValues:any;
  testItem:any;
  myArray:any;
  constructor(private _CollectionService:CollectionService, private _ActivatedRoute:ActivatedRoute){
    this._ActivatedRoute.params.subscribe((data:any)=>{
      this.PortfolioId=data.id
      this.collectionTypeId=data.collectionTypeId

    })
    console.log("this.PortfolioId",this.PortfolioId);
    console.log("this.collectionTypeId",this.collectionTypeId);
    
    // this.PortfolioId = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.myArray = this._ActivatedRoute.snapshot.queryParamMap.get('myArray');
    if(this.PortfolioId==null || this.PortfolioId==undefined){
      this.arrayOfValues = JSON.parse(this.myArray);
      this.AllPortfolio= this.arrayOfValues.portfolioTemplate;
      this.setData();
    }else{
    this.getPortfolioTemplate()
    }
    console.log("this.AllPortfolio",this.AllPortfolio);
  }

      /////////////=> Get Portfolio Template <=/////////////////
    AllMony:number = 0;
    CheckTable:any[]=[];
    bankTransferTable:any[]=[];
    bankDepositPaymentTable:any[]=[];
    // secretariatTable:any[]=[];
    postdatedCheckTable:any[]=[];
    VisaTable:any[]=[];
    CashTable:any[]=[];
  getPortfolioTemplate(){
    this.loading = true;
    this._CollectionService.getPortfolioTemplate(this.PortfolioId,this.collectionTypeId).subscribe((data:any)=>{
      this.loading = false;
       this.AllPortfolio = data;
       console.log(data);
       this.setData();
    },error=>{
      console.log(error);
      this.loading = false;
  })
  
  }
  mappedDtos:any[]=[]
  setData(){
    this.CurrentDate = new Date(this.AllPortfolio?.createdAt)
     
    for(let i=0;i<this.AllPortfolio?.portfolioTemplates.length;i++){
      this.AllMony += this.AllPortfolio?.portfolioTemplates[i].credit;
    }
    this.CheckTable = this.AllPortfolio?.paymentWays?.checkPayment;
    for(let i=0;i<this.CheckTable.length;i++){
      Object.assign(this.CheckTable[i],{type:'Check'})
    }
    this.bankTransferTable = this.AllPortfolio?.paymentWays?.bankTransferPayment;
    for(let i=0;i<this.bankTransferTable.length;i++){
      Object.assign(this.bankTransferTable[i],{type:'Bank Transfer '})
    }
    // this.secretariatTable = this.AllPortfolio?.paymentWays?.secretariat;
    // for(let i=0;i<this.secretariatTable.length;i++){
    //   Object.assign(this.secretariatTable[i],{type:'أمــانه'})
    // }
    this.VisaTable = this.AllPortfolio?.paymentWays?.visaPayments;
    for(let i=0;i<this.VisaTable.length;i++){
      Object.assign(this.VisaTable[i],{type:'Visa'})
    }
    this.CashTable = this.AllPortfolio?.paymentWays?.cashPayments;
    for(let i=0;i<this.CashTable.length;i++){
      Object.assign(this.CashTable[i],{type:'Cash'})
    }
    this.bankDepositPaymentTable = this.AllPortfolio?.paymentWays?.bankDepositPayments;
    for(let i=0;i<this.bankDepositPaymentTable.length;i++){
      Object.assign(this.bankDepositPaymentTable[i],{type:'Bank Deposit'})
    }
    this.postdatedCheckTable = this.AllPortfolio?.paymentWays?.postdatedCheckPayments;
    for(let i=0;i<this.postdatedCheckTable.length;i++){
      Object.assign(this.postdatedCheckTable[i],{type:'Postdated Check'})
    }
    this.mappedDtos = this.AllPortfolio?.paymentWays?.transactionWayDtos.map((dto: { paidAmount: any; }) => ({
    ...dto,
    amount: dto.paidAmount,
    }));
  }
  ngOnInit(){
  }
}
