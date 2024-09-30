import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from '../entity/transaction-type.entity';
import { TransactionStatus } from '../entity/transaction-status.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private types = [{ name: 'Debit' }, { name: 'Credit' }];
  private statuses = [
    { name: 'pending' },
    { name: 'approved' },
    { name: 'rejected' },
  ];

  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async onModuleInit() {
    await this.seedTransactionTypes();
    await this.seedTransactionStatuses();
  }

  private async seedTransactionTypes() {
    for (const type of this.types) {
      const existingType = await this.transactionTypeRepository.findOneBy({
        name: type.name,
      });
      if (!existingType) {
        await this.transactionTypeRepository.save(type);
      }
    }
  }

  private async seedTransactionStatuses() {
    for (const status of this.statuses) {
      const existingStatus = await this.transactionStatusRepository.findOneBy({
        name: status.name,
      });
      if (!existingStatus) {
        await this.transactionStatusRepository.save(status);
      }
    }
  }
}
