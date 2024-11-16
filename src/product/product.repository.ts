import { BaseRepository } from "../common/services/baseRepository";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { DataSource } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Product } from "./model/product.entity";

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async update(id: string, updateOrderDto: Partial<Product>): Promise<Product> {
    await this.getRepository(Product).update({ id }, updateOrderDto);
    return await this.getRepository(Product).findOne({ where: { id } });
  }
}