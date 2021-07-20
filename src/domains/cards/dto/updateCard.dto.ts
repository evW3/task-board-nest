import { IsNumber, IsObject, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsNumber()
  userId: number;

  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsObject()
  date?: {
    from: string;
    to: string;
  }
}