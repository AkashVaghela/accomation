import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InvoiceDetailEntity } from './invoice-detail.entity';

@Entity('invoice')
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'from_name' })
  fromName: string;

  @Column({ name: 'from_address' })
  fromAddress: string;

  @Column({ name: 'to_name' })
  toName: string;

  @Column({ name: 'to_address' })
  toAddress: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @OneToMany(
    () => InvoiceDetailEntity,
    (invoiceDetailEntity) => invoiceDetailEntity.invoice,
  )
  invoiceDetails: InvoiceDetailEntity[];
}
