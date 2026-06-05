import { userResolvers } from "./userResolvers";
import movieResolvers from "./movieResolvers";
import actorResolvers from "./actorResolvers";
import directorResolvers from "./directorResolvers";
import genreResolvers from "./genreResolvers";
import movieCastResolvers from "./movieCastResolvers";
import reviewResolvers from "./reviewResolvers";
import favoriteMovieResolvers from "./favoriteMovieResolvers";
import watchlistResolvers from "./watchlistResolvers";
import countryResolvers from "./countryResolvers";
import languageResolvers from "./languageResolvers";
import vodPlatformResolvers from "./vodPlatformResolvers";

export const resolvers = [
  userResolvers,
  movieResolvers,
  actorResolvers,
  directorResolvers,
  genreResolvers,
  movieCastResolvers,
  reviewResolvers,
  favoriteMovieResolvers,
  watchlistResolvers,
  countryResolvers,
  languageResolvers,
  vodPlatformResolvers,
];

export default resolvers;
