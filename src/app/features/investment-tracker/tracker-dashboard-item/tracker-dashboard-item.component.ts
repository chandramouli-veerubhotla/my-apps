import { Component, Input } from '@angular/core';
import { InvestmentTracker } from '../../../services/investment-tracker.service';
import { DatePipe, NgClass } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { LongPressDirective } from '../../../shared/long-press.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracker-dashboard-item',
  standalone: true,
  imports: [MatRippleModule, NgClass, LongPressDirective, DatePipe],
  templateUrl: './tracker-dashboard-item.component.html',
  styleUrl: './tracker-dashboard-item.component.scss'
})
export class TrackerDashboardItemComponent {

  @Input({required: true}) tracker!: InvestmentTracker;
  @Input() selected: boolean = false;

}
