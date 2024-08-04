import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';
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
  updateNotificationId?: string;
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
}
