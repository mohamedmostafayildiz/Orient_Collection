import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as AOS from 'aos';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './services/shared.service';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs';

declare var $: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],


})


export class AppComponent implements OnInit {
  isSuccess = false;
  successMessage: any;
  title = 'Tabeeb';
  opened = false;
  CurrentTap: any
  loader: boolean = true;
  ActiveList: any
  SelectedActiveList: any
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
        //  { page: 'Claims Payment', router: 'ClaimsPayment', permission: '' },
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
        { page: 'Partners', router: 'AllCustomers', permission: '' },
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

  getSelectedSideBar(TargetItem: any, ActiveTap: string) {
    TargetItem as HTMLElement
    document.querySelector('.activee')?.classList.remove('activee')
    TargetItem.classList.add("activee");
    this.ActiveList = this.Lists.find(item => item.tab == ActiveTap);
    if (this.ActiveList && this.ActiveList.keys.length > 0) {
      const firstRoute = this.ActiveList.keys[0].router;

      // Navigate to the first route
      this._Router.navigate([firstRoute]);

    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  constructor(private translate: TranslateService, private _SharedService: SharedService, public _AuthService: AuthService,
    public _CookieService: CookieService, private _Router: Router, private _ActivatedRoute: ActivatedRoute
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }



  getDataForChild() {
    return this.opened;
  }

  logOut() {
    localStorage.removeItem('MedicalToken')
    localStorage.removeItem('permissions')
    this._CookieService.delete('MedicalToken')
    // localStorage.removeItem("expiresOn");
    localStorage.removeItem("userType");
    this._Router.navigate(['/login']);
  }
  currentRoute: string = '';
  routeParams: any = {};
  queryParams: any = {};
  item: any
  getCurrentRoute(route: ActivatedRoute) {
    while (route.firstChild) {
      route = route.firstChild;  // Drill down to the deepest child route
    }
    this.currentRoute = route.snapshot.routeConfig?.path || '';
    this.routeParams = route.snapshot.params;
    this.queryParams = route.snapshot.queryParams;
    // reurn Tap
    this.item = this.Lists.find(tabObj =>
      tabObj.keys.some((item: any) => item.router === this.currentRoute)
    );
    this.ActiveList = this.item
    this.CurrentTap = this.item.tab
  }

  ngOnInit(): void {
    // Subscribe to route changes
    this._Router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the current route
        this.getCurrentRoute(this._ActivatedRoute);
      });

    this._SharedService.alertMessage$.subscribe((message) => {
      if (message) {
        this.isSuccess = true;
        this.successMessage = message;

        // Automatically hide the alert after 3 seconds
        setTimeout(() => {
          this.isSuccess = false;
          this.successMessage = null;
        }, 4000);
      }
    });
    AOS.init();
  }
}
