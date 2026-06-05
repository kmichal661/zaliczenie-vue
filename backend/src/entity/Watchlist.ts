import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

import { User } from "./User";
import { Movie } from "./Movie";

@Entity({ name: "watchlists" })
export class Watchlist {
  @PrimaryGeneratedColumn("uuid")
  watchlistId!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Movie)
  movie!: Movie;

  @Column({ default: false })
  watched!: boolean;
}
