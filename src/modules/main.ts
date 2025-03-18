import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MoviesService } from './movies/movies.service';
import { Movie } from './movies/movie.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const moviesService = app.get(MoviesService);
  const movieModel = app.get<Model<Movie>>(getModelToken(Movie.name));

  const count = await movieModel.countDocuments();

  if (count === 0) {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    moviesService.syncMoviesFromTMDB();
  }

  await app.listen(process.env.TMDB_PORT || 9000);
}

//eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
