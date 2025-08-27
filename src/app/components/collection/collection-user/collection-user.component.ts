import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
declare var $:any
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-collection-user',
  templateUrl: './collection-user.component.html',
  styleUrls: ['./collection-user.component.scss'],
  providers:[DatePipe]
})
export class CollectionUserComponent implements OnInit{

  isClicked:boolean= false;
  brokerCustomers:any;
  TestArr:any[]=[];
  loading:boolean =false;
  BrokerIdVal:any ='';
  TotalMony:number = 0;
  AllCollections:any[]=[];
  subCompanyArr:any[]=[
    {id:1,name:'Yildiz'},
    {id:1,name:'Alkan'},
    {id:1,name:'Medical'},
    {id:1,name:'orient'},
  ]
  selectedCollectionIds: Set<number> = new Set<number>();
  constructor(private _ToastrService:ToastrService, private _Router:Router,
     private _AdminService:AdminService,private _CollectionService:CollectionService,private _DatePipe:DatePipe,private _SharedService: SharedService){}
 
    SearchForm:FormGroup = new FormGroup({
      'Code':new FormControl(''),
      'Insured':new FormControl(''),
      'From':new FormControl(''),
      'To':new FormControl(''),
      'productId':new FormControl(''),
      'BrokerId':new FormControl(''),
      'rateStatus':new FormControl(1)
    })
    getAllSubCompanies(){
      this._CollectionService.GetAllSubCompanies().subscribe((data:any)=>{
        console.log(data);
        this.subCompanyArr = data
      }, error =>{
        console.log(error);
        
      })
    }
    AllProducts:any[]=[]
    getAllProducts(){
      this._CollectionService.GetAllProducts().subscribe((data:any)=>{
        console.log("AllProducts",data);
        this.AllProducts = data
      }, error =>{
        console.log(error);
        
      })
    }

