import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Movie } from "./Movie";

@Entity({ name: "languages" })
export class Language {
  @PrimaryGeneratedColumn("uuid")
  languageId!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Movie, (movie) => movie.language)
  movies!: Movie[];
}
