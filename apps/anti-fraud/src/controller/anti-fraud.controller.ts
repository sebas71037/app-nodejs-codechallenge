import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Events } from 'apps/libs/enum/event.enum';
import { ServiceInjection } from 'apps/libs/enum/service-injection.enum';
import { Status } from 'apps/libs/enum/status.enum';

@Controller()
export class AntiFraudController {
  constructor(
    @Inject(ServiceInjection.KAFKA) private readonly kafkaService: ClientKafka,
  ) {}

  @EventPattern(Events.TRANSACTION_CREATED)
  async handleTransactionCreated(
    @Payload() message: { transactionId: string; amount: number },
  ) {
    Logger.log(`Transaction created, validating with anti-fraud system event.`);
    const { transactionId, amount } = message;

    const status = amount > 1000 ? Status.REJECTED : Status.APPROVED;

    Logger.log(`Sending Transaction ${transactionId} with status ${status}...`);

    this.kafkaService.emit(Events.TRANSACTION_STATUS_UPDATED, {
      id: transactionId,
      status,
    });
  }
}
