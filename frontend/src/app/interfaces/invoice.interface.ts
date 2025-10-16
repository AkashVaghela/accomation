export interface InvoiceDetail {
  itemName: string;
  itemQuantity: number;
  itemRate: number;
  total?: number;
}

export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  createdAt?: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  invoiceDetails: InvoiceDetail[];
  totalAmount?: number;
}
