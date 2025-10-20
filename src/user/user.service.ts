import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from './domain/dto/signupUser.dto';
import { MessageStrategy } from '../messageGateway/domain/messageStratergy';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(MessageStrategy.name)
    private readonly messageStrategy: MessageStrategy,
  ) {}

  async create(createUserDto: SignupUserDto | User): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async update(id: string, updateUserDto: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });

    await this.userRepository.update({ id }, updateUserDto);

    if (updateUserDto.balance) {
      this.messageStrategy.sendMessage({
        number: user.phone,
        useCase: 'balanceUpdate',
      });
    }

    return user;
  }

  async validateUserBalanceToFuturePurchase(userId: string, amount: number) {
    const user = await this.findOneById(userId);
    if (Number(user.balance) < Number(amount)) {
      throw new BadRequestException('Not enough balance. required: ' + amount);
    }
    return user;
  }

  async updateUserBalanceTransaction(
    user: User,
    valueToCharge: number,
    manager: EntityManager,
  ) {
    user.balance -= valueToCharge;
    await manager.save(User, user);
  }

  async updateUserBalanceDeposit(
    user: User,
    valueToDeposit: number,
    manager: EntityManager,
  ) {
    if (isNaN(user.balance)) {
      throw new Error('Invalid user balance: ' + user.balance);
    }
    user.balance = Number(user.balance) + Number(valueToDeposit);

    console.log('Updated user balance:', user.balance);

    //await manager.save(User, user);
  }
}
