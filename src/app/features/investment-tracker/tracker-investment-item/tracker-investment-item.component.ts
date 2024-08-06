import { Component, Input } from '@angular/core';
import { Investment } from '../../../services/investment-tracker.service';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-tracker-investment-item',
  standalone: true,
  imports: [NgClass, CurrencyPipe, DatePipe],
  templateUrl: './tracker-investment-item.component.html',
  styleUrl: './tracker-investment-item.component.scss'
})
export class TrackerInvestmentItemComponent {

  @Input() rigthtAligned = true;
  @Input() canShare = true;
  @Input() selected: boolean = false;

  @Input({required: true}) investment!: Investment;

}
