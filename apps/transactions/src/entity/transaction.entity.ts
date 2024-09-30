import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column('int')
  value: number;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  transferTypeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  transactionType: TransactionType;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
  )
  transactionStatus: TransactionStatus;
}
