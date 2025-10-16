import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceDetailEntity } from './entities/invoice-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, InvoiceDetailEntity])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
