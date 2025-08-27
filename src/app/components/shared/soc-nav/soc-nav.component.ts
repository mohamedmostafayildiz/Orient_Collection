import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-soc-nav',
  templateUrl: './soc-nav.component.html',
  styleUrls: ['./soc-nav.component.scss']
})
export class SocNavComponent {
  ActiveList: any
  SelectedParamter: any
  addButton: any
  opened: boolean = false
  act_Nav: any
  @Input() activeTap!: any;
  // @Output() toggle = new EventEmitter()
  Lists: any[] = [
    {
      tab: 'Dashboard', keys: [
        { page: 'Dashboard', router: 'Dashboard', permission: '' },
        // {page:'Reports',router:'Reports', permission:''},
      ]
    },
    {
      tab: 'Issuance', keys: [
        { page: 'Offers', router: 'AllOffers', permission: '' },
        { page: 'Policies', router: 'AllPolices', permission: '' },
        { page: 'All Endorsements', router: 'AllEndorsments', permission: '' }
      ]
    },
    {
      tab: 'Claims', keys: [
        { page: 'All Claims', router: 'AllClaims', permission: '' },
        { page: 'Rejected-claims', router: 'Rejected-claims', permission: '' },
        { page: 'Claims Exchange Permits', router: 'ClaimsExchangePermits', permission: '' },
      ]
    },
    {
      tab: 'Re-insurance', keys: [
        { page: 'Reinsurance Company', router: 'ReInsuranceCompany', permission: '' },
        { page: 'Reinsurance Broker', router: 'ReInsuranceBroker', permission: '' },
        { page: 'Medical Treaty Setup', router: 'MedicalTreatySetup', permission: '' },
        { page: 'SOA', router: 'SOA', permission: '' },
        { page: 'Policy Borderaeux', router: 'Borderaeux', permission: '' },
        // { page: 'Claims Borderaeux', router: 'SOAAndBorderaeux', permission: '' },
        // { page: 'Outstanding Borderaeux', router: 'SOAAndBorderaeux', permission: '' },
        { page: 'Initial Outstanding', router: 'InitialOutstanding', permission: '' },

      ]
    },
    {
      tab: 'Collections', keys: [
        { page: 'Collections', router: 'EmployeeCollection', permission: '' },
        // { page: 'Approve portfolios', router: 'AdminCollection', permission: '' },
        { page: 'Portfolio pay', router: 'CollectionPayment', permission: '' },
        // { page: 'Final approve', router: 'PendingPortfolio', permission: '' },
        { page: 'Print Subbliy', router: 'PrintSubbliy', permission: '' },
        { page: 'Create Honsty', router: 'CreateHonsty', permission: '' },
        { page: 'Exchange Premits', router: 'AllExchangePermit', permission: '' },
        { page: 'Cheques', router: 'Cheques', permission: '' },
        { page: 'Currency Exchange Rate', router: 'CurrencyExchangeRate', permission: '' },
        {page:'Transactions',router:'Transactions', permission: ''},


      ]
    },
    // {
    //   tab: 'Finance', keys: [
    //     { page: 'Claims Payment', router: 'ClaimsPayment', permission: '' },
    //     { page: 'Brokerage Pay', router: 'BrokeragePayment', permission: '' },
    //     { page: 'TPA Payment', router: 'TpaPayment', permission: '' },
    //   ]
    // },
    {
      tab: 'Finance', keys: [
        { page: 'Chart of account', router: 'ChartOfAccounts', permission: '' },
        { page: 'Account type', router: 'AccountType', permission: '' },
        { page: 'Account details', router: 'AccountDetails', permission: '' },
        // { page: 'Claims Payment', router: 'ClaimsPayment', permission: '' },
        { page: 'Brokerage Pay', router: 'BrokeragePayment', permission: '' },
        { page: 'TPA Payment', router: 'TpaPayment', permission: '' },
        // { page: 'Invoice', router: 'Invoice', permission: '' },
        { page: 'Journal Entry', router: 'JournalEntry', permission: '' },
        // { page: 'Receipt voucher', router: 'ReceiptVoucher', permission: '' },
        // { page: 'Payment Voucher', router: 'PaymentVoucher', permission: '' },
        { page: 'Expenses Voucher', router: 'ExpensesVoucher', permission: '' },

        { page: 'Credit note', router: 'CreditNote', permission: '' },
        { page: 'Debit note', router: 'DebitNote', permission: '' },
        { page: 'Claims Voucher', router: 'ClaimsVoucher', permission: '' },

      ]
    },
    {
      tab: 'Accounting', keys: [
        { page: 'Accounting Record', router: 'AccountingRecord', permission: '' },
        { page: 'TrailOfBalance', router: 'TrailOfBalance', permission: '' },

        // { page: 'Reports', router: 'Reports', permission: '' },
        // { page: 'Policy Reports', router: 'CreatedPolices', permission: '' },
        // { page: 'Offer Reports', router: 'OfferReports', permission: '' },
        // { page: 'Customers Reports', router: 'CustomersReport', permission: '' },
        // { page: 'Out Standing Repory', router: 'OutStandingReport', permission: '' }

      ]
    },
    {
      tab: 'Account setup', keys: [
        { page: 'Partners', router: 'AllCustomers', add: 'Add new partner', addRouter: 'addCustomer', permission: '' },
        { page: 'Users', router: 'Users', permission: '' },
        { page: 'Brokerage commissions', router: 'Commissions', permission: '' },
        { page: 'TBA', router: 'TPAFees', permission: '' },
        { page: 'Branches', router: 'Branches', permission: '' },
        { page: 'Banks', router: 'Banks', permission: '' },
        { page: 'Departments', router: 'Departments', permission: '' },
        { page: 'Governorates', router: 'governorates', permission: '' },
        { page: 'Risk', router: 'Risk', permission: '' },
        // {page:'Early collects',router:'CustomersReport', permission:''},
      ]
    },
  ];
  constructor(private _SharedService: SharedService, public _AuthService: AuthService
    , private _Router: Router, public _ActivatedRoute: ActivatedRoute) { }
  deleteItem(id: number) {
    this._SharedService.deleteItem(id);
  }
  setActNav(item: any){
    this.showButtons = false
    this.SelectedParamter = item
    // this.opened =false
    this._SharedService.changeMessage(false);
  }
  onToggle() {
    this.opened = !this.opened
    this._SharedService.changeMessage(this.opened);
  }
  goBack() {
    window.history.back();
  }
  showButtons: boolean = false;


