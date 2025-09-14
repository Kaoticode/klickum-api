import { Country } from '../address/model/country.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class $npmConfigName1757821870917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const countryRepo =
      queryRunner.connection.getRepository<Country>('country');

    interface DataItem {
      nombre: string;
      name: string;
      nom: string;
      iso2: string;
      iso3: string;
      phone_code: number;
    }

    const filePath = path.join(__dirname, '../../countries.json');

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found, countries.json required');
    }
    const data: DataItem[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const item of data) {
      const country = new Country();
      country.name = item.name.toLowerCase();
      country.nom = item.nom.toLowerCase();
      country.nombre = item.nombre.toLowerCase();
      country.iso2 = item.iso2;
      country.iso3 = item.iso3;
      country.phone_code = item.phone_code.toString();
      await countryRepo.save(country);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
