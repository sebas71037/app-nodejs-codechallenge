import { Module } from '@nestjs/common';
import { AntiFraudController } from './controller/anti-fraud.controller';
import { AntiFraudService } from './service/anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceInjection } from 'apps/libs/enum/service-injection.enum';
import { KafkaGroup } from 'apps/libs/enum/kafka-group.enum';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from 'apps/environment';

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
            groupId: KafkaGroup.ANTI_FRAUD,
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
