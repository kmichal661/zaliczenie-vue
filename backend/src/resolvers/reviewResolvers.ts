import { AppDataSource } from "../data-source";
import { Review, User, Movie } from "../entity";

export const reviewResolvers = {
  Query: {
    reviews: async () => {
      const repo = AppDataSource.getRepository(Review);
      return repo.find({ relations: ["user", "movie"] });
    },
    review: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Review);
      return repo.findOne({
        where: { reviewId: args.id },
        relations: ["user", "movie"],
      });
    },
  },
  Mutation: {
    createReview: async (_: any, args: { input: any }) => {
      const repo = AppDataSource.getRepository(Review);
      const input = { ...args.input };
      const { userId, movieId, rating, ...rest } = input;
      const r: any = repo.create(rest as any);
      if (userId) {
        const u = await AppDataSource.getRepository(User).findOne({
          where: { userId },
        });
        if (u) r.user = u;
      }
      let movie: Movie | null = null;
      if (movieId) {
        movie = await AppDataSource.getRepository(Movie).findOne({
          where: { movieId },
        });
        if (movie) r.movie = movie;
      }
      if (typeof rating === "number") {
        r.rating = rating;
      }
      const savedRaw = await repo.save(r as any);

      // After saving review, update movie averageRating and ratingCount
      try {
        if (movie) {
          const reviewRepo = AppDataSource.getRepository(Review);
          const movieReviews = await reviewRepo.find({
            where: { movie: { movieId: movie.movieId } } as any,
          });
          if (movieReviews.length) {
            const sum = movieReviews.reduce((s, rv) => s + rv.rating, 0);
            movie.ratingCount = movieReviews.length;
            movie.averageRating = parseFloat(
              (sum / movieReviews.length).toFixed(1),
            );
            await AppDataSource.getRepository(Movie).save(movie);
          }
        }
      } catch (e) {
        console.error("Failed to update movie ratings after review:", e);
      }

      return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    },

    updateReview: async (_: any, args: { id: string; input: any }) => {
      const repo = AppDataSource.getRepository(Review);
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
      await repo.update({ reviewId: args.id }, rest as any);
      return repo.findOne({
        where: { reviewId: args.id },
        relations: ["user", "movie"],
      });
    },
    deleteReview: async (_: any, args: { id: string }) => {
      const repo = AppDataSource.getRepository(Review);
      const res = await repo.delete({ reviewId: args.id });
      return res.affected && res.affected > 0;
    },
  },
};

export default reviewResolvers;
