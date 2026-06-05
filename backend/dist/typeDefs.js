"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql


type User {
  userId: ID
  email: String
  firstName: String
  lastName: String
  bio: String
  avatarUrl: String
}

type Movie {
  movieId: ID
    title: String
    slug: String
    shortDescription: String
    description: String
    releaseDate: String
    averageRating: Float
    ratingCount: Int
    isPublished: Boolean
    releaseYear: Int
    durationMinutes: Int
    posterUrl: String
        trailerUrl: String
        director: Director
    genres: [Genre]
    vodPlatforms: [VodPlatform]
    cast: [MovieCast]
    reviews: [Review]
}

type Director {
    directorId: ID
    firstName: String
    lastName: String
    bio: String
    photoUrl: String
    birthDate: String
    movies: [Movie]
}

type Genre {
    genreId: ID
    name: String
    movies: [Movie]
}

type Actor {
    actorId: ID
    firstName: String
    lastName: String
    bio: String
    photoUrl: String
    birthDate: String
    movieRoles: [MovieCast]
}

type MovieCast {
    castId: ID
    roleName: String
    movie: Movie
    actor: Actor
}

type Review {
    reviewId: ID
    rating: Int
    content: String
    createdAt: String
    movie: Movie
    user: User
}

type Watchlist {
    watchlistId: ID
    user: User
    movie: Movie
    watched: Boolean
}

type FavoriteMovie {
    favoriteMovieId: ID
    user: User
    movie: Movie
}

type Country {
    countryId: ID
    name: String
    movies: [Movie]
}

type Language {
    languageId: ID
    name: String
    movies: [Movie]
}

type VodPlatform {
    vodPlatformId: ID
    name: String
    logoUrl: String
    movies: [Movie]
}


type Query {
  users: [User]
    user(id: ID!): User
    movies: [Movie]
    movie(id: ID!): Movie
    movieCasts: [MovieCast]
    movieCast(id: ID!): MovieCast
    actors: [Actor]
    actor(id: ID!): Actor
    directors: [Director]
    director(id: ID!): Director
    genres: [Genre]
    genre(id: ID!): Genre
    reviews: [Review]
    review(id: ID!): Review
    watchlists: [Watchlist]
    watchlist(id: ID!): Watchlist
    favoriteMovies: [FavoriteMovie]
    favoriteMovie(id: ID!): FavoriteMovie
    countries: [Country]
    country(id: ID!): Country
    languages: [Language]
    language(id: ID!): Language
    vodPlatforms: [VodPlatform]
    vodPlatform(id: ID!): VodPlatform

}

input UserInput {
  email: String
  password: String
  firstName: String
  lastName: String
  bio: String
  avatarUrl: String
}

input MovieInput {
  title: String
  slug: String
  shortDescription: String
  description: String
  posterUrl: String
  trailerUrl: String
  releaseYear: Int
  durationMinutes: Int
  isPublished: Boolean
  releaseDate: String
  directorId: ID
  genreIds: [ID]
  vodPlatformIds: [ID]
  countryId: ID
  languageId: ID
}

input DirectorInput {
  firstName: String
  lastName: String
  bio: String
  photoUrl: String
  birthDate: String
}

input GenreInput {
  name: String
}

input ActorInput {
  firstName: String
  lastName: String
  bio: String
  photoUrl: String
  birthDate: String
}

input MovieCastInput {
  roleName: String
  movieId: ID
  actorId: ID
}

input ReviewInput {
  rating: Int
  content: String
  movieId: ID
  userId: ID
}

input WatchlistInput {
  userId: ID
  movieId: ID
  watched: Boolean
}

input FavoriteMovieInput {
  userId: ID
  movieId: ID
}

input CountryInput {
  name: String
}

input LanguageInput {
  name: String
}

input VodPlatformInput {
  name: String
  logoUrl: String
}

type Mutation {
  register(input: UserInput): AuthPayload
  login(email: String!, password: String!): AuthPayload
  updateUser(id: ID!, input: UserInput): User
  createUser(input: UserInput): User
  deleteUser(id: ID!): Boolean

  createMovie(input: MovieInput): Movie
  updateMovie(id: ID!, input: MovieInput): Movie
  deleteMovie(id: ID!): Boolean

  createDirector(input: DirectorInput): Director
  updateDirector(id: ID!, input: DirectorInput): Director
  deleteDirector(id: ID!): Boolean

  createGenre(input: GenreInput): Genre
  updateGenre(id: ID!, input: GenreInput): Genre
  deleteGenre(id: ID!): Boolean

  createActor(input: ActorInput): Actor
  updateActor(id: ID!, input: ActorInput): Actor
  deleteActor(id: ID!): Boolean

  createMovieCast(input: MovieCastInput): MovieCast
  updateMovieCast(id: ID!, input: MovieCastInput): MovieCast
  deleteMovieCast(id: ID!): Boolean

  createReview(input: ReviewInput): Review
  updateReview(id: ID!, input: ReviewInput): Review
  deleteReview(id: ID!): Boolean

  createWatchlist(input: WatchlistInput): Watchlist
  updateWatchlist(id: ID!, input: WatchlistInput): Watchlist
  deleteWatchlist(id: ID!): Boolean

  createFavoriteMovie(input: FavoriteMovieInput): FavoriteMovie
  updateFavoriteMovie(id: ID!, input: FavoriteMovieInput): FavoriteMovie
  deleteFavoriteMovie(id: ID!): Boolean

  createCountry(input: CountryInput): Country
  updateCountry(id: ID!, input: CountryInput): Country
  deleteCountry(id: ID!): Boolean

  createLanguage(input: LanguageInput): Language
  updateLanguage(id: ID!, input: LanguageInput): Language
  deleteLanguage(id: ID!): Boolean

  createVodPlatform(input: VodPlatformInput): VodPlatform
  updateVodPlatform(id: ID!, input: VodPlatformInput): VodPlatform
  deleteVodPlatform(id: ID!): Boolean
}

type AuthPayload {
  token: String
  user: User
}

`;
