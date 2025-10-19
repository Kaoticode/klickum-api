import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserCartQuery } from './query/get.user.cart.query';
import { AddItemsCartDto } from './domain/dto/add.items.cart.dot';
import { AddItemsCartCommand } from './command/add.items.command';
import { RemoveItemsCommand } from './command/remove.items.command';
import { EditItemCommand } from './command/edit.amount.command';
import { CartDtoDcos } from '../common/domain/dto/cart.detail.reponse.dto';
import { CheckoutItemsCommand } from './command/checkout.items.command';
import { CheckoutItemsDto } from './domain/dto/checkoutItems.dto';

@ApiTags('cart')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @ApiResponse({ type: CartDtoDcos })
  async getMeCart(@Request() req) {
    return await this.queryBus.execute(new GetUserCartQuery(req.user.sub));
  }

  @Post('add')
  @ApiBody({ type: [AddItemsCartDto] })
  async addItems(
    @Body(new ParseArrayPipe({ items: AddItemsCartDto }))
    items: AddItemsCartDto[],
    @Request() req,
  ) {
    if (items.length === 0) {
      throw new BadRequestException('Items array must not be empty.');
    }
    return await this.commandBus.execute(
      new AddItemsCartCommand(req.user.sub, items),
    );
  }

  @Delete()
  @ApiBody({ type: [String] })
  async remove(
    @Body(new ParseArrayPipe({ items: String }))
    items: string[],
    @Request() req,
  ) {
    if (items.length === 0) {
      throw new BadRequestException('Items array must not be empty.');
    }
    return await this.commandBus.execute(
      new RemoveItemsCommand(req.user.sub, items),
    );
  }

  @Patch()
  @ApiBody({ type: AddItemsCartDto })
  async editItems(@Body() updateItemsDto: AddItemsCartDto, @Request() req) {
    return await this.commandBus.execute(
      new EditItemCommand(req.user.sub, updateItemsDto),
    );
  }

  @Post('checkout')
  async checkout(@Request() req, @Body() { addressId }: CheckoutItemsDto) {
    return await this.commandBus.execute(
      new CheckoutItemsCommand(req.user.sub, addressId),
    );
  }
}
