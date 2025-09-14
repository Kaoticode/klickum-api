import { Module } from '@nestjs/common';
import { Country } from './model/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [],
  controllers: [],
})
export class AddressModule {}
