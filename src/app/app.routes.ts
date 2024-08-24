import { Routes } from '@angular/router';
import { DashboardComponent as InvestmentDashboardPage } from './features/investment-tracker/dashboard/dashboard.component';
import { NewTrackerComponent as NewInvestmentTrackerPage } from './features/investment-tracker/new-tracker/new-tracker.component';
import { TrackerComponent as InvestmentTrackerPage } from './features/investment-tracker/tracker/tracker.component';
import { NewInvestmentComponent as NewInvestmentPage } from './features/investment-tracker/new-investment/new-investment.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'finance/investment-tracker',
        pathMatch: 'full'
    },
    {
        path: 'finance/investment-tracker',
        component: InvestmentDashboardPage,
        title: 'My Apps | Investment Tracker',
        data: { animation: 'investmentDashboardPage' }
    },
    {
        path: 'finance/new-tracker',
        component: NewInvestmentTrackerPage,
        title: 'My Apps | New Investment Tracker',
        data: { animation: 'newTrackerPage' }
    },
    {
        path: 'finance/tracker/:id',
        component: InvestmentTrackerPage,
        title: 'My Apps | Investment Tracker',
        data: { animation: 'investmentTrackerPage' }
    },
    {
        path: 'finance/new-investment/:id',
        component: NewInvestmentPage,
        title: 'My Apps | New Investment'
    }
];
