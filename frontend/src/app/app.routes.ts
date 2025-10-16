import { Routes } from '@angular/router';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { InvoiceAddComponent } from './pages/invoice-add/invoice-add.component';
import { InvoiceViewComponent } from './pages/invoice-view/invoice-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'invoices', pathMatch: 'full' },
  { path: 'invoices', loadComponent: () => Promise.resolve(InvoiceListComponent) },
  { path: 'invoices/add', loadComponent: () => Promise.resolve(InvoiceAddComponent) },
  { path: 'invoices/:id', loadComponent: () => Promise.resolve(InvoiceViewComponent) },
  { path: '**', redirectTo: 'invoices' },
];
