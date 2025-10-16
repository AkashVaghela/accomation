import { Invoice } from '../interfaces/invoice.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private base = '/api/invoice';

  constructor(private http: HttpClient) {}

  createInvoice(payload: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(this.base, payload);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.base}/${id}`);
  }

  getAllInvoices(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }): Observable<
    | { data: Invoice[]; total: number; page?: number; limit?: number }
    | Invoice[]
  > {
    let params = new HttpParams();
    if (options?.page) params = params.set('page', `${options.page}`);
    if (options?.limit) params = params.set('limit', `${options.limit}`);
    if (options?.search) params = params.set('search', options.search);
    if (options?.sortBy) params = params.set('sortBy', options.sortBy);
    if (options?.order) params = params.set('order', options.order);
    return this.http.get<any>(this.base, { params });
  }
}
