import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { MovieRatingsModule } from './movie_ratings/movie_ratings.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerService } from './logger/logger.service';
import { LoggerModule } from './logger/logger.module';
import { envConfig } from '../config/env_configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(envConfig.MONGO_URI || ''),
    MoviesModule,
    AuthModule,
    MovieRatingsModule,
    LoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [LoggerService],
})
export class AppModule {}
