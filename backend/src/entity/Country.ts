import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Movie } from "./Movie";

@Entity({ name: "countries" })
export class Country {
  @PrimaryGeneratedColumn("uuid")
  countryId!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Movie, (movie) => movie.country)
  movies!: Movie[];
}
