import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { validate } from 'class-validator';
import { ProductPropsDto } from '../domain/dto/product.props.dto';

export interface ProductProps {
  categoryId?: string;
  promoted?: boolean;
}

export const ProductPropsParams = createParamDecorator(
  async (data, ctx: ExecutionContext): Promise<ProductProps> => {
    const req: Request = ctx.switchToHttp().getRequest();

    const queryParams = {
      categoryId: req.query.categoryId,
      promoted: req.query.promoted ? req.query.promoted === 'true' : undefined,
    };

    const productPropsDto = plainToInstance(ProductPropsDto, queryParams);

    const errors = await validate(productPropsDto);

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(messages);
    }

    return { ...productPropsDto } as ProductProps;
  },
);
