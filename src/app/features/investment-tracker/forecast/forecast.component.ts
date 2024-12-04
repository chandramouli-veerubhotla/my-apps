import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import { Investment, InvestmentTrackerService } from '../../../services/investment-tracker.service';
import { CurrencyPipe, DatePipe } from '@angular/common';


export interface ForecastInformation {
  numInvestments: number;
  tillDate: Date;
  finalValue?: number;
  finalValueWithInterest?: number;
  totalInvested?: number;
  totalInvestedWithInterest?: number;
  totalWithdrew?: number;
  totalWithdrewWithInterest?: number;
}

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent implements OnInit {

  investments!: Investment[]
  forecastInfo!: ForecastInformation
  form: FormGroup = new FormGroup({
    tillDate: new FormControl<Date|null>(null, [Validators.required])
  })

  get tillDateControl() {
    return this.form.get('tillDate')
  }

  constructor(private ref: MatBottomSheetRef<ForecastComponent>, private service: InvestmentTrackerService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: {trackerId: string}) { }

  ngOnInit(): void {
    this.fetchInvestments()
    this.form.get('tillDate')?.setValue(new Date())
  }

  close(value: any) {
    this.ref.dismiss(value);
  }

  fetchInvestments() {
    this.service.listInvestmentsArray(this.data.trackerId).subscribe({
      next: (investments: Investment[]) => {
        this.investments = investments
      }
    })
  }

/**
 * Calculates the compounded amount of an investment up to a specified date.
 *
 * @param investment - The investment object containing the amount, interest rate, and start date.
 * @param tillDate - The date up to which the interest is to be calculated.
 * @returns The compounded amount including interest up to the specified date.
 * @throws Error if the investment start date is after the forecast date.
 */
calculateInterest(investment: Investment, tillDate: Date): number {
  if (investment.investedOn > tillDate) {
    throw new Error('Investment start date is after the forecast date');
  }

  // Calculate the total investment horizon in days.
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const tillDateWithoutTime = new Date(tillDate.getFullYear(), tillDate.getMonth(), tillDate.getDate());
  const investedOnWithoutTime = new Date(investment.investedOn.getFullYear(), investment.investedOn.getMonth(), investment.investedOn.getDate());
  let horizon = Math.round((tillDateWithoutTime.getTime() - investedOnWithoutTime.getTime()) / oneDay) + 1;
  const interestRate = investment.interestRate / 100;
  let compoundedAmount = investment.amount;

  // Handle investments that are one year or shorter
  if (horizon <= 365) {
    const interestAmount = compoundedAmount * interestRate * (horizon / 365);
    compoundedAmount += interestAmount;
    return compoundedAmount;
  }

  // For investments longer than one year
  // Calculate interest for the first partial period up to the first March 31
  let march31 = new Date(investment.investedOn.getFullYear(), 2, 31); // March 31 of the starting year
  if (investment.investedOn > march31) {
    march31.setFullYear(march31.getFullYear() + 1);
  }

  // Calculate interest for the first partial period
  const partialDays = (march31.getTime() - investment.investedOn.getTime()) / (24 * 60 * 60 * 1000) + 1;
  const partialInterest = compoundedAmount * interestRate * (partialDays / 365);
  compoundedAmount += partialInterest;
  horizon -= partialDays;

  // Calculate interest for full years
  const fullYears = Math.floor(horizon / 365);
  if (fullYears > 0) {
    compoundedAmount *= Math.pow(1 + interestRate, fullYears);
    horizon -= fullYears * 365;
    march31.setFullYear(march31.getFullYear() + fullYears);
  }

  // Calculate interest for the final partial period after the last full year
  const lastPartialInterest = compoundedAmount * interestRate * (horizon / 365);
  compoundedAmount += lastPartialInterest;
  
  return compoundedAmount;
}


  forecast() {
    if (this.form.valid && this.investments != null) {
      const tillDate = new Date(this.form.value.tillDate);

      let finalValue = 0.;
      let finalValueWithInterest = 0.;
      
      let totalInvested = 0.;
      let totalInvestedWithInterest = 0.;

      let totalWithdrew = 0.;
      let totalWithdrewWithInterest = 0.;
  
      let totalCredit = 0;
      let totalDebit = 0;
      let totalCreditInterest = 0;
      let totalDebitInterest = 0;

      this.investments.forEach((investment: Investment) => {
        let totalAmount = this.calculateInterest(investment, tillDate);
        let totalInterest = totalAmount - investment.amount;
        
        if (investment.isCredit) {
          finalValue += investment.amount;
          totalInvested += investment.amount;
          totalInvestedWithInterest += totalInterest;
          finalValueWithInterest += totalAmount;
        } else {
          finalValue -= investment.amount;
          totalWithdrew += investment.amount;
          totalWithdrewWithInterest += totalInterest;
          finalValueWithInterest -= totalAmount;
        }
      })

      let forecastInformation: ForecastInformation = {
        numInvestments: this.investments.length,
        tillDate: tillDate,
        finalValue: finalValue,
        finalValueWithInterest: finalValueWithInterest,
        totalInvested: totalInvested,
        totalInvestedWithInterest: totalInvestmentWithInterest,
        totalWithdrew: totalWithdrew,
        totalWithdrewWithInterest: totalWithdrewWithInterest
      }

      this.forecastInfo = forecastInformation;
    }
  }
  
  

}
