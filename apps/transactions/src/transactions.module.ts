import { Module } from '@nestjs/common';
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsService } from './service/transactions.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './module/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from '../../environment';
import { KafkaGroup } from '../../libs/enum/kafka-group.enum';
import { ServiceInjection } from '../../libs/enum/service-injection.enum';
import { TransactionType } from './entity/transaction-type.entity';
import { TransactionStatus } from './entity/transaction-status.entity';
import { SeedService } from './service/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
    }),
    ClientsModule.register([
      {
        name: ServiceInjection.KAFKA,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_CLIENT_BROKER || 'kafka:9092'],
          },
          consumer: {
            groupId: KafkaGroup.TRANSACTIONS,
          },
        },
      },
    ]),
    DatabaseModule,
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, SeedService],
})
export class TransactionsModule {}
