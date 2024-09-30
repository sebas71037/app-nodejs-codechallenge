import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { KafkaConsumer } from 'apps/libs/enum/kafka-consumer.enum';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_CLIENT_BROKER || 'kafka:9092'],
        },
        consumer: {
          groupId: KafkaConsumer.ANTI_FRAUD,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
