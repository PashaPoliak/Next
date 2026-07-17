import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Author } from '../authors/authors.models';
import { User } from '../auth/auth.models';
import { Course } from '../courses/courses.models';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      autoLoadEntities: true,
      synchronize: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              rejectUnauthorized: false,
            }
          : false,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    TypeOrmModule.forFeature([Author, User, Course]),
  ],
})
export class DatabaseModule {}