  onEdit() {
    console.log('Editing item');
  }
  openModal(item: any) {
    this._SharedService.openModal(item);  // Trigger the modal open event
  }
  item: any;
  CurrentTap: any;
  currentRoute: any;
  routeParams: any;
  queryParams: any;
  customerId: number | null = null;
  getCurrentRoute(route: ActivatedRoute) {
    while (route.firstChild) {
      route = route.firstChild;  // Drill down to the deepest child route
    }
    this.currentRoute = route.snapshot.routeConfig?.path || '';
    this.routeParams = route.snapshot.params;
    this.queryParams = route.snapshot.queryParams;
    console.log('Current Route:', this.currentRoute);
    // reurn Tap
    this.item = this.Lists.find(tabObj =>
      tabObj.keys.some((item: any) => item.router === this.currentRoute)
    );
    this.CurrentTap = this.item.tab
    console.log(this.CurrentTap);
    this.activeTap = this.Lists.find(item => item.tab == this.CurrentTap);
  }



  onDelete() {
    if (this.customerId) {
      // Call the delete function here with this.customerId
      console.log('Deleting customer with ID:', this.customerId);
      // Example: this.adminService.deleteCustomer(this.customerId).subscribe(...);
    }
  }

  getQueryParam(router: string): string {
    switch (router) {
      case 'SOAAndBorderaeux':
        return 'SOA';
      case 'Borderaeux':
        return 'Borderaeux';
      case 'Claims':
        return 'Claims';
      case 'Outstanding':
        return 'Outstanding';
      default:
        return '';
    }
  }


  ngOnInit(): void{
    // Subscribe to route changes
    this._Router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the current route
        this.getCurrentRoute(this._ActivatedRoute);
      });
    
    
    this._SharedService.currentData.subscribe(data => {
      setTimeout(() => {
        this.addButton = data;
      });
    });
    this._SharedService.showButtons$.subscribe(show => {
      setTimeout(() => {
        this.showButtons = show;
      });
    });

  }
}

