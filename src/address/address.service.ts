import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Address } from './model/address.entity';
import { Country } from './model/country.entity';
import { City } from './model/city.entity';
import { CreateAddressDto } from './domain/dto/create.address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async paginateCountry(
    options: IPaginationOptions,
  ): Promise<Pagination<Country>> {
    return paginate<Country>(this.countryRepository, options);
  }

  async paginateCity(
    options: IPaginationOptions,
    iso3?: string,
  ): Promise<Pagination<City>> {
    const queryBuilder = this.cityRepository.createQueryBuilder('city');

    if (iso3) {
      queryBuilder.where('city.country.iso3 = :iso3', { iso3 });
    }

    queryBuilder.orderBy('city.name', 'ASC');

    return paginate<City>(queryBuilder, options);
  }

  async retrieveOrCreateCity(countryId: number, name: string) {
    if (!(await this.countryRepository.exists({ where: { id: countryId } }))) {
      throw new BadRequestException('Country not found');
    }

    const city = await this.cityRepository.findOne({
      where: { name, country: { id: countryId } },
    });

    if (city) return city;

    return this.cityRepository.save({ name, country: { id: countryId } });
  }

  async createAddress(
    userId: string,
    {
      countryId,
      cityName,
      streetName,
      streetNumber,
      zipcode,
    }: CreateAddressDto,
  ) {
    const city = await this.retrieveOrCreateCity(countryId, cityName);
    const address = await this.addressRepository.save({
      user: { id: userId },
      city,
      streetName,
      streetNumber,
      zipcode,
    });

    return address;
  }

  async paginateAddressByUser(userId: string, options: IPaginationOptions) {
    const queryBuilder = this.addressRepository.createQueryBuilder('address');

    queryBuilder
      .leftJoinAndSelect('address.city', 'city')
      .leftJoinAndSelect('city.country', 'country')
      .where('address.user.id = :userId', { userId });

    return paginate<Address>(queryBuilder, options);
  }
}
