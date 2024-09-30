import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresProvider } from './postgresql.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresProvider,
    }),
  ],
})
export class DatabaseModule {}
