import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity('invoice_detail')
export class InvoiceDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ name: 'item_quantity' })
  itemQuantity: number;

  @Column({ name: 'item_rate' })
  itemRate: number;

  @Column({ name: 'total' })
  total: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(
    () => InvoiceEntity,
    (invoiceEntity) => invoiceEntity.invoiceDetails,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;
}
