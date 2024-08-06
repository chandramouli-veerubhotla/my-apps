import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { InvestmentTracker, InvestmentTrackerService } from '../../../services/investment-tracker.service';
import { TrackerDashboardItemComponent } from '../tracker-dashboard-item/tracker-dashboard-item.component';
import { MatRipple } from '@angular/material/core';
import { LongPressDirective } from '../../../shared/long-press.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgClass, TrackerDashboardItemComponent, MatRipple, LongPressDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  trackers!: InvestmentTracker[];
  selectionModel = new SelectionModel<InvestmentTracker>(true, []);
  constructor(private service: InvestmentTrackerService, private router: Router) { }

  ngOnInit(): void {
    this.fetchTrackers()
  }

  fetchTrackers() {
    this.service.listTrackers().subscribe({
      next: (trackers) => {
        this.trackers = trackers;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toggleSelection(tracker: InvestmentTracker) {
    this.selectionModel.toggle(tracker);
  }

  shortClick(tracker: InvestmentTracker) {
    if (this.selectionModel.selected.length > 0) {
      return this.toggleSelection(tracker);
    }
    return this.router.navigate([`/finance/tracker/${tracker.id}`]);
  }

  deleteTrackers(trackers: InvestmentTracker[]) {
    console.log(trackers)
  }

}
