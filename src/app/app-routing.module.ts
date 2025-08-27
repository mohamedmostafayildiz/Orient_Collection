import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerComponent } from './components/admin/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './components/admin/customer-details/customer-details.component';
import { AllCustomersComponent } from './components/admin/all-customers/all-customers.component';
import { LoginComponent } from './components/login/login.component'; 
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { UsersComponent } from './components/admin/users/users.component';
import { BasicComisionComponent } from './components/admin/bassic-comision/basic-comision.component';
import { EarlyAndCollectComponent } from './components/admin/early-and-collect/early-and-collect.component';
import { CommissionsComponent } from './components/admin/commissions/commissions.component';
import { BrokerCommissionsComponent } from './components/admin/broker-commissions/broker-commissions.component';
import { AllEarlyCollectComponent } from './components/admin/all-early-collect/all-early-collect.component';
import { AllPlansComponent } from './components/admin/all-plans/all-plans.component';
import { AllbenefitsComponent } from './components/admin/allbenefits/allbenefits.component';
import { AddBenefitComponent } from './components/admin/add-benefit/add-benefit.component';
import { AddPlanComponent } from './components/admin/add-plan/add-plan.component';
import { ForbiddenComponent } from './components/shared/forbidden/forbidden.component';
import { HasRoleGuard } from './guards/has-role.guard';
import { AllPolicesComponent } from './components/Offer/All-Offers/all-polices.component';
import { PolicyDetailsComponent } from './components/Offer/policy-details/policy-details.component';
import { CustomPlanComponent } from './components/Offer/custom-plan/custom-plan.component';
import { SelectPlanToPolicyComponent } from './components/Offer/select-plan-to-policy/select-plan-to-policy.component';
import { PlansAndItesBenfitsComponent } from './components/Offer/plans-and-ites-benfits/plans-and-ites-benfits.component';
import { UploadPlansFileComponent } from './components/Offer/upload-plans-file/upload-plans-file.component';
import { UplaodGroupFileComponent } from './components/Offer/uplaod-group-file/uplaod-group-file.component';
import { CalculationsOfPolicyComponent } from './components/Offer/calculations-of-policy/calculations-of-policy.component';
import { PlansOfPolicyComponent } from './components/Offer/plans-of-policy/plans-of-policy.component';
import { GroupOfPolicyComponent } from './components/Offer/group-of-policy/group-of-policy.component';
import { TpAFeesComponent } from './components/admin/tp-a-fees/tp-a-fees.component';
import { OfferDetailsComponent } from './components/Offer/offer-details/offer-details.component';
import { OfferVersionsComponent } from './components/Offer/offer-versions/offer-versions.component';
import { WelcomePageComponent } from './components/admin/welcome-page/welcome-page.component';
import { ReinsurerDataComponent } from './components/admin/reinsurer-data/reinsurer-data.component';
import { AllReinsurersComponent } from './components/admin/all-reinsurers/all-reinsurers.component';
import { ConvertToPolicyComponent } from './components/Policy/convert-to-policy/convert-to-policy.component';
import { PolicyCalculationsComponent } from './components/Policy/policy-calculations/policy-calculations.component';
import { AllPolicessComponent } from './components/Policy/all-policess/all-policess.component';
import { ReNewPolicyComponent } from './components/Policy/re-new-policy/re-new-policy.component';
import { AddOfferComponent } from './components/Offer/Add-Offer/addOffer.component';
import { ActivatePolicyComponent } from './components/Policy/activate-policy/groupNetPrem.component';
import { ClaimComponent } from './components/Compensation/claim/claim.component';
import { PolicyDetailssComponent } from './components/Policy/policy-details/policy-details.component';
import { SettingPolicyComponent } from './components/Policy/setting-policy/setting-policy.component';
import { BranchesComponent } from './components/admin/branches/branches.component';
import { InitialClaimComponent } from './components/Compensation/initial-claim/initial-claim.component';
import { InitialEndorsmentComponent } from './components/Compensation/initial-endorsment/initial-endorsment.component';
import { EndorsmentComponent } from './components/Compensation/endorsment/endorsment.component';
import { CancelUpdateComponent } from './components/Compensation/cancel-update/cancel-update.component';
import { CollectionUserComponent } from './components/collection/collection-user/collection-user.component';
import { CollectionAdminComponent } from './components/collection/collection-admin/collection-admin.component';
import { PaymentWayComponent } from './components/collection/payment-way/payment-way.component';
import { ClaimsPayComponent } from './components/collection/claims-pay/claims-pay.component';
import { CommissionPaymentComponent } from './components/collection/commission-payment/commission-payment.component';
import { EndorsmentPremComponent } from './components/Compensation/endorsment-prem/endorsment-prem.component';
import { PrintSubbliyComponent } from './components/collection/print-subbliy/print-subbliy.component';
import { CommissionPermissionComponent } from './components/collection/commission-permission/commission-permission.component';
import { ModelPortfolioComponent } from './components/collection/model-portfolio/model-portfolio.component';
import { UrlComponent } from './components/shared/url/url.component';
import { BrokeragePayComponent } from './components/collection/brokerage-pay/brokerage-pay.component';
import { TpaPayComponent } from './components/collection/tpa-pay/tpa-pay.component';
import { ReportsComponent } from './components/reports/reports/reports.component';
import { PolicyCreationComponent } from './components/reports/policy-creation/policy-creation.component';
import { ClaimDetailsReportComponent } from './components/reports/claim-details-report/claim-details-report.component';
import { OfferReportsComponent } from './components/reports/offer-reports/offer-reports.component';
import { CustomersReportComponent } from './components/reports/customers-report/customers-report.component';
import { ModelBrokerageComponent } from './components/collection/model-brokerage/model-brokerage.component';
import { CreateHonstyComponent } from './components/collection/create-honsty/create-honsty.component';
import { ModelDailyCollectionComponent } from './components/collection/model-daily-collection/model-daily-collection.component';
import { ModelPolicyComponent } from './components/Policy/model-policy/model-policy.component';
import { AllExchangePremitComponent } from './components/collection/all-exchange-premit/all-exchange-premit.component';
import { UnderCollectionComponent } from './components/reports/under-collection/under-collection.component';
import { DueCommissionComponent } from './components/reports/due-commission/due-commission.component';
import { PendingPortfolioComponent } from './components/collection/pending-portfolio/pending-portfolio.component';
import { SourceRecordComponent } from './components/reports/issuance/source-record/source-record.component';
import { TreasuryComponent } from './components/reports/treasure/treasure.component';
import { UnderCollectorPremiumComponent } from './components/reports/under-collector-premium/under-collector-premium.component';
import { PaiedCollectorPremiumComponent } from './components/reports/paied-collector-premium/paied-collector-premium.component';
import { PendingInsuredComponent } from './components/reports/pending-insured/pending-insured.component';
import { AllEndorsmentComponent } from './components/Policy/all-endorsment/all-endorsment.component';
import { NegativeBrokeragesComponent } from './components/reports/negative-brokerages/negative-brokerages.component';
import { SecretariatsRecordsComponent } from './components/reports/secretariats-records/secretariats-records.component';
import { CreateBankComponent } from './components/admin/create-bank/create-bank.component';
import { RestriksComponent } from './components/shared/restriks/restriks.component';
import { DepartmentsComponent } from './components/admin/departments/departments.component';
import { DueCommissionForCollectorComponent } from './components/reports/due-commission-for-collector/due-commission-for-collector.component';
import { PaidCommissionsComponent } from './components/reports/paid-commissions/paid-commissions.component';
import { GovernoratesComponent } from './components/admin/governorates/governorates.component';
import { MedicalTreatySetupComponent } from './components/reinsurance/medical-treaty-setup/medical-treaty-setup.component';
import { ReInsuranceBrokerComponent } from './components/reinsurance/re-insurance-broker/re-insurance-broker.component';
import { ReInsuranceCompanyComponent } from './components/reinsurance/re-insurance-company/re-insurance-company.component';
import { RiskComponent } from './components/admin/risk/risk.component';
import { PaymentPermisionComponent } from './components/Compensation/payment-permision/payment-permision.component';
import { AllClaimsComponent } from './components/Compensation/all-claims/all-claims.component';
import { ClaimsExchangePermitsComponent } from './components/collection/claims-exchange-permits/claims-exchange-permits.component';
import { RejectedClaimsComponent } from './components/Compensation/rejected-claims/rejected-claims.component';
import { ClaimsCollectionComponent } from './components/reports/claims-collection/claims-collection.component';
import { ClaimsRatioComponent } from './components/reports/claims-ratio/claims-ratio.component';
import { SubcompaniessLossRatioComponent } from './components/reports/subcompaniess-loss-ratio/subcompaniess-loss-ratio.component';
import { EditofferComponent } from './components/Offer/editoffer/editoffer.component';
import { SoaComponent } from './components/reinsurance/soa/soa.component';
import { OutstandingComponent } from './components/reinsurance/outstanding/outstanding.component';
import { InitialOutstandingComponent } from './components/reinsurance/initial-outstanding/initial-outstanding.component';
import { MyComponentComponent } from './my-component/my-component.component';
import { ModelofferComponent } from './components/Offer/modeloffer/modeloffer.component';
import { FinnanceclaimsreportComponent } from './components/reports/finnanceclaimsreport/finnanceclaimsreport.component';
import { FinnancecommissionreportComponent } from './components/reports/finnancecommissionreport/finnancecommissionreport.component';
import { TpacoomissionreportComponent } from './components/reports/tpacoomissionreport/tpacoomissionreport.component';
import { OutstandingreportComponent } from './components/reports/outstandingreport/outstandingreport.component';
import { ClaimsdetailsReportComponent } from './components/reports/claimsdetails-report/claimsdetails-report.component';
import { PaidclaimsReportComponent } from './components/reports/paidclaims-report/paidclaims-report.component';
import { UnpaidclaimsReportComponent } from './components/reports/unpaidclaims-report/unpaidclaims-report.component';
import { AllChartsComponent } from './components/Finance/all-charts/all-charts.component';
import { InvoiceComponent } from './components/Finance/invoice/invoice.component';
import { JournalEntryComponent } from './components/Finance/journal-entry/journal-entry.component';
import { ReceiptVoucherComponent } from './components/Finance/receipt-voucher/receipt-voucher.component';
import { CreditNoteComponent } from './components/Finance/credit-note/credit-note.component';
import { DebitNoteComponent } from './components/Finance/debit-note/debit-note.component';
import { AccountTypeComponent } from './components/Finance/account-type/account-type.component';
import { AccountDetailsComponent } from './components/Finance/account-details/account-details.component';
import { CheckComponent } from './components/shared/check/check.component';
import { CurencyExchangepermitsComponent } from './components/collection/curency-exchangepermits/curency-exchangepermits.component';
import { TrailofBalanceComponent } from './components/reports/trailof-balance/trailof-balance.component';
import { JournalvoucherComponent } from './components/Finance/journalvoucher/journalvoucher.component';
import { AccountingreportComponent } from './components/reports/accountingreport/accountingreport.component';
import { ExpensesComponent } from './components/Finance/expenses/expenses.component';
import { ClaimsvoucherComponent } from './components/Finance/claimsvoucher/claimsvoucher.component';
import { PolicybordoraosComponent } from './components/reinsurance/policybordoraos/policybordoraos.component';
import { TransactionsComponent } from './components/collection/transactions/transactions.component';
import { ChequesComponent } from './components/collection/cheques/cheques.component';

