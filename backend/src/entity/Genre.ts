import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import { Movie } from "./Movie";

@Entity({ name: "genres" })
export class Genre {
  @PrimaryGeneratedColumn("uuid")
  genreId!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies!: Movie[];
}
