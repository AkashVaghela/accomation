import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from './material.module';

import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { InvoiceAddComponent } from './pages/invoice-add/invoice-add.component';
import { InvoiceViewComponent } from './pages/invoice-view/invoice-view.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceAddComponent,
    InvoiceViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
