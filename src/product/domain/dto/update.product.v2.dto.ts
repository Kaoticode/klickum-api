import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductV2Dto } from './create.product.v2.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  ProductStatusEnum,
  StatusType,
} from '../../../status/domain/status.enum';

class UpdatePartialProductDto extends PartialType(CreateProductV2Dto) {}

export class UpdateProductV2Dto extends UpdatePartialProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductStatusEnum)
  status: StatusType;
}
