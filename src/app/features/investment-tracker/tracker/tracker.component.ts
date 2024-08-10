import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Router, RouterLink } from '@angular/router';
import { Investment, InvestmentTracker, InvestmentTrackerService } from '../../../services/investment-tracker.service';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { TrackerInvestmentItemComponent } from '../tracker-investment-item/tracker-investment-item.component';
import { LongPressDirective } from '../../../shared/long-press.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { MatRipple } from '@angular/material/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { ForecastComponent } from '../forecast/forecast.component';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [RouterLink, DatePipe, KeyValuePipe, MatRipple, MatBottomSheetModule, LongPressDirective, PieChartComponent, TrackerInvestmentItemComponent],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss'
})
export class TrackerComponent implements OnInit, AfterViewInit {

  @ViewChildren('investmentItem', { read: ElementRef }) investmentItems!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.investmentItems.changes.subscribe(() => {
      this.scrollToLastInvestment();
    });
  }

  scrollToLastInvestment(): void {
    if (this.investmentItems.length > 0) {
      const lastItem = this.investmentItems.last.nativeElement;
      lastItem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  _trackerId!: string;
  tracker!: InvestmentTracker;
  investments!: Map<string, Investment[]>
  selectionModel = new SelectionModel<Investment>(true, []);
  constructor(private service: InvestmentTrackerService, private router: Router, private bs: MatBottomSheet) { }

  ngOnInit(): void {
    this.fetchInvestments()
  }

  @Input({required: true})
  set id(id: string) {
    this._trackerId = id;
    this.fetchTracker()
    this.fetchInvestments()
  }

  fetchTracker() {
    this.service.getTracker(this._trackerId).subscribe({
      next: (tracker: InvestmentTracker) => {
        this.tracker = tracker;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  fetchInvestments() {
    this.service.listInvestments(this._trackerId).subscribe({
      next: (investments) => {
        this.investments = investments;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toggleSelection(investment: Investment) {
    this.selectionModel.toggle(investment);
  }

  shortClick(investment: Investment) {
    if (this.selectionModel.selected.length > 0) {
      return this.toggleSelection(investment);
    }
    return this.router.navigate([`/finance/investment/${investment.id}`]);
  }

  deleteInvestments(investments: Investment[]) {
    console.log(investments)
  }


  showForecast() {
    this.bs.open(ForecastComponent, {data: {trackerId: this._trackerId}})
  }




}
