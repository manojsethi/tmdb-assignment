import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Movie } from '../movies/movie.schema';
import { User } from '../users/user.schema';

export type MovieRatingDocument = MovieRating & Document;

@Schema({ timestamps: true })
export class MovieRating {
  @Prop({ type: Types.ObjectId, ref: Movie.name, required: true })
  movie: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;
}

export const MovieRatingSchema = SchemaFactory.createForClass(MovieRating);
