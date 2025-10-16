import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceEntity } from '../entities/invoice.entity';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { InvoiceDetailEntity } from '../entities/invoice-detail.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createInvoice(data: CreateInvoiceDto): Promise<InvoiceEntity | null> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = queryRunner.manager.create(InvoiceEntity, {
        fromName: data.fromName,
        fromAddress: data.fromAddress,
        toName: data.toName,
        toAddress: data.toAddress,
      });

      const savedInvoice = await queryRunner.manager.save(
        InvoiceEntity,
        invoice,
      );

      const invoiceDetails = data.invoiceDetails.map((item) =>
        queryRunner.manager.create(InvoiceDetailEntity, {
          invoice: savedInvoice,
          itemName: item.itemName,
          itemQuantity: item.itemQuantity,
          itemRate: item.itemRate,
          total: item.itemQuantity * item.itemRate,
        }),
      );

      await queryRunner.manager.save(InvoiceDetailEntity, invoiceDetails);

      await queryRunner.commitTransaction();

      const fullInvoice = await this.invoiceRepository.findOne({
        where: { id: savedInvoice.id },
        relations: ['invoiceDetails'],
      });

      return fullInvoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating invoice:', error);
      throw new InternalServerErrorException('Failed to create invoice');
    } finally {
      await queryRunner.release();
    }
  }

  async getInvoiceById(id: number): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['invoiceDetails'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async getAllInvoices(params: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) {
    const { page, limit, search, sortBy, order } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.invoiceDetails', 'details');

    if (search) {
      const raw = search;
      const noSpace = search.replace(/\s+/g, '');
      const digits = noSpace;
      const isNumeric = /^\d+$/.test(digits);

      queryBuilder.where(
        "REPLACE(invoice.fromName, ' ', '') LIKE :searchNoSpace OR REPLACE(invoice.toName, ' ', '') LIKE :searchNoSpace OR invoice.fromName LIKE :searchRaw OR invoice.toName LIKE :searchRaw OR invoice.fromAddress LIKE :searchRaw OR invoice.toAddress LIKE :searchRaw",
        { searchNoSpace: `%${noSpace}%`, searchRaw: `%${raw}%` },
      );

      if (isNumeric) {
        queryBuilder.orWhere('invoice.id = :id', { id: Number(digits) });
      }

      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) {
        const start = new Date(parsed);
        start.setHours(0, 0, 0, 0);
        const end = new Date(parsed);
        end.setHours(23, 59, 59, 999);
        queryBuilder.orWhere('invoice.createdAt BETWEEN :start AND :end', {
          start,
          end,
        });
      }
    }

    queryBuilder.orderBy(`invoice.${sortBy}`, order);

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      total,
      page,
      limit,
      data,
    };
  }
}
