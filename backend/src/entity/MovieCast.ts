import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { Movie } from "./Movie";
import { Actor } from "./Actor";

@Entity({ name: "movie_cast" })
export class MovieCast {
  @PrimaryGeneratedColumn("uuid")
  castId!: string;

  @Column()
  roleName!: string;

  @ManyToOne(() => Movie, (movie) => movie.cast)
  movie!: Movie;

  @ManyToOne(() => Actor, (actor) => actor.movieRoles)
  actor!: Actor;
}
