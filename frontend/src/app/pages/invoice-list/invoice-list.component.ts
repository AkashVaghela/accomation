import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../material.module';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../interfaces/invoice.interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AppMaterialModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns = [
    'invoiceNumber',
    'createdAt',
    'fromName',
    'toName',
    'totalAmount',
    'actions',
  ];
  page = 1;
  limit = 10;
  total = 0;
  loading = false;
  search = new FormControl('');
  sortBy = 'createdAt';
  order: 'ASC' | 'DESC' = 'DESC';
  isMobile = false;

  get sortDirection(): SortDirection {
    return this.order === 'ASC' ? 'asc' : 'desc';
  }

  constructor(
    private invoiceService: InvoiceService,
    private breakpoint: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpoint
      .observe([Breakpoints.Handset])
      .subscribe((s) => (this.isMobile = s.matches));
    this.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.page = 1;
      this.load();
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.invoiceService
      .getAllInvoices({
        page: this.page,
        limit: this.limit,
        search: this.normalizeSearch(this.search.value),
        sortBy: this.sortBy,
        order: this.order,
      })
      .subscribe({
        next: (res) => {
          // support two shapes: { data, total } or array
          if (Array.isArray(res)) {
            this.invoices = res;
            this.total = res.length;
          } else {
            this.invoices = res.data ?? [];
            this.total = res.total ?? this.invoices.length;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  private normalizeSearch(
    value: string | null | undefined
  ): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    return trimmed;
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.limit = e.pageSize;
    this.load();
  }

  changeSort(sort: Sort) {
    if (!sort.active) return;
    this.sortBy = sort.active;
    this.order = (sort.direction?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';
    this.load();
  }

  viewInvoice(id?: number) {
    if (!id) return;
    void this.router.navigate(['/invoices', id]);
  }

  addInvoice() {
    void this.router.navigate(['/invoices/add']);
  }

  invoiceSum(inv: Invoice): number {
    if (typeof inv.totalAmount === 'number') return inv.totalAmount;
    if (Array.isArray(inv.invoiceDetails)) {
      return inv.invoiceDetails.reduce((sum, d) => {
        const q = Number((d as any).itemQuantity) || 0;
        const r = Number((d as any).itemRate) || 0;
        return sum + q * r;
      }, 0);
    }
    return 0;
  }
}
