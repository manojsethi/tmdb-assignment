import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MoviesService } from './movies/movies.service';
import { Movie } from './movies/movie.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { LoggerService } from './logger/logger.service';
import { envConfig } from '../config/env_configuration';
import { AllExceptionsFilter } from '../utils/all-exceptions.filter';

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost), logger),
  );

  const moviesService = app.get(MoviesService);
  const movieModel = app.get<Model<Movie>>(getModelToken(Movie.name));

  const count = await movieModel.countDocuments();

  if (count === 0) {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    moviesService.syncMoviesFromTMDB();
  }

  await app.listen(envConfig.PORT);
}

//eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
