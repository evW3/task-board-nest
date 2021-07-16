import { IsNumber, IsString } from 'class-validator';

export class ListsDto {
  @IsString()
  name: string;

  @IsNumber()
  position: number;
}