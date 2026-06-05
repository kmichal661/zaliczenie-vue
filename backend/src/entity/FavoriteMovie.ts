import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { User } from "./User";
import { Movie } from "./Movie";

@Entity({ name: "favorite_movies" })
export class FavoriteMovie {
  @PrimaryGeneratedColumn("uuid")
  favoriteMovieId!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Movie)
  movie!: Movie;
}
