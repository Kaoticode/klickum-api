import { ApiProperty } from '@nestjs/swagger';

class MetaDataDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

class BasePaginationDto {
  @ApiProperty({ type: MetaDataDto })
  meta: MetaDataDto;
}

export abstract class PaginationDto<T> extends BasePaginationDto {
  abstract items: T[];
}
