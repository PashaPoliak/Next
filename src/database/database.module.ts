import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.DATABASE_HOST;

@Module({
  imports: [
    TypeOrmModule.forRoot(
      isDevelopment
        ? {
            type: 'sqlite',
            database: 'db.sqlite',
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
          }
        : {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB,
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
            ssl: {
              rejectUnauthorized: false,
            },
            retryAttempts: 5,
            retryDelay: 3000,
          },
    ),
  ],
})
export class DatabaseModule {}
