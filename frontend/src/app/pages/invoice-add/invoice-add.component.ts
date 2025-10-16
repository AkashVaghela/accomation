import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppMaterialModule } from '../../material.module';

@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AppMaterialModule],
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss'],
})
export class InvoiceAddComponent implements OnInit {
  form!: FormGroup;
  get invoiceDetails(): FormArray {
    return this.form.get('invoiceDetails') as FormArray;
  }
  saving = false;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fromName: ['', Validators.required],
      fromAddress: ['', Validators.required],
      toName: ['', Validators.required],
      toAddress: ['', Validators.required],
      invoiceDetails: this.fb.array([], Validators.minLength(1)),
    });

    this.addItem();
  }

  newItem() {
    return this.fb.group({
      itemName: ['', Validators.required],
      itemQuantity: [1, [Validators.required, Validators.min(1)]],
      itemRate: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem() {
    this.invoiceDetails.push(this.newItem());
  }

  removeItem(index: number) {
    if (this.invoiceDetails.length <= 1) {
      this.snack.open('At least one item is required', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.invoiceDetails.removeAt(index);
  }

  itemTotal(i: number) {
    const c = this.invoiceDetails.at(i);
    const q = Number(c.get('itemQuantity')!.value) || 0;
    const r = Number(c.get('itemRate')!.value) || 0;
    return q * r;
  }

  invoiceTotal() {
    return this.invoiceDetails.controls.reduce((sum, c) => {
      const q = Number(c.get('itemQuantity')!.value) || 0;
      const r = Number(c.get('itemRate')!.value) || 0;
      return sum + q * r;
    }, 0);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Please fill required fields', 'Close', {
        duration: 2500,
      });
      return;
    }

    const payload = {
      fromName: this.form.value.fromName,
      fromAddress: this.form.value.fromAddress,
      toName: this.form.value.toName,
      toAddress: this.form.value.toAddress,
      invoiceDetails: this.form.value.invoiceDetails.map((d: any) => ({
        itemName: d.itemName,
        itemQuantity: Number(d.itemQuantity),
        itemRate: Number(d.itemRate),
      })),
    };

    this.saving = true;
    this.invoiceService.createInvoice(payload).subscribe({
      next: (res) => {
        this.saving = false;
        this.snack
          .open('Invoice created', 'View', { duration: 3000 })
          .onAction()
          .subscribe(() => {
            this.router.navigate(['/invoices', (res as any).id]);
          });
        // fallback: go to list
        void this.router.navigate(['/invoices']);
      },
      error: () => {
        this.saving = false;
        this.snack.open('Failed to create invoice', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
