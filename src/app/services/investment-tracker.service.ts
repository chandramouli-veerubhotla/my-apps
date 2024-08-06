import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { first, from, map, Observable, of, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface InvestmentTracker {
  id?: string;
  title: string;
  defaultCurrency: string;
  defaultInterestRate?: number;
  description?: string;
  createdOn?: Date;
  updatedOn?: Date;
  updateMessage?: string;
}


export interface Investment {
  id?: string;
  title: string;
  amount: number;
  interestRate: number;
  investedOn: Date;
  isCredit: boolean;
  trackerId: string;
  createdOn?: Date;
}


@Injectable({
  providedIn: 'root'
})
export class InvestmentTrackerService {

  constructor(private db: NgxIndexedDBService) { }

  /**
   * Retrieves a list of investment trackers.
   * 
   * @returns {Observable<InvestmentTracker[]>} The list of investment trackers sorted by the updatedOn property in descending order.
   */
  listTrackers(): Observable<InvestmentTracker[]> {
    return this.db.getAll<InvestmentTracker>('investmentTrackers')
    .pipe(
      map((trackers: InvestmentTracker[]) => {
        return trackers.sort((a: InvestmentTracker, b: InvestmentTracker) => { 
          let aDate = a?.updatedOn?.getTime() ?? 0;
          let bDate = b?.updatedOn?.getTime() ?? 0;
          return bDate - aDate;
        })
      })
    );
  }

  /**
   * Retrieves an InvestmentTracker object by its ID.
   * 
   * @param id - The ID of the InvestmentTracker to retrieve.
   * @returns An Observable that emits the retrieved InvestmentTracker object.
   */
  getTracker(id: string): Observable<InvestmentTracker> {
    return this.db.getByKey<InvestmentTracker>('investmentTrackers', id);
  }
  
  /**
   * Creates a new investment tracker.
   * 
   * @param tracker - The investment tracker object to be created.
   * @returns An observable that emits the created investment tracker with id, createdOn, updatedOn, updatedMessage updated.
   */
  createTracker(tracker: InvestmentTracker): Observable<InvestmentTracker> {
    const newTracker: InvestmentTracker = {
      ...tracker,
      id: uuidv4(),
      createdOn: new Date(),
      updatedOn: new Date(),
      updateMessage: 'Just Created'
    };
    return this.db.add('investmentTrackers', newTracker)
  }

  /**
   * Updates an investment tracker with the provided information.
   * 
   * @param tracker - The investment tracker to update.
   * @param updateMessage - The message to associate with the update.
   * @returns An Observable that emits the updated investment tracker, or null if the tracker does not exist.
   * @throws An error if the tracker does not have an id.
   */
  updateTracker(tracker: InvestmentTracker, updateMessage: string): Observable<InvestmentTracker | null> {
    if (tracker.id == null) {
      return new Observable((observer) => {
        observer.error('Cannot update fund without an id');
      });
    }

    return this.getTracker(tracker.id).pipe(
      first(),
      switchMap((existingTracker: InvestmentTracker | null) => {
        if (existingTracker) {
          const newTracker: InvestmentTracker = {
            ...existingTracker,
            title: tracker.title,
            defaultInterestRate: tracker.defaultInterestRate,
            description: tracker.description,
            updatedOn: new Date(),
            updateMessage: updateMessage
          };

          return from(this.db.update('investmentTrackers', newTracker)).pipe(
            map(() => newTracker)
          );
        } else {
          return of(null);
        }
      })
    );
  }

  /**
   * Deletes investment trackers based on the provided IDs.
   * 
   * @param ids - An array of string IDs representing the trackers to be deleted.
   * @returns An Observable that emits the result of the deletion operation.
   */
  deleteTrackers(ids: string[]): Observable<any> {
    return this.db.bulkDelete('investmentTrackers', ids);
  }

  /**
   * Checks if an investment tracker exists with the given title.
   * 
   * @param title - The title of the investment tracker to check.
   * @returns An Observable that emits a boolean indicating whether the investment tracker exists or not.
   */
  checkTrackerExists(title: string): Observable<boolean> {
    return this.db.getByIndex<InvestmentTracker|null>('investmentTrackers', 'title', title)
    .pipe(
      map((tracker: InvestmentTracker | null) => {
        return tracker != null;
      })
    );
  }

  /**
   * Retrieves a list of investments for a given tracker ID.
   * 
   * @param trackerId - The ID of the tracker to retrieve investments for.
   * @returns An Observable that emits a Map object where the keys are normalized dates (ISO string) and the values are arrays of investments.
   */
  listInvestments(trackerId: string): Observable<Map<string, Investment[]>> {
    return this.db.getAllByIndex<Investment>('investments', 'trackerId', IDBKeyRange.only(trackerId)).pipe(
      map(investments => this.sortAndGroupInvestments(investments))
    );
  }

  /**
   * Sorts and groups the given investments by date.
   * 
   * @param investments - The array of investments to be sorted and grouped.
   * @returns A Map object where the keys are normalized dates (ISO string) and the values are arrays of investments.
   */
  private sortAndGroupInvestments(investments: Investment[]): Map<string, Investment[]> {
      // Parse dates and sort investments by date in ascending order (latest investments last)
      investments.sort((a, b) => {
        const dateA = new Date(a.investedOn ?? 0).getTime();
        const dateB = new Date(b.investedOn ?? 0).getTime();
        return dateA - dateB;
      });

    // Group investments by normalized date (ISO string as key)
    const groupedInvestments: Map<string, Investment[]> = investments.reduce((acc, investment) => {
      const date = investment.investedOn
      // Normalize date to remove time part and use ISO string
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      if (!acc.has(normalizedDate)) {
        acc.set(normalizedDate, []);
      }
      acc.get(normalizedDate)!.push(investment);
      return acc;
    }, new Map<string, Investment[]>());
  
    return groupedInvestments;
  }
  
  
  /**
   * Saves an investment and returns an observable of the saved investment.
   *
   * @param investment - The investment to be saved.
   * @returns An observable of the saved investment.
   * @throws Error - If the tracker does not exist.
   */
  createInvestment(investment: Investment): Observable<Investment> {
    investment.id = uuidv4();
    investment.createdOn = new Date();

    return this.getTracker(investment.trackerId).pipe(
      switchMap((tracker: InvestmentTracker | null) => {
        if (!tracker) {
          throw new Error('Tracker does not exist');
        }
        return this.db.add<Investment>('investments', investment).pipe(
          switchMap(() => {
            let updateMessage = ''
            if (investment.isCredit) {
              updateMessage = `You invested ${tracker.defaultCurrency} ${investment.amount} on ${investment.investedOn.toDateString()}`;
            } else {
              updateMessage = `You withdrew ${tracker.defaultCurrency} ${investment.amount} on ${investment.investedOn.toDateString()}`;
            }
            return this.updateTracker(tracker, updateMessage).pipe(
              map(() => investment)
            );
          })
        );
      })
    );
  }



}
