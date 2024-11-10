import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { TransactionInterceptor } from "src/common/services/transaction.interceptor";
import { OrderService } from "./order.service";
import { CreateItemDto } from "../item/domain/dto/createItem.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { AuthorizationGuard } from "src/auth/guard/authorization.guard";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProcessOrderDto } from "./domain/dto/processOrder.dto";

@ApiTags("order")
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Post()
  //@Permissions(Action.orderCreate)
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: [CreateItemDto] })
  async createOrder(
    @Body(new ParseArrayPipe({ items: CreateItemDto }))
      data: CreateItemDto[],
    @Request() req
  ) {
    if (data.length === 0) {
      throw new BadRequestException("Data array must not be empty.");
    }
    return await this.orderService.create(req.user.sub, data);
  }

  @Get("history")
  //@Permissions(Action.orderRead)
  @ApiQuery({ name: "page", type: Number, required: false })
  @ApiQuery({ name: "limit", type: Number, required: false })
  async getUserOrders(
    @Request() req,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.orderService.paginateUserOrders(req.user.sub, {
      page,
      limit
    });
  }

  @Get()
  //@Permissions(Action.orderAdminRead)
  @ApiQuery({ name: "page", type: Number, required: false })
  @ApiQuery({ name: "limit", type: Number, required: false })
  async getAllOrders(
    @Request() req,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    limit = limit > 100 ? 100 : limit;

    return await this.orderService.paginateAllOrders({
      page,
      limit
    });
  }

  //@Permissions(Action.orderRead)
  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Post("process")
  async processOrder(@Body() processOrderDto: ProcessOrderDto) {
    return this.orderService.processOrder(processOrderDto);
  }

  @Patch("admin/cancell/:id")
  async cancell(@Param("id", ParseUUIDPipe) id: string) {
    return this.orderService.cancellOrder(id);
  }

  @Patch("cancell/:id")
  async admincancell(@Param("id", ParseUUIDPipe) id: string, @Request() req) {
    return this.orderService.cancellUserOrder(id, req.user.sub);
  }

}
