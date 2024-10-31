import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from '../common/services/baseRepository';
import { DataSource } from 'typeorm';
import { Ticket } from './model/ticket.entity';

@Injectable({ scope: Scope.REQUEST })
export class TicketRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create({
    userId,
    raffleId,
    code,
  }: {
    userId: string;
    raffleId: string;
    code: string;
  }) {
    const ticket = this.getRepository(Ticket).create({
      user: { id: userId },
      raffle: { id: raffleId },
      code,
    });

    return await this.getRepository(Ticket).save(ticket);
  }

  async existUserOnticket(userId: string, raffleId: string) {
    const query = this.getRepository(Ticket).createQueryBuilder('ticket');
    return await query
      .where('ticket.userId = :userId', { userId })
      .andWhere('ticket.raffleId = :raffleId', { raffleId })
      .getOne();
  }

  getQueryBuilder() {
    return this.getRepository(Ticket).createQueryBuilder('ticket');
  }
}
