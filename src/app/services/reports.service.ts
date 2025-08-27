import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  token:any = localStorage.getItem("MedicalToken");
  httpOptions:any = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
  };
  baseUrl:any
  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
  }
   // Paied And Collector Premium
  Insured(data:any){
    let params = new HttpParams();
    params = params.append('From',data?.From).append('To',data?.To).append('PolicyCode',data?.PolicyCode).append('ClientName',data?.ClientName)
    return this._HttpClient.get(this.baseUrl+'Report/Insured',{observe:'response',params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }




   // Paied And Collector Premium
   PaiedAndCollectorPremium(data:any){
    let params = new HttpParams();
    params = params.append('From',data?.From).append('To',data?.To).append('PolicyCode',data?.PolicyCode).append('ClientName',data?.ClientName)
    return this._HttpClient.get(this.baseUrl+'Report/PaiedAndCollectorPremium',{observe:'response',params,
    responseType: 'blob' as 'json',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }





  
   // Under Collector Premium Report 
   UnderCollectorPremium(data:any){
    let params = new HttpParams();
    params = params.append('To',data?.To).append('From',data?.From).append('PolicyCode',data?.PolicyCode)
    .append('ClientName',data?.ClientName).append('brokerId',data?.brokerId)
    return this._HttpClient.get(this.baseUrl+'Report/UnderCollectorPremium',{params,observe:'response',
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
   // DueCommissionForUnderCollector Report 
   DueCommissionForUnderCollector(data:any){
    let params = new HttpParams();
    params = params.append('To',data?.To).append('From',data?.From).append('PolicyCode',data?.PolicyCode).append('ClientName',data?.ClientName)
      .append('BrokerId',data?.BrokerId)
    return this._HttpClient.get(this.baseUrl+'Report/DueCommissionForUnderCollector',{params,observe:'response',
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
   // PaidCommissions Report 
   PaidCommissions(data:any){
    let params = new HttpParams();
    params = params.append('To',data?.To).append('From',data?.From).append('PolicyCode',data?.PolicyCode).append('ClientName',data?.ClientName)
      .append('BrokerId',data?.BrokerId)
    return this._HttpClient.get(this.baseUrl+'Report/PaidCommissions',{params,observe:'response',
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

  // Treasury Report 
  TreasuryReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/TreasuryReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

  // Secretariats Records
  SecretariatsRecordsReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/SecretariatsRecords',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

  // NegativeBrokerages Report 
  CurrentBrokeragesReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/CurrentAgentAccount',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  // Source Record Report
  SourceRecordReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/SourceRecord',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  // 
  MedicalPublicationsStatisticsReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/MedicalPublicationsStatisticsReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  DisplayMedicalPublicationsStatistics(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end);
    return this._HttpClient.get(this.baseUrl+'Report/DisplayMedicalPublicationsStatistics',{
    params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  // Display Claim Details Report
  DisplayClaimDetailsReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end);
    return this._HttpClient.get(this.baseUrl+'Report/DisplayClaimDetailsReport',{
    params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  ClaimDetailsReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/ClaimDetailsReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  ////// Offer Reports ///////

  DisplayOfferReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end);
    return this._HttpClient.get(this.baseUrl+'Report/DisplayOfferReport',{
    params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  OffersReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/OffersReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  ////// Customers Reports ///////

  DisplayCustomersReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end);
    return this._HttpClient.get(this.baseUrl+'Report/DisplayCustomersReport',{
    params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  downloadCustomersReport(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/CustomersReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

  // 
  CollectionJournalForm(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Collections/CollectionJournalForm',{params,headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }
  // get ExchangePermit Template
  getExchangePermitTemplate(id:any){
    
    return this._HttpClient.get(this.baseUrl+'ExchangePermits/ExchangePermitTemplate?exchangePermitId='+id,{headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

    // Get Policy Scheduling Report
  getPolicyScheduling(policyCode:any){
      return this._HttpClient.get(this.baseUrl+'Report/policyScheduling?policyCode='+policyCode,{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")})
  }

    // Get List Of Names Report
  getListOfNamesReport(policyCode:any){
      return this._HttpClient.get(this.baseUrl+'Report/ListOfNames?policyCode='+policyCode,{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")})
  }
    // Get InstallmentCalculation Report
  getInstallmentCalculationReport(policyCode:any){
      return this._HttpClient.get(this.baseUrl+'Report/InstallmentCalculation?policyCode='+policyCode,{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")})
  }
    // Under Collection
  UnderCollection(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/UnderCollection',{params,headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true"),observe:'response',responseType: 'blob'})
  }
    // Due Commission
  DueCommission(data:any){
    let params = new HttpParams();
    params = params.append('start',data?.start).append('end',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/DueCommission',{params,headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true"),observe:'response',responseType: 'blob'})
  }

   // Finance Claims Report
   FinanceClaimsReport(data:any){
    let params = new HttpParams();
    params = params.append('from',data?.start).append('to',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/FinanceClaims',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

   // Finance Commission Report
   FinanceCommissionReport(data:any){
    let params = new HttpParams();
    params = params.append('from',data?.start).append('to',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/FinanceCommission',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

   // Create Excel ForTpa Commission Report
   CreateExcelForTpaCommission(data:any){
    let params = new HttpParams();
    params = params.append('from',data?.start).append('to',data?.end)
    return this._HttpClient.get(this.baseUrl+'Report/CreateExcelForTpaCommission',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

  // outstanding Report
  outstandingReport(data:any){
    let params = new HttpParams();
    params = params.append('treatyName',data?.name).append('period',data?.period)
    return this._HttpClient.get(this.baseUrl+'Report/OutStandingReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

       // Paid Claim
       PaidClaim(data:any){
        let params = new HttpParams();
        params = params.append('start',data?.start).append('end',data?.end)
        return this._HttpClient.get(this.baseUrl+'Report/paidClaim',{params,headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true"),observe:'response',responseType: 'blob'})
      }
    
          // Unpaid Claim
      UnpaidClaim(data:any){
        let params = new HttpParams();
        params = params.append('start',data?.start).append('end',data?.end)
        return this._HttpClient.get(this.baseUrl+'Report/UnpaidClaim',{params,headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true"),observe:'response',responseType: 'blob'})
      }
}