      // Search
      Currencyies:any[]=[]
      AllInsureds:any[]=[]
   currencyNotRart: string = '';  
   Search(){
    this.loading = true;
    console.log(this.SearchForm.value);
    let Model =Object.assign(this.SearchForm.value,
      // {rateStatus:this.SearchForm.get('rateStatus')?.value==''?null:this.SearchForm.get('rateStatus')?.value},
      // {BrokerId:this.BrokerIdVal},
      {From:this.SearchForm.get('From')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd")},
      {To:this.SearchForm.get('To')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")}

      )
    console.log(Model);
    this._CollectionService.GetAllCollections(Model).subscribe((data:any)=>{
      console.log(data);
      this.loading = false;
      this.AllCollections = data.collections;
      this.AllCollections = data.collections.map((item: any) => ({
        ...item,
        DisabeledpayIcon:false,
        isCheckBoxCheck:false,
        isChecked: item.currencyOfPolicy == 'EGP',
        amountOfPremium:item.foreignPremium
      }));
      console.log("AllCollections",this.AllCollections);
       this.AllCollections = this.AllCollections.map((item: any) => {
        // لو عندي قيمة amountOfPremium في ArrTest بنفس collectionId أحطها
        const saved = this.ArrTest.find(a => a.collectionId == item.collectionId);
        console.log("saved",saved);
        return {
          ...item,
          amountOfPremium: saved ? saved.amountOfPremium : item.foreignPremium,
          remainder: saved ? saved.reminder : item.remainder,
          isCheckBoxCheck:saved ? saved.isCheckBoxCheck : item.isCheckBoxCheck,
          isChecked:saved ? saved.isChecked : item.isChecked
        };
      });
      console.log("AllCollections2",this.AllCollections);

      this.Currencyies=data.currencyNotRates
     this.currencyNotRart = data.currencyNotRates?.join(', ');
     console.log("this.currencyNotRart",this.currencyNotRart);

      if(!this.AllInsureds || this.AllInsureds.length ==0){
      this.AllInsureds = Object.values(
            data.collections.reduce((acc: { [x: string]: { insured: any; insuredId: any; }; }, { insured, insuredId }: any) => {
              acc[insuredId] = { insured, insuredId }; // use insuredId as unique key
              return acc;
            }, {} as Record<string, { insured: string; insuredId: string }>)
          );
      }
    

    console.log("AllInsureds",this.AllInsureds);
     
    },error=>{
      console.log(error);
      this.loading = false;
    })
  }
  // add policyObject in checkIfAxceeded in two ts , html
  handleCheckboxClick(Policy: any) {
  if (!Policy.hasRate) {
    this._ToastrService.warning('This checkbox is disabled because the policy has no rate.');
  }
  
}
  Policy:any
  mainRemainderValue:number=0
  checkIfAxceeded(e:any, IndexIdDate:any,LaterDate:any,checkBtn:any,foreignpremuim:any,localPremuim:any,exchangerate:any,isChecked:any){ 
    console.log(localPremuim);
    console.log(exchangerate);
    console.log("e.max",e.max);
    console.log("e.value",e.value);
    
    
 
    LaterDate as HTMLInputElement
        // console.log((e.max-e.value)/exchangerate);
    if(isChecked==true){
      this.AllCollections[IndexIdDate].remainder =(localPremuim-e.value)
      this.mainRemainderValue=this.AllCollections[IndexIdDate].remainder/exchangerate
    }else{
      this.AllCollections[IndexIdDate].remainder =(foreignpremuim-e.value)
      this.mainRemainderValue=this.AllCollections[IndexIdDate].remainder
    }
    
    // this.AllCollections[IndexIdDate].remainder =(e.max-e.value)/exchangerate
    // this.mainRemainderValue=this.AllCollections[IndexIdDate].remainder
    // this.AllCollections[IndexIdDate].remainder =localPremuim/exchangerate
    if(Number(e.value)<Number(e.max)){
      $('#Remain'+IndexIdDate).show(500)
      checkBtn.disabled=true;
    }else if(Number(e.value)>=Number(e.max)){
      $('#Remain'+IndexIdDate).hide(500)
      LaterDate.value =''
      this._ToastrService.show("You can not pay more than Installment Due")
      e.value =e.max
      checkBtn.disabled=false;
      this.AllCollections[IndexIdDate].remainder =0
          this.mainRemainderValue=this.AllCollections[IndexIdDate].remainder

    }
  }
  ArrTest:any[]=[]
  allTrue:any
  allFalse:any
  TotalPremium:number=0
  DisabeledpayIcon:boolean=false
  IsOriginal:boolean=false
  /////// Checked Values  ////
  getCheckedValues(event:any,Policy:any,id:any,checked:any, Money:any, LaterDate:any,policyId:any,collectionType:any,ForeignPremium:any,LocalPremium:any,ExchangeRate:any,InsuredId:any,brokerId:any,isChecked:any,currency:any){
    console.log("checked",checked);
    console.log("EX",ExchangeRate);
    console.log("isChecked",isChecked);
    let checkboxElement = event.source; 
    $("#UploadFile").show(500)
    let Exisit = this.ArrTest.find(item=>id==item.collectionId)
    if(isChecked==true){
      this.TotalPremium = LocalPremium
    }else{
      this.TotalPremium = ForeignPremium
    }

    if(currency=='EGP' && isChecked==true  || currency!='EGP' && isChecked==false ){
      this.IsOriginal=true
    }else{
      this.IsOriginal=true
    }
    
// settlementNumber
// 
    let Model ={
      collectionId:id,
      isCheckBoxCheck:checked,
      amountOfPremium:Money.value != null ? Money.value : null,
      totalPremium:this.TotalPremium,
      reminder:this.mainRemainderValue,
      exachangeRate: ExchangeRate,
      policyId:policyId,
      date: LaterDate?.value == '' ? null : LaterDate?.value,      
      collectionType:collectionType,
      insuredId:InsuredId,
      BrokerId:brokerId !=  "" ? brokerId : null,
      IsPayByEGP:isChecked,
      isPayed:isChecked,
      SettlmentNumber:Policy.settlementNumber,
      totalTaxAmount:Policy.totalTaxAmount,
      // insuredId:Policy.insuredId,
      insured:Policy.insured,
      isOriginal:this.IsOriginal,
      isChecked:isChecked,
      Currency:currency,
      currencyOfPolicy:currency,
      localPremium:LocalPremium,
      foreignPremium:ForeignPremium,
    }

    if(checked==true){
      // let object = this.ArrTest.find(item => item.IsChecked === false || item.IsChecked === true);
      if (this.ArrTest.length > 0) {
        // العملة الأولى الموجودة
          const firstCurrency = this.ArrTest[0].Currency;

        // لو العملة الجديدة مختلفة عن العملة الأولى
        if (currency !== firstCurrency && isChecked === false) {
          this._ToastrService.warning("Adding items with different currencies is not allowed", "Warning");
          checkboxElement.checked = false;
          return; // إيقاف الإضافة
        }

         this.allTrue = this.ArrTest.every(item => item.IsPayByEGP === true);
         this.allFalse = this.ArrTest.every(item => item.IsPayByEGP === false);

        if ((this.allTrue && isChecked === false) || (this.allFalse && isChecked === true)) {
          this._ToastrService.warning("Adding items with different currencies is not allowed", "Warning");
          checkboxElement.checked = false;
          return; // إيقاف الإضافة
        }
      }
      Money.disabled = true
      LaterDate.disabled = true
      if(Exisit==undefined){
        this.ArrTest.push(Model)
        this.TotalMony += Number(Money.value)
        Policy.DisabeledpayIcon=true
      }else{
        let Index = this.ArrTest.indexOf(Exisit)
        this.ArrTest.splice(Index)
        this.ArrTest.push(Model)
      }
    }else{
      this.TotalMony -= Number(Money.value)
      Money.disabled = false
      LaterDate.disabled = false
      let item = this.ArrTest.find(item=>id==item.collectionId)
      let Index = this.ArrTest.indexOf(item)
      this.ArrTest.splice(Index, 1)
      Policy.DisabeledpayIcon=false


        // ✅ رجّع القيمة الأصلية
      Policy.amountOfPremium = Policy.foreignPremium;
      Policy.remainder=0
      // ✅ فضي التاريخ و اخفيه
      LaterDate.value = '';

      document.getElementById('Remain' + Index)?.setAttribute('style','display:none');
      Policy.isCheckBoxCheck = false;
    }
    console.log(this.ArrTest);
    if(this.ArrTest.length>0){
      $("#alertTotalSave").show(500)
    }else{
      $("#alertTotalSave").hide(500)
    }
  }
  getLaterDate(checkBtn:any){
    checkBtn.disabled=false;
  }
  isCollectionSelected(collectionId: number): boolean {
  // لو عندك array تاني مثلاً selectedCollections أو ArrTest
  return this.ArrTest?.some(item => item.collectionId === collectionId);
}
  /////////////////// Add Portfolio ///////////
  AddPortfolio(){
    this.isClicked = true;
    let Model ={
      convertCollections:this.ArrTest
    }
    console.log(Model);
    this._SharedService.setSelectedData(this.ArrTest);
    this._SharedService.setTotal(this.TotalMony);
    this._Router.navigate(['/CollectionPayment']);
  }
  selectedFile:any = ''
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllBrokers().subscribe(data=>{
      console.log("brokerCustomers",data);
      this.brokerCustomers= data
    })
  }
toggleEGP(policy: any, inputRef: HTMLInputElement) {
  policy.remainder=0
   this.mainRemainderValue==0
  policy.isChecked = !policy.isChecked;

  if (policy.isChecked) {
    inputRef.value = policy.localPremium; // نحطها في الـ input
  } else {
    inputRef.value = policy.foreignPremium; // نحطه في الـ input
    policy.remainder=0
    this.mainRemainderValue==0

  }
}


onExcelFileSelected(event: any) {
  const target: DataTransfer = <DataTransfer>(event.target);

  if (target.files.length !== 1) {
    this._ToastrService.error('Please upload a single file.');
    return;
  }

  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    const bstr: string = e.target.result;

    // قراءة الاكسل
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    // نحول الشيت لصفوف Objects
    const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

    // نجيب كل POLICY_NO
    const policyNumbersFromFile = new Set(
      data.map((row: any) => row.POLICY_NO?.toString().trim())
    );

    console.log("policyNumbersFromFile:", policyNumbersFromFile);

    // reset selected ids
    this.selectedCollectionIds = new Set<number>();

    // loop على AllCollections
   this.AllCollections.forEach((collection: any) => {
  if (
    policyNumbersFromFile.has(collection.code) && 
    collection.isFirstCollection === true
  ) {
    // هنا يضيف الـ id بتاع الـ collection أو الـ object نفسه
    this.selectedCollectionIds.add(collection.collectionId); 
    this.ArrTest.push(collection);


    console.log("ArrTest before:", this.ArrTest);

this.ArrTest = this.ArrTest.map((policy: any) => {
  // تحدد قيمة الـ TotalPremium
  let TotalPremium = policy.isChecked ? policy.localPremium : policy.foreignPremium;

  // تحدد قيمة الـ amountOfPremium
  let amountOfPremium = policy.isChecked ? policy.localPremium : policy.foreignPremium

  return {
    collectionId: policy.collectionId,
    isCheckBoxCheck:true,
    amountOfPremium: amountOfPremium,
    totalPremium: TotalPremium,
    reminder: this.mainRemainderValue,
    exachangeRate: policy.exchangeRate,
    policyId: policy.policyId,
    date: policy.paymentDate ? policy.paymentDate : null,      
    collectionType: policy.collectionType,
    insuredId: policy.insuredId,
    insured:policy.insured,
    BrokerId: policy.brokerId !== "" ? policy.brokerId : null,
    IsPayByEGP: policy.isChecked,
    isPayed: policy.isChecked,
    SettlmentNumber: policy.settlementNumber,
    totalTaxAmount: policy.totalTaxAmount,
    isOriginal: this.IsOriginal,
    isChecked: policy.isChecked,
    Currency: policy.currencyOfPolicy,
    currencyOfPolicy: policy.currencyOfPolicy,
    localPremium: policy.localPremium,
    foreignPremium: policy.foreignPremium
  };
});

console.log("ArrTest after mapping:", this.ArrTest);

   

  }
});
        console.log("selectedCollectionIds:", this.selectedCollectionIds);


    // اجمع التوتال
    // this.TotalMony = this.AllCollections
    //   .filter((item: any) => this.selectedCollectionIds.has(item.collectionId))
    //   .reduce((sum, item) => sum + Number(item.localPremium || 0), 0);
    this.TotalMony = this.ArrTest.reduce((sum, item) => {
      if (item.currencyOfPolicy === "EGP" && item.isChecked==true) {
        console.log("1");
        // البوليصة بالعملة المحلية
        return sum + Number(item.localPremium || 0);
      } 
      else if (item.currencyOfPolicy == "EGP" && item.isChecked==false) {
        console.log("2");

        // البوليصة بعملة أجنبية
        return sum + Number(item.foreignPremium || 0);
      } 
      else if (item.currencyOfPolicy !== "EGP" && item.isChecked==false) {
        console.log("2");

        // البوليصة بعملة أجنبية
        return sum + Number(item.foreignPremium || 0);
      } 
      else if (item.currencyOfPolicy !== "EGP" && item.isChecked==true) {
        console.log("2");

        // البوليصة بعملة أجنبية
        return sum + Number(item.localPremium || 0);
      } 
      
    }, 0);
    console.log("this.TotalMony", this.TotalMony);
    $('#alertTotalSave').show(500);
    this._ToastrService.success('File processed successfully');
  };
  console.log("this.TotalMony", this.TotalMony);
  

  reader.readAsBinaryString(target.files[0]);
}




tomorrow:any
  ngOnInit(){
    this.Search();
      this._SharedService.changeData(false,'','',true,false);
      this._SharedService.currentMessage.subscribe(message => {
        if(message){
          $("#filters").show(300)
        }else{
          $("#filters").hide(300)
        }
      });

      this._SharedService.selectedData$.subscribe(data => {
        if (data && data.length > 0) {
          this.ArrTest = data;
          console.log("this.ArrTest:",this.ArrTest);

        }else{
          this.selectedCollectionIds.clear();
        }
          this.TotalMony = this.ArrTest.reduce((sum, item) => sum + Number(item.amountOfPremium), 0);
      });
      if(this.ArrTest.length>0){
        $('#alertTotalSave').show(500)

      }else if(this.ArrTest.length==0){
        this.selectedCollectionIds.clear();
      }
      this.TotalMony = this.ArrTest.reduce((sum, item) => {
        if (item.currencyOfPolicy === "EGP" && item.isChecked==true) {
          console.log("1");
          // البوليصة بالعملة المحلية
          return sum + Number(item.amountOfPremium || item.localPremium);
        } 
        else if (item.currencyOfPolicy == "EGP" && item.isChecked==false) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium ||  item.localPremium);
        } 
        else if (item.currencyOfPolicy !== "EGP" && item.isChecked==false) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium ||  item.foreignPremium);
        } 
        else if (item.currencyOfPolicy !== "EGP" && item.isChecked==true) {
          console.log("2");

          // البوليصة بعملة أجنبية
          return sum + Number(item.amountOfPremium || item.localPremium);
        } 
        
      }, 0);
      
      console.log("this.TotalMony", this.TotalMony);
      this.getBrokerCustomers();
      this.getAllProducts();
        const now = new Date();
       now.setDate(now.getDate() + 1); // إضافة يوم عشان يبقى بكرة
      this.tomorrow = now.toISOString().split('T')[0]; // YYYY-MM-DD

  }
}
