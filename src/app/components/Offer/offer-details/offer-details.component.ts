import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { FilesService } from 'src/app/services/files.service';
import { PolicyService } from 'src/app/services/policy.service';
import { SharedService } from 'src/app/services/shared.service';
declare var $ :any
@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent {
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[20,8,10,15,5];

  loading:boolean= false
  OfferDetails:any;
  OfferGroup:any=[]
  OfferPlans:any=[]
  offerId:any
  
  constructor(private _PolicyService:PolicyService,
                  private _ActivatedRoute:ActivatedRoute,
                  private _FilesService:FilesService,
                  private _AdminService:AdminService,
                private _SharedService:SharedService){
    this.offerId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }

  AllRisk:any[]=[]
  getRiskInfo(Risk:any){
    $(".overlay").fadeIn(300)
    $(".delet").animate({right: '0px'});
    this.AllRisk = Risk
  }
  closeShowRisk(){
    $(".overlay").fadeOut(300)
    $(".delet").animate({right: '-30%'});
  }
  // Offer Details
  getOfferDetails(){
    this.loading = true
    this._PolicyService.getOfferById(this.offerId).subscribe((data:any)=>{
      this.loading = false
      this.OfferDetails = data;
      this.OfferGroup =data.customerGroups
      this.OfferPlans =data.plans
      console.log(data);
    },error=>{
      this.loading = false;
    })
  }


  FileName:any
  isClickedGetFile:boolean=false
  getPlansFile(){
    this.isClickedGetFile=true
    this._FilesService.DownloadPlanFile(this.offerId).subscribe(res=>{
      this.isClickedGetFile=false
      this.FileName= res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let a= document.createElement('a');
      a.setAttribute('href',String(res.url))
      a.click()
    },error=>{
      this.isClickedGetFile=false
      console.log(error);
    })
  }
//Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getOfferDetails();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getOfferDetails();
  }
  AllRisks:any
  GetAllRisks(){
    this._AdminService.GetAllRisks().subscribe((data:any)=>{
      this.AllRisks = data;
      // console.log(data);
    },error=>{
      console.log(error)
    })
  }
  getRiskNameById(id: string): string {
    const risk = this.AllRisks.find((risk: { id: string; }) => risk.id === id);
    // console.log(risk);
    
    return risk ? risk.englishName : 'Unknown Risk';
  }
  ngOnInit(): void {
    this._SharedService.changeData(true,'','',false,false);
    this.getOfferDetails();
    this.GetAllRisks();
  }


}
