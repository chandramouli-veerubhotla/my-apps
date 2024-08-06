import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, RouterLink } from '@angular/router';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { Investment, InvestmentTracker, InvestmentTrackerService } from '../../../services/investment-tracker.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { catchError, debounceTime, first, map, Observable, of, switchMap } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-new-investment',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './new-investment.component.html',
  styleUrl: './new-investment.component.scss',
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(50%)', opacity: 0 })),
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),
      transition(':enter', [
        animate('0.15s ease-in')
      ])
    ])
  ]
})
export class NewInvestmentComponent implements OnInit {

  _trackerId!: string;
  tracker!: InvestmentTracker;

  @Input({required: true})
  set id(id: string) {
    this._trackerId = id;
    this.fetchTrackerAndApplyDefaults();
  }

  fetchTrackerAndApplyDefaults() {
    this.service.getTracker(this._trackerId).subscribe({
      next: (tracker: InvestmentTracker) => {
        this.tracker = tracker;
        this.form.patchValue({trackerId: this._trackerId, interestRate: tracker.defaultInterestRate});
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  constructor(private service: InvestmentTrackerService, private router: Router) { }

  ngOnInit(): void {
    let monthYearStr = this.getCurrentMonthYear()
    this.form.patchValue({title: monthYearStr, investedOn: new Date()});
  }

  getCurrentMonthYear(): string {
    const date = new Date();
    const options = { year: 'numeric', month: 'long' } as const;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  // Form Group for the new investment form allows to fetch information from the user.
  form: FormGroup = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    amount: new FormControl<number|null>(null, [Validators.required, Validators.min(1)]),
    interestRate: new FormControl<number|null>(null, [Validators.min(0), Validators.max(100)]),
    investedOn: new FormControl<Date|null>(null, [Validators.required]),
    isCredit: new FormControl<boolean>(true),
    trackerId: new FormControl<string|null>(null)
  })

  get titleControl() {
    return this.form.get('title');
  }

  get amountControl() {
    return this.form.get('amount');
  }

  get interestRateControl() {
    return this.form.get('interestRate');
  }

  get investedOnControl() {
    return this.form.get('investedOn');
  }

  get isCreditControl() {
    return this.form.get('isCredit');
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.service.createInvestment(this.form.value).subscribe({
        next: (investment: Investment) => {
          this.form.reset();
          // TOTO: 
          this.router.navigate([`/finance/tracker/${investment.trackerId}`]);
        },
        error: (error: any) => {
          console.error('Error creating investment', error);
          // TODO: Notifiy user.
        }
      })
    }
  }

}
