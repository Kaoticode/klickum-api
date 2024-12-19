import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "../common/services/baseRepository";
import { DataSource } from "typeorm";
import { Raffle } from "./model/raffle.entity";

@Injectable({ scope: Scope.REQUEST })
export class RaffleRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(createRaffleDto: Partial<Raffle>) {
    const raffle = this.getRepository(Raffle).create({
      name: createRaffleDto.name,
      price: createRaffleDto.price,
      amount: createRaffleDto.amount,
      status: createRaffleDto.status
    });

    return await this.getRepository(Raffle).save(raffle);
  }

  async getRaffleQueryBuilder() {
    return this.getRepository(Raffle).createQueryBuilder("raffle");
  }

  async findOnebyId(id: string) {
    return await this.getRepository(Raffle).findOne({
      where: { id },
      relations: ["rewards", "tickets", "tickets.user", "status"],
      select: {
        tickets: {
          id: true,
          code: true,
          isActive: true,
          created_at: true,
          updated_at: true,
          user: {
            id: true,
            username: true,
            phone: true,
            role: {
              id: false,
              name: false
            }
          }
        }
      }
    });
  }

  async update(id: string, updateRaffleDto: Partial<Raffle>) {
    await this.getRepository(Raffle).update({ id }, updateRaffleDto);
  }
}
