import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { bdMainPath } from '@helpers/common.helpers';

import { CoreModule } from '@core/core.module';

import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CoreModule.forRoot({
      algorithm: 'sha256',
      timeLiving: 3600 * 24, // one day
      filesFolder: bdMainPath,
    }),
    AuthModule,
    CoursesModule,
    AuthorsModule,
    UsersModule,
  ],
})
export class AppModule {}
