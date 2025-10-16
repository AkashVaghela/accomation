import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceDetailDto } from './create-invoice-detail.dto';

export class CreateInvoiceDto {
  @IsNotEmpty()
  fromName: string;

  @IsNotEmpty()
  fromAddress: string;

  @IsNotEmpty()
  toName: string;

  @IsNotEmpty()
  toAddress: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceDetailDto)
  invoiceDetails: CreateInvoiceDetailDto[];
}
