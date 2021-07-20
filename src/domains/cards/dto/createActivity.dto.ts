import { IsString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  message: string;

  @IsString()
  date: string;
}