import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body() body: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(body);
  }

  @Get(':id')
  getInvoiceById(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get()
  getAllInvoices(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.invoiceService.getAllInvoices({
      page: Number(page),
      limit: Number(limit),
      search,
      sortBy,
      order,
    });
  }
}
