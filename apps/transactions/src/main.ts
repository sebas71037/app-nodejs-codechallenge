import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { KafkaConsumer } from '../../libs/enum/kafka-consumer.enum';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_CLIENT_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: KafkaConsumer.TRANSACTIONS,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(+process.env.PORT || 3000);
}
bootstrap();
