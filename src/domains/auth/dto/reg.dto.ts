import { IsString } from 'class-validator';

export class RegDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
  
  @IsString()
  fullName: string;
}