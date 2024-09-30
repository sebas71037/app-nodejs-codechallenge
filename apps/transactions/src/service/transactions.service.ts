import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entity/transaction.entity';
import { TransactionType } from '../entity/transaction-type.entity';
import { TransactionStatus } from '../entity/transaction-status.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Status } from '../../../libs/enum/status.enum';
import { TransactionTypes } from '../../../libs/enum/transaction-type.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  async createTransaction(transactionData: CreateTransactionDto) {
    const transactionType = await this.transactionTypeRepository.findOne({
      where: { id: TransactionTypes.DEBIT },
    });

    if (!transactionType) {
      throw new NotFoundException(
        `TransactionType with ID ${TransactionTypes.DEBIT} not found`,
      );
    }

    const transactionStatus = await this.transactionStatusRepository.findOne({
      where: { id: Status.PENDING },
    });

    if (!transactionStatus) {
      throw new NotFoundException(
        `TransactionStatus with ID ${Status.PENDING} not found`,
      );
    }

    const transactionBody = {
      ...transactionData,
      transactionStatus: transactionStatus,
      TransactionType: transactionType,
    };

    const transaction = this.transactionsRepository.create(transactionBody);

    return await this.transactionsRepository.save(transaction);
  }

  async updateTransactionStatus(id: string, status: Status) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`transaction with ID ${id} not found`);
    }

    const transactionStatus = await this.transactionStatusRepository.findOne({
      where: { id: status },
    });

    if (!transactionStatus) {
      throw new NotFoundException(
        `TransactionStatus with ID ${status} not found`,
      );
    }

    transaction.transactionStatus = transactionStatus;

    return await this.transactionsRepository.save(transaction);
  }
}
