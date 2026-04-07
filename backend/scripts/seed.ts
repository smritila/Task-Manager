import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { seedUsers } from '../src/seed/seed-data';

interface SeededUserRow {
  id: string;
  email: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    DatabaseModule,
  ],
})
class SeedModule {}

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });
  const logger = new Logger('Seed');

  try {
    const databaseService = app.get(DatabaseService);

    await databaseService.query('BEGIN');

    const seededUsers: SeededUserRow[] = [];

    for (const user of seedUsers) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      const result = await databaseService.query<SeededUserRow>(
        `INSERT INTO public.users (first_name, last_name, email, password_hash)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email)
         DO UPDATE
         SET first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             password_hash = EXCLUDED.password_hash,
             updated_at = CURRENT_TIMESTAMP
         RETURNING id, email`,
        [user.firstName, user.lastName, user.email, passwordHash],
      );

      seededUsers.push(result.rows[0]);
    }

    const seededUserIds = seededUsers.map((user) => Number(user.id));

    await databaseService.query(
      `DELETE FROM public.tasks
       WHERE created_by = ANY($1::bigint[])`,
      [seededUserIds],
    );

    for (const user of seedUsers) {
      const seededUser = seededUsers.find(
        (seededRecord) => seededRecord.email === user.email,
      );

      if (!seededUser) {
        throw new Error(`Seeded user ${user.email} was not found after upsert.`);
      }

      for (const task of user.tasks) {
        await databaseService.query(
          `INSERT INTO public.tasks (
             task_status,
             task_creation_date,
             start_date_time,
             end_date_time,
             task_title,
             task_desc,
             created_by
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            task.status,
            task.createdAt,
            task.startDateTime ?? null,
            task.endDateTime ?? null,
            task.title,
            task.description,
            Number(seededUser.id),
          ],
        );
      }
    }

    await databaseService.query('COMMIT');

    const taskCount = seedUsers.reduce((count, user) => count + user.tasks.length, 0);
    logger.log(`Seeded ${seedUsers.length} users and ${taskCount} tasks.`);
  } catch (error) {
    await app.get(DatabaseService).query('ROLLBACK');
    throw error;
  } finally {
    await app.close();
  }
}

void seed();
