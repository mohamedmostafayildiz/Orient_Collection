import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { SharedService } from 'src/app/services/shared.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexOptions, ApexTitleSubtitle } from 'ng-apexcharts';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  totalPolicies = 120;
  totalOffers = 85;
  totalClaims = 50;
  activeUsers = 230;
  dashboardData = [
    { title: 'Total Policies', value: 120, currentValue: 120, description: 'Total policies issued to date', gradient: 'linear-gradient(135deg, #4b79a1, #283e51)', icon: 'fa fa-file-alt', link: '/AllPolices', percentage: 75 },
    { title: 'Total Offers', value: 85, currentValue: 85, description: 'Offers made to potential clients', gradient: 'linear-gradient(135deg, #56ab2f, #a8e063)', icon: 'fa fa-tags', link: '/AllOffers', percentage: 60 },
    { title: 'Total Claims', value: 50, currentValue: 50, description: 'Claims filed by policyholders', gradient: 'linear-gradient(135deg, #e52d27, #b31217)', icon: 'fa fa-clipboard-list', link: '/AllClaims', percentage: 40 },
    { title: 'Active Users', value: 230, currentValue: 230, description: 'Users currently active on the platform', gradient: 'linear-gradient(135deg, #2c3e50, #4ca1af)', icon: 'fa fa-users', link: '/AllCustomers', percentage: 90 }
];
  constructor(private _SharedService:SharedService){}
   // Function to animate count-up effect
   startCountUpAnimation() {
    this.dashboardData.forEach(item => {
      let currentValue = 0;
      const increment = Math.ceil(item.value / 50); // Adjust this for speed
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= item.value) {
          item.currentValue = item.value;
          clearInterval(interval);
        } else {
          item.currentValue = currentValue;
        }
      }, 20); // Adjust this for speed
    });
  }
  async ngOnInit(): Promise<void> {
  await localStorage.setItem('act_Tab','Dashboard');
  await localStorage.setItem('act_Nav','Dashboard');  
    this._SharedService.changeData(false,'','',false,false);
    this.startCountUpAnimation();
  }

  // calculatePercentage(value: number, total: number): number {
  //   return total > 0 ? (value / total) * 100 : 0;
  // }

  public barChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public barChartData: ChartData<'pie', (number | [number, number] | null)[]> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };
  public barChartLegend = true;

 chartseries:ApexNonAxisChartSeries = [40, 32, 38, 25]
 chartDetails: ApexChart = {
   type: 'pie',
   toolbar: {
    show:true
   }
 }
 chartlabels=["Offers","Polices","Claims","Endorsments"]
 charttitle:ApexTitleSubtitle = {
  text:'System Details',
  align:'left'
 }
 chardatalabels:ApexDataLabels = {
  enabled: true
 }


}
