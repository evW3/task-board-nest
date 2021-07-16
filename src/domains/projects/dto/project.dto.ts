import { IsNumber, IsString } from 'class-validator';

export class ProjectDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;
}