import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1729984480822 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    enum StatusEnum {
      PENDING = 'pending',
      PROCESSING = 'processing',
      SHIPPED = 'shipped',
      DELIVERED = 'delivered',
      CANCELLED = 'cancelled',
      REFENDED = 'refunded',
      COMPLETED = 'completed',
      ONHOLD = 'onHold',
      AVAILABLE = 'available',
      OUTOFSTOCK = 'outOfStock',
      DISCONTINUED = 'discontinued',
    }

    const dataset = Object.values(StatusEnum);
    dataset.forEach(async (name) => {
      await queryRunner.query(`INSERT INTO status (name) VALUES ('${name}')`);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
