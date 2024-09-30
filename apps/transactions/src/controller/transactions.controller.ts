import { Controller, Post, Body, Inject, Logger, Get } from '@nestjs/common';
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

  @Get()
  async getHello(): Promise<string> {
    const transactions = await this.transactionsService.getAll();
    Logger.log(transactions);
    return `Hello world :3`;
  }

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

  @EventPattern(Events.TRANSACTION_STATUS_UPDATED)
  async handleStatusUpdate(@Payload() message: { id: string; status: Status }) {
    Logger.log(`Updating transaction status event.`);

    const { id, status } = message;

    await this.transactionsService.updateTransactionStatus(id, status);

    Logger.log(`Transaction ${id} updated with status ${status}`);
  }
}