// class="main_outer_Btn mx-2" mat-stroked-button

// , data:{
//   role:['Ahmed',"Admin"],
  
// }

const routes: Routes = [
  {path:'',component:LoginComponent },
  {path:'Dashboard',component:WelcomePageComponent },
  {path:'addCustomer',canActivate:[HasRoleGuard],data:["Permissions.Customers.Create"],component:AddCustomerComponent},
  {path:'Departments',canActivate:[HasRoleGuard], data:["Permissions.Departments.View"],component:DepartmentsComponent },

  {path:'CustomerDetails/:id',canActivate:[HasRoleGuard], data:["Permissions.Customers.View"],component:CustomerDetailsComponent },
  {path:'governorates',component:GovernoratesComponent },
  {path:'WelcomePage',component:WelcomePageComponent },
  {path:'TPAFees',component:TpAFeesComponent },
  {path:'AllCustomers/:id',canActivate:[HasRoleGuard], data:["Permissions.Customers.View"],component:AllCustomersComponent},
  {path:'AllReinsurers',component:AllReinsurersComponent },
  {path:'ReinsurerData/:id',component:ReinsurerDataComponent },
  {path:'AllCustomers',component:AllCustomersComponent },
  {path:'AllEarlyCollects',component:AllEarlyCollectComponent },
  {path:'BasicComision',component:BasicComisionComponent },
  {path:'BasicComision',canActivate:[HasRoleGuard], data:["Permissions.BrokerageCommissions.Add"],component:BasicComisionComponent },
  {path:'Early&Collect',component:EarlyAndCollectComponent },
  {path:'Commissions',component:CommissionsComponent },
  {path:'Commissions',canActivate:[HasRoleGuard],data:["Permissions.BrokerageCommissions.View"],component:CommissionsComponent },
  {path:'BrokerCommissions/:name/:id',component:BrokerCommissionsComponent },
  {path:'AllPlans',component:AllPlansComponent},
  {path:'AllPlans/:id',component:AllPlansComponent},
  {path:'AddBenefit/:planName/:id',component:AddBenefitComponent},
  {path:'AddBenefit',component:AddBenefitComponent },
  {path:'AllBenifits/:planName/:PlanId',component:AllbenefitsComponent},
  {path:'policy/:id',canActivate:[HasRoleGuard],data:["Permissions.Offers.Create"],component:AddOfferComponent },
  {path:'Offer',canActivate:[HasRoleGuard],data:["Permissions.Offers.Create"],component:AddOfferComponent },
  {path:'AddPlan',component:AddPlanComponent },
  {path:'AllOffers',canActivate:[HasRoleGuard],data:["Permissions.Offers.View"],component:AllPolicesComponent },
  {path:'PolicyDetails/:name/:id',component:PolicyDetailsComponent},
  {path:'SelectPlanToPolicy/:type/:customerId/:policyId',component:SelectPlanToPolicyComponent},
  {path:'SelectPlanToPolicy/:id',component:SelectPlanToPolicyComponent},
  {path:'Forbidden',component:ForbiddenComponent},
  {path:'CustomPlan/:type/:customerId/:policyId',component:CustomPlanComponent},
  {path:'Plans&ItsBenfits/:customerId',component:PlansAndItesBenfitsComponent},
  {path:'UploadPlansFile/:id',canActivate:[HasRoleGuard],data:["Permissions.Offers.Create"],component:UploadPlansFileComponent},
  {path:'UploadGroupFile/:id',canActivate:[HasRoleGuard],data:["Permissions.Offers.Create"],component:UplaodGroupFileComponent},
  {path:'Calculations/:id',component:CalculationsOfPolicyComponent},
  {path:'PlansOfPolicy/:id',component:PlansOfPolicyComponent},
  {path:'groupOfPolicy/:id',component:GroupOfPolicyComponent},
  {path:'EditOffer/:id',component:EditofferComponent},
  {path:'OfferDetails/:id',canActivate:[HasRoleGuard],data:["Permissions.Offers.View"],component:OfferDetailsComponent},
  {path:'OfferVersions/:id',component:OfferVersionsComponent},
  {path:'Branches',canActivate:[HasRoleGuard],data:["Permissions.Branches.View"],component:BranchesComponent},
  {path:'Banks',canActivate:[HasRoleGuard],data:["Permissions.Banks.View"],component:CreateBankComponent},
  {path:'url',component:UrlComponent},
  {path:'Restriks/:id',component:RestriksComponent},
  {path:'Risk',component:RiskComponent},
  {path:'ModelOffer/:id',component:ModelofferComponent},
  {path:'Check', component:CheckComponent },

  // Policy
  {path:'ConvertToPolicy/:id',canActivate:[HasRoleGuard],data:["Permissions.Offers.ConvertOfferToPolicy"],component:ConvertToPolicyComponent},
  {path:'PolicyCalculations/:id',canActivate:[HasRoleGuard],data:["Permissions.Policies.View"],component:PolicyCalculationsComponent},
  {path:'AllPolices',data:["Permissions.Policies.View"],component:AllPolicessComponent},
  {path:'ReNewPolicy/:id',data:["Permissions.Policies.Renewal"],component:ReNewPolicyComponent},
  {path:'groupNetPremium/:id',component:ActivatePolicyComponent},
  {path:'PolicyDetails/:id',canActivate:[HasRoleGuard],data:["Permissions.Policies.View"],component:PolicyDetailssComponent},
  {path:'PolicySetting',component:SettingPolicyComponent},
  {path:'ModelPolicy/:id',component:ModelPolicyComponent},
  {path:'ModelPaymentPermission',component:PaymentPermisionComponent},
  {path:'AllEndorsments',canActivate:[HasRoleGuard],data:["Permissions.Endorsements.View"],component:AllEndorsmentComponent},

  // Compensations
  {path:'InitialClaim',canActivate:[HasRoleGuard],data:["Permissions.Claims.Create"],component:InitialClaimComponent},
  {path:'InitialEndorsment',canActivate:[HasRoleGuard],data:["Permissions.Endorsements.Create"],component:InitialEndorsmentComponent},

  {path:'Endorsment/:id',canActivate:[HasRoleGuard],data:["Permissions.Endorsements.Create"],component:EndorsmentComponent},
  
  {path:'EndorsmentPrem/:id/:date/:type',component:EndorsmentPremComponent},
  {path:'Claim/:id',canActivate:[HasRoleGuard],data:["Permissions.Claims.Create"],component:ClaimComponent},
  {path:'CancleUpdate/:id/:date/:type',component:CancelUpdateComponent},

  {path:'Users',canActivate:[HasRoleGuard],data:["Permissions.Users.View"],component:UsersComponent },
  // Collection 
  {path:'EmployeeCollection',component:CollectionUserComponent},
  {path:'AdminCollection',component:CollectionAdminComponent},
  {path:'CollectionPayment',component:PaymentWayComponent},
  {path:'ClaimsPayment',component:ClaimsPayComponent},
  {path:'CommissionPermision',component:CommissionPermissionComponent},
  {path:'CommissionPayment',component:CommissionPaymentComponent},
  {path:'PrintSubbliy',component:PrintSubbliyComponent},
  {path:'Transactions',component:TransactionsComponent},
  {path:'PortfolioModel/:id/:collectionTypeId',component:ModelPortfolioComponent},
  {path:'PortfolioModel',component:ModelPortfolioComponent},
  {path:'BrokerageModel',component:ModelBrokerageComponent},
  {path:'BrokerageModel/:id',component:ModelBrokerageComponent},
  {path:'TpaPayment',component:TpaPayComponent},
  {path:'BrokeragePayment',component:BrokeragePayComponent},
  {path:'CreateHonsty',component:CreateHonstyComponent},
  {path:'AllExchangePermit',component:AllExchangePremitComponent},
  {path:'PendingPortfolio',component:PendingPortfolioComponent},
  {path:'AllClaims',component:AllClaimsComponent},
  {path:'ClaimsExchangePermits',component:ClaimsExchangePermitsComponent},
  {path:'Rejected-claims',component:RejectedClaimsComponent},
  {path:'CurrencyExchangeRate',component:CurencyExchangepermitsComponent},
  {path:'Cheques',component:ChequesComponent},
  // Reports 
  {path:'DailyCollection',canActivate:[HasRoleGuard],data:["Permissions.Reports.CollectionDaily"],component:ModelDailyCollectionComponent},
  {path:'Reports',component:ReportsComponent},
  {path:'CreatedPolices',component:PolicyCreationComponent},
  {path:'ClaimDetailsReport',canActivate:[HasRoleGuard],data:["Permissions.Reports.ClaimDetails"],component:ClaimDetailsReportComponent},
  {path:'OfferReports',component:OfferReportsComponent},
  {path:'CustomersReport',component:CustomersReportComponent},
  {path:'UnderCollection',component:UnderCollectionComponent},
  {path:'DueCommission',component:DueCommissionComponent},
  {path:'SourceRecord',canActivate:[HasRoleGuard],data:["Permissions.Reports.SourceRecord"],component:SourceRecordComponent},
  {path:'NegativeBrokerages',canActivate:[HasRoleGuard],data:["Permissions.Reports.CurrentAgent"],component:NegativeBrokeragesComponent},
  {path:'SecretariatsRecords',canActivate:[HasRoleGuard],data:["Permissions.Reports.SecretariatRecord"],component:SecretariatsRecordsComponent},
  // Reports Collection
  {path:'TreasuryReport',canActivate:[HasRoleGuard],data:["Permissions.Reports.Treasury"],component:TreasuryComponent},
  {path:'UnderCollectorPremium',canActivate:[HasRoleGuard],data:["Permissions.Reports.UnderCollector"],component:UnderCollectorPremiumComponent},
  {path:'PaidCollectorPremium',canActivate:[HasRoleGuard],data:["Permissions.Reports.PaidAndCollector"],component:PaiedCollectorPremiumComponent},
  {path:'PendingInsured',canActivate:[HasRoleGuard],data:["Permissions.Reports.GetInsured"],component:PendingInsuredComponent},
  {path:'DueCommissionForCollector',component:DueCommissionForCollectorComponent},
  {path:'PaidCommissions',component:PaidCommissionsComponent},

  // Two Rrports added on 29/8
  {path:'ClaimsCollection-report',component:ClaimsCollectionComponent},
  {path:'LossRatioReport',component:ClaimsRatioComponent},
  {path:'supcompanyLossRatioReport',component:SubcompaniessLossRatioComponent},

  //finance reports
  {path:'FinanceClaimsReport',component:FinnanceclaimsreportComponent},
  {path:'FinanceCommissionReport',component:FinnancecommissionreportComponent},
  {path:'TpaCommissionReport',component:TpacoomissionreportComponent},
  //outstandingReport
  {path:'OutStandingReport',component:OutstandingreportComponent},
  //Claims Report
  {path:'ClaimDetailsReport',component:ClaimsdetailsReportComponent},
  {path:'PaidClaim',component:PaidclaimsReportComponent},
  {path:'UnpaidClaim',component:UnpaidclaimsReportComponent},

  // NewREports
  {path:'TrailOfBalance',component:TrailofBalanceComponent},
  {path:'AccountingRecord',component:AccountingreportComponent},

  // Auth
  {path:'signup',canActivate:[HasRoleGuard],data:["Permissions.Users.Create"],component:SignUpComponent },
  {path:'login',component:LoginComponent},

  // Re Insurance
  {path:'MedicalTreatySetup',component:MedicalTreatySetupComponent},
  {path:'ReInsuranceBroker',component:ReInsuranceBrokerComponent},
  {path:'ReInsuranceCompany',component:ReInsuranceCompanyComponent},
  {path:'SOA',component:SoaComponent},
  {path:'Borderaeux',component:PolicybordoraosComponent},
  {path:'InitialOutstanding',component:InitialOutstandingComponent},
  {path:'Outstanding/:id',component:OutstandingComponent},
  // {path:'MyComponent',component:MyComponentComponent},

  {path: 'ChartOfAccounts' ,component:AllChartsComponent},
  {path: 'Invoice' ,component:InvoiceComponent},
  {path: 'JournalEntry' ,component:JournalEntryComponent},
  {path: 'ReceiptVoucher' ,component:ReceiptVoucherComponent},
  {path:'PaymentVoucher',component:JournalvoucherComponent},
  {path: 'CreditNote' ,component:CreditNoteComponent},
  {path: 'DebitNote' ,component:DebitNoteComponent},
  {path: 'AccountType' ,component:AccountTypeComponent},
  {path: 'AccountDetails' ,component:AccountDetailsComponent},
  {path:'ExpensesVoucher',component:ExpensesComponent},
  {path:'ClaimsVoucher',component:ClaimsvoucherComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// PolicyCaluculations?.hasEntries==true||this.isJournalclick||this.isClicked