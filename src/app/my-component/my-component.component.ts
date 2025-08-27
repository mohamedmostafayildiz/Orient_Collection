import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ChartjsComponent } from '@coreui/angular-chartjs';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponentComponent {
  // data = {
  //   labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
  //   datasets: [
  //     {
  //       label: 'My First dataset',
  //       backgroundColor: 'rgba(220, 220, 220, 0.2)',
  //       borderColor: 'rgba(220, 220, 220, 1)',
  //       pointBackgroundColor: 'rgba(220, 220, 220, 1)',
  //       pointBorderColor: '#fff',
  //       pointHighlightFill: '#fff',
  //       pointHighlightStroke: 'rgba(220, 220, 220, 1)',
  //       data: [65, 59, 90, 81, 56, 55, 40]
  //     },
  //     {
  //       label: 'My Second dataset',
  //       backgroundColor: 'rgba(151, 187, 205, 0.2)',
  //       borderColor: 'rgba(151, 187, 205, 1)',
  //       pointBackgroundColor: 'rgba(151, 187, 205, 1)',
  //       pointBorderColor: '#fff',
  //       pointHighlightFill: '#fff',
  //       pointHighlightStroke: 'rgba(151, 187, 205, 1)',
  //       data: [28, 48, 40, 19, 96, 27, 100]
  //     }
  //   ]
  // };
}
