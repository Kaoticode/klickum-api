import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class ProductPropsDto {
  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  promoted: boolean;
}
