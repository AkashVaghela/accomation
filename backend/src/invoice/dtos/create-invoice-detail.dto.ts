import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateInvoiceDetailDto {
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(1)
  itemQuantity: number;

  @IsNumber()
  @Min(0)
  itemRate: number;
}
