import { Controller, Post, Body, Inject, Logger } from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { ServiceInjection } from '../../../libs/enum/service-injection.enum';
import { Events } from '../../../libs/enum/event.enum';
import { Status } from '../../../libs/enum/status.enum';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(ServiceInjection.KAFKA) private readonly kafkaService: ClientKafka,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  async createTransaction(@Body() transactionDto: CreateTransactionDto) {
    const transaction =
      await this.transactionsService.createTransaction(transactionDto);

    Logger.log(
      `Sending Transaction created ${transaction.id} with status ${Status.PENDING}...`,
    );

    this.kafkaService.emit(Events.TRANSACTION_CREATED, {
      transactionId: transaction.id,
      amount: transaction.value,
    });

    return {
      transactionExternalId: transaction.id,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  @EventPattern(Events.REJECTED_STATUS_TRANSACTION)
  async rejectedStatusUpdate(@Payload() message: { id: string }) {
    Logger.log(`Updating rejected transaction status event.`);

    const { id } = message;
    const status = Status.REJECTED;

    await this.transactionsService.updateTransactionStatus(id, status);

    Logger.log(`Transaction ${id} updated with status ${status}`);
  }

  @EventPattern(Events.APPROVED_STATUS_TRANSACTION)
  async approvedStatusUpdate(@Payload() message: { id: string }) {
    Logger.log(`Updating approved transaction status event.`);

    const { id } = message;
    const status = Status.APPROVED;

    await this.transactionsService.updateTransactionStatus(id, status);

    Logger.log(`Transaction ${id} updated with status ${status}`);
  }
}
