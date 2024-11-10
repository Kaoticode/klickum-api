// orders.repository.ts

import { Inject, Injectable, Scope } from "@nestjs/common";
import { Request } from "express";
import { BaseRepository } from "../common/services/baseRepository";
import { DataSource } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { User } from "./model/user.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async getUser(id: string) {
    return await this.getRepository(User).findOne({
      where: { id }
    });
  }

  getQueryBuilder() {
    return this.getRepository(User).createQueryBuilder("user");
  }

  async update(id: string, updateUserDto: Partial<User>) {
    await this.getRepository(User).update({ id }, updateUserDto);
    return await this.getRepository(User).findOne({ where: { id } });
  }
}
