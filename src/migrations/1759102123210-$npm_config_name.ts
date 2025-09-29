import { ProductSizeList } from '../product/domain/product.metadata.interface';
import { Size } from '../product/model/size.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1759102123210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sizeRepo = queryRunner.connection.getRepository<Size>(Size.name);

    for (const size of ProductSizeList) {
      const exist = await sizeRepo.findOne({ where: { label: size } });
      if (!exist) {
        await sizeRepo.save({ label: size });
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
