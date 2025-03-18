import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  movieId: number;

  @Prop()
  overview: string;

  @Prop({ type: [String], required: true })
  genre: string[];

  @Prop()
  releaseDate: string;

  @Prop()
  posterPath: string;

  @Prop({ default: 0 })
  rating: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
