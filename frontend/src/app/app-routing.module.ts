import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { InvoiceAddComponent } from './pages/invoice-add/invoice-add.component';
import { InvoiceViewComponent } from './pages/invoice-view/invoice-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'invoices', pathMatch: 'full' },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/add', component: InvoiceAddComponent },
  { path: 'invoices/:id', component: InvoiceViewComponent },
  { path: '**', redirectTo: 'invoices' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
