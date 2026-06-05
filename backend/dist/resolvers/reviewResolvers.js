"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.reviewResolvers = {
    Query: {
        reviews: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Review);
            return repo.find({ relations: ["user", "movie"] });
        },
        review: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Review);
            return repo.findOne({
                where: { reviewId: args.id },
                relations: ["user", "movie"],
            });
        },
    },
    Mutation: {
        createReview: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Review);
            const input = { ...args.input };
            const { userId, movieId, rating, ...rest } = input;
            const r = repo.create(rest);
            if (userId) {
                const u = await data_source_1.AppDataSource.getRepository(entity_1.User).findOne({
                    where: { userId },
                });
                if (u)
                    r.user = u;
            }
            let movie = null;
            if (movieId) {
                movie = await data_source_1.AppDataSource.getRepository(entity_1.Movie).findOne({
                    where: { movieId },
                });
                if (movie)
                    r.movie = movie;
            }
            if (typeof rating === "number") {
                r.rating = rating;
            }
            const savedRaw = await repo.save(r);
            // After saving review, update movie averageRating and ratingCount
            try {
                if (movie) {
                    const reviewRepo = data_source_1.AppDataSource.getRepository(entity_1.Review);
                    const movieReviews = await reviewRepo.find({
                        where: { movie: { movieId: movie.movieId } },
                    });
                    if (movieReviews.length) {
                        const sum = movieReviews.reduce((s, rv) => s + rv.rating, 0);
                        movie.ratingCount = movieReviews.length;
                        movie.averageRating = parseFloat((sum / movieReviews.length).toFixed(1));
                        await data_source_1.AppDataSource.getRepository(entity_1.Movie).save(movie);
                    }
                }
            }
            catch (e) {
                console.error("Failed to update movie ratings after review:", e);
            }
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateReview: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Review);
            const input = { ...args.input };
            const { userId, movieId, ...rest } = input;
            if (userId) {
                const u = await data_source_1.AppDataSource.getRepository(entity_1.User).findOne({
                    where: { userId },
                });
                if (u)
                    rest.user = u;
            }
            if (movieId) {
                const m = await data_source_1.AppDataSource.getRepository(entity_1.Movie).findOne({
                    where: { movieId },
                });
                if (m)
                    rest.movie = m;
            }
            await repo.update({ reviewId: args.id }, rest);
            return repo.findOne({
                where: { reviewId: args.id },
                relations: ["user", "movie"],
            });
        },
        deleteReview: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Review);
            const res = await repo.delete({ reviewId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.reviewResolvers;
