import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Events } from 'apps/libs/enum/event.enum';
import { ServiceInjection } from 'apps/libs/enum/service-injection.enum';

@Controller()
export class AntiFraudController {
  constructor(
    @Inject(ServiceInjection.KAFKA) private readonly kafkaService: ClientKafka,
  ) {}

  @EventPattern(Events.TRANSACTION_CREATED)
  async handleTransactionCreated(
    @Payload() message: { transactionId: string; amount: number },
  ) {
    Logger.log(`Transaction created, validating with Anti-Fraud system event.`);
    const { transactionId, amount } = message;

    const rejected = amount > 1000;

    Logger.log(
      `Sending ${rejected ? 'Rejected' : 'Approved'} Transaction ${transactionId}`,
    );

    this.kafkaService.emit(
      rejected
        ? Events.REJECTED_STATUS_TRANSACTION
        : Events.APPROVED_STATUS_TRANSACTION,
      {
        id: transactionId,
      },
    );
  }
}
