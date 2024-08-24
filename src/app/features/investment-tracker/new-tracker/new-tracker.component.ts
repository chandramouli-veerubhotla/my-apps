import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { InvestmentTracker, InvestmentTrackerService } from '../../../services/investment-tracker.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { catchError, debounceTime, first, map, Observable, of, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-new-tracker',
  standalone: true,
  imports: [RouterLink, MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './new-tracker.component.html',
  styleUrl: './new-tracker.component.scss'
})
export class NewTrackerComponent implements OnInit {

  CURRENCIES: Array<string> = ['INR', 'USD', 'EURO']

  constructor(private service: InvestmentTrackerService, private router: Router) { }

  ngOnInit(): void {
    
  }

  // Form Group for the new tracker form allows to fetch information from the user.
  form: FormGroup = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)], [this.uniqueTitleValidatorFn()]),
    defaultCurrency: new FormControl<string>('INR'),
    defaultInterestRate: new FormControl<number|null>(null, [Validators.min(0), Validators.max(100)]),
    description: new FormControl<string|null>(null, [Validators.maxLength(200)])    
  })

  uniqueTitleValidatorFn() {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        debounceTime(300),
        switchMap((title: string) => this.service.checkTrackerExists(title)),
        map((unique: boolean) => (!unique ? null : {uniqueTitleValidation: true})),
        catchError(() => of({uniqueTitleValidation: true})),
        first()
      )
    }
  } 

  get titleControl() {
    return this.form.get('title');
  }

  get defaultInterestRate() {
    return this.form.get('defaultInterestRate');
  }

  get description() {
    return this.form.get('description');
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.service.createTracker(this.form.value).subscribe({
        next: (tracker: InvestmentTracker) => {
          this.form.reset();
          this.router.navigate([`/finance/tracker/${tracker.id}`]);
        },
        error: (error: any) => {
          console.error('Error creating tracker', error);
          // TODO: Notifiy user.
        }
      })
    }
  }

}
