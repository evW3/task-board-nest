import { IsNumber, IsString } from 'class-validator';

export class WorkplaceDto {
  @IsString()
  name: string;

  @IsNumber()
  userId: number;
}