import { Routes } from '@angular/router';
import { DashboardComponent as InvestmentDashboardPage } from './features/investment-tracker/dashboard/dashboard.component';
import { NewTrackerComponent as NewInvestmentTrackerPage } from './features/investment-tracker/new-tracker/new-tracker.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'finance/investment-tracker',
        pathMatch: 'full'
    },
    {
        path: 'finance/investment-tracker',
        component: InvestmentDashboardPage,
        title: 'My Apps | Investment Tracker'
    },
    {
        path: 'finance/new-tracker',
        component: NewInvestmentTrackerPage,
        title: 'My Apps | New Investment Tracker'
    }
];
