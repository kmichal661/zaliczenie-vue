import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
} from "typeorm";

import { Genre } from "./Genre";
import { Director } from "./Director";
import { Actor } from "./Actor";
import { Review } from "./Review";
import { VodPlatform } from "./VodPlatform";
import { Country } from "./Country";
import { Language } from "./Language";
import { MovieCast } from "./MovieCast";

@Entity({ name: "movies" })
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  movieId!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "text" })
  shortDescription!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ nullable: true })
  posterUrl!: string;

  @Column({ nullable: true })
  trailerUrl!: string;

  @Column({ type: "int" })
  releaseYear!: number;

  @Column({ type: "int", nullable: true })
  durationMinutes!: number;

  @Column({ type: "decimal", precision: 3, scale: 1, default: 0 })
  averageRating!: number;

  @Column({ default: 0 })
  ratingCount!: number;

  @Column({ default: false })
  isPublished!: boolean;

  @Column({ type: "date", nullable: true })
  releaseDate!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres!: Genre[];

  @ManyToOne(() => Director, (director) => director.movies)
  director!: Director;

  @OneToMany(() => Review, (review) => review.movie)
  reviews!: Review[];

  @ManyToMany(() => VodPlatform, (vod) => vod.movies)
  @JoinTable()
  vodPlatforms!: VodPlatform[];

  @ManyToOne(() => Country, (country) => country.movies)
  country!: Country;

  @ManyToOne(() => Language, (language) => language.movies)
  language!: Language;

  @OneToMany(() => MovieCast, (cast) => cast.movie)
  cast!: MovieCast[];
}
