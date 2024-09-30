import { IsUUID, IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  transferTypeId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  value: number;
}
