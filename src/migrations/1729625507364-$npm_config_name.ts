import { MigrationInterface, QueryRunner } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { compare, genSalt, hash } from 'bcrypt';

dotenvConfig({ path: '.env' });

export class $npmConfigName1729625507364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const username = process.env.SUPERADMIN_USERNAME;
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const phone = process.env.SUPERADMIN_PHONE;

    const salt = await genSalt(10);
    const hashedData = await hash(password, salt);

    await queryRunner.query(
      `INSERT INTO "user" (username, email, password, phone, "roleId") VALUES ('${username}', '${email}', '${hashedData}', '${phone}', (SELECT id FROM "role" WHERE name = 'superadmin'));`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
