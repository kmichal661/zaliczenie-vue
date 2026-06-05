import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { User } from "./User";
import { Movie } from "./Movie";

@Entity({ name: "reviews" })
export class Review {
  @PrimaryGeneratedColumn("uuid")
  reviewId!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "int" })
  rating!: number; // 1-5

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie!: Movie;
}
