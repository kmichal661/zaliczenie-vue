import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import { Movie } from "./Movie";

@Entity({ name: "vod_platforms" })
export class VodPlatform {
  @PrimaryGeneratedColumn("uuid")
  vodPlatformId!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  logoUrl!: string;

  @ManyToMany(() => Movie, (movie) => movie.vodPlatforms)
  movies!: Movie[];
}
