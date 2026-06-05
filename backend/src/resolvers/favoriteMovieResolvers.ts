import { AppDataSource } from "../data-source";
import { FavoriteMovie, User, Movie } from "../entity";
import jwt from "jsonwebtoken";

export const favoriteMovieResolvers = {
  Query: {
    favoriteMovies: async () => {
      const repo = AppDataSource.getRepository(FavoriteMovie);
      return repo.find({ relations: ["user", "movie"] });
    },
    favoriteMovie: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(FavoriteMovie);
      return repo.findOne({
        where: { favoriteMovieId: args.id },
        relations: ["user", "movie"],
      });
    },
  },
  Mutation: {
    createFavoriteMovie: async (_: any, args: { input: any }, ctx: any) => {
      console.log("createFavoriteMovie called with", args);
      try {
        const repo = AppDataSource.getRepository(FavoriteMovie);
        const input = { ...args.input };
        let { userId, movieId, ...rest } = input;

        // try to pick movieId/userId from request body if present (defensive)
        if ((!movieId || !userId) && ctx && ctx.req && ctx.req.body) {
          try {
            const vars = ctx.req.body?.variables;
            if (vars && vars.input) {
              movieId =
                movieId || vars.input.movieId || vars.input.movie?.movieId;
              userId = userId || vars.input.userId;
            }
          } catch (e) {
            // ignore
          }
        }

        // if no userId provided, try to extract from Authorization header
        if (!userId && ctx && ctx.req && ctx.req.headers) {
          const auth =
            ctx.req.headers.authorization || ctx.req.headers.Authorization;
          if (auth && typeof auth === "string") {
            const token = auth.replace(/^Bearer\s+/i, "");
            try {
              const payload: any = jwt.verify(
                token,
                process.env.JWT_SECRET || "dev_secret",
              );
              userId = payload.userId;
            } catch (e) {
              console.warn("Invalid JWT in createFavoriteMovie");
            }
          }
        }

        console.log(
          "createFavoriteMovie resolved userId=",
          userId,
          "movieId=",
          movieId,
        );

        const fm: any = repo.create(rest as any);
        if (userId) {
          const u = await AppDataSource.getRepository(User).findOne({
            where: { userId },
          });
          if (u) fm.user = u;
          else throw new Error("User not found");
        } else {
          throw new Error("userId is required");
        }
        if (movieId) {
          const m = await AppDataSource.getRepository(Movie).findOne({
            where: { movieId },
          });
          if (m) fm.movie = m;
          else throw new Error("Movie not found");
        } else {
          throw new Error("movieId is required");
        }

        // prevent duplicates: check if already exists
        const exists = await repo.findOne({
          where: {
            user: { userId: fm.user.userId },
            movie: { movieId: fm.movie.movieId },
          } as any,
        });
        if (exists) return exists;

        const savedRaw = await repo.save(fm as any);
        return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
      } catch (e: any) {
        console.error("createFavoriteMovie error", e);
        throw new Error(e.message || "Failed to create favorite");
      }
    },
    updateFavoriteMovie: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(FavoriteMovie);
      const input = { ...args.input };
      const { userId, movieId, ...rest } = input;
      if (userId) {
        const u = await AppDataSource.getRepository(User).findOne({
          where: { userId },
        });
        if (u) (rest as any).user = u;
      }
      if (movieId) {
        const m = await AppDataSource.getRepository(Movie).findOne({
          where: { movieId },
        });
        if (m) (rest as any).movie = m;
      }
      await repo.update({ favoriteMovieId: args.id }, rest as any);
      return repo.findOne({
        where: { favoriteMovieId: args.id },
        relations: ["user", "movie"],
      });
    },
    deleteFavoriteMovie: async (_: any, args: { id: string }, ctx: any) => {
      console.log("deleteFavoriteMovie called with", args);
      try {
        const repo = AppDataSource.getRepository(FavoriteMovie);
        const res = await repo.delete({ favoriteMovieId: args.id });
        return res.affected && res.affected > 0;
      } catch (e: any) {
        console.error("deleteFavoriteMovie error", e);
        throw new Error(e.message || "Failed to delete favorite");
      }
    },
  },
};

export default favoriteMovieResolvers;
