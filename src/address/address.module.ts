import { Module } from '@nestjs/common';
import { Country } from './model/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './model/address.entity';
import { City } from './model/city.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Country, City, Address])],
  providers: [AddressService],
  exports: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
