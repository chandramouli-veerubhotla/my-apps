import { Component, Input } from '@angular/core';
import { ChartjsDirective } from '../../../shared/chartjs.directive';
import { Investment } from '../../../services/investment-tracker.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [ChartjsDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {

  options: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ['Credit', 'Credit Interest', 'Debit', 'Debit Interest'],
      datasets: [{
        data: [50000, 10000, 20000, 5000],
        backgroundColor: ['green', 'blue', 'red', 'orange']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }

}
