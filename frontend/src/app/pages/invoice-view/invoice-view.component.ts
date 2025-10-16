import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../../interfaces/invoice.interface';
import { AppMaterialModule } from '../../material.module';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, RouterModule, AppMaterialModule],
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
})
export class InvoiceViewComponent implements OnInit {
  invoice?: Invoice;
  loading = false;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      void this.router.navigate(['/invoices']);
      return;
    }
    this.loading = true;
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (res) => {
        this.invoice = res;
        if (!this.invoice.totalAmount) {
          this.invoice.totalAmount = (this.invoice.invoiceDetails || []).reduce(
            (s, d) => s + d.itemQuantity * d.itemRate,
            0
          );
        }
        (this.invoice.invoiceDetails || []).forEach(
          (d) => (d.total = d.itemQuantity * d.itemRate)
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        void this.router.navigate(['/invoices']);
      },
    });
  }
}
