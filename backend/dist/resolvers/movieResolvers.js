"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
const typeorm_1 = require("typeorm");
exports.movieResolvers = {
    Query: {
        movies: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Movie);
            return repo.find({
                relations: [
                    "genres",
                    "director",
                    "reviews",
                    "reviews.user",
                    "vodPlatforms",
                    "country",
                    "language",
                    "cast",
                    "cast.actor",
                ],
            });
        },
        movie: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Movie);
            console.log("movie resolver called with id=", args?.id);
            try {
                const m = await repo.findOne({
                    where: { movieId: args.id },
                    relations: [
                        "genres",
                        "director",
                        "reviews",
                        "reviews.user",
                        "vodPlatforms",
                        "country",
                        "language",
                        "cast",
                        "cast.actor",
                    ],
                });
                if (!m)
                    console.warn("movie not found for id=", args?.id);
                return m;
            }
            catch (e) {
                console.error("movie resolver error for id=", args?.id, e);
                throw e;
            }
        },
    },
    Mutation: {
        createMovie: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Movie);
            const input = { ...args.input };
            const { directorId, countryId, languageId, genreIds, vodPlatformIds, ...rest } = input;
            const movie = repo.create({
                ...rest,
                slug: rest.slug ||
                    rest.title
                        ?.toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, ""),
            });
            if (directorId) {
                const d = await data_source_1.AppDataSource.getRepository(entity_1.Director).findOne({
                    where: { directorId },
                });
                if (d)
                    movie.director = d;
            }
            if (countryId) {
                const c = await data_source_1.AppDataSource.getRepository(entity_1.Country).findOne({
                    where: { countryId },
                });
                if (c)
                    movie.country = c;
            }
            if (languageId) {
                const l = await data_source_1.AppDataSource.getRepository(entity_1.Language).findOne({
                    where: { languageId },
                });
                if (l)
                    movie.language = l;
            }
            if (genreIds && Array.isArray(genreIds) && genreIds.length) {
                const genres = await data_source_1.AppDataSource.getRepository(entity_1.Genre).find({
                    where: { genreId: (0, typeorm_1.In)(genreIds) },
                });
                movie.genres = genres;
            }
            if (vodPlatformIds &&
                Array.isArray(vodPlatformIds) &&
                vodPlatformIds.length) {
                const v = await data_source_1.AppDataSource.getRepository(entity_1.VodPlatform).find({
                    where: { vodPlatformId: (0, typeorm_1.In)(vodPlatformIds) },
                });
                movie.vodPlatforms = v;
            }
            const savedRaw = await repo.save(movie);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateMovie: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Movie);
            const input = { ...args.input };
            const { directorId, countryId, languageId, genreIds, vodPlatformIds, ...rest } = input;
            if (directorId) {
                const d = await data_source_1.AppDataSource.getRepository(entity_1.Director).findOne({
                    where: { directorId },
                });
                if (d)
                    rest.director = d;
            }
            if (countryId) {
                const c = await data_source_1.AppDataSource.getRepository(entity_1.Country).findOne({
                    where: { countryId },
                });
                if (c)
                    rest.country = c;
            }
            if (languageId) {
                const l = await data_source_1.AppDataSource.getRepository(entity_1.Language).findOne({
                    where: { languageId },
                });
                if (l)
                    rest.language = l;
            }
            if (genreIds) {
                const genres = await data_source_1.AppDataSource.getRepository(entity_1.Genre).find({
                    where: { genreId: (0, typeorm_1.In)(genreIds) },
                });
                rest.genres = genres;
            }
            if (vodPlatformIds) {
                const v = await data_source_1.AppDataSource.getRepository(entity_1.VodPlatform).find({
                    where: { vodPlatformId: (0, typeorm_1.In)(vodPlatformIds) },
                });
                rest.vodPlatforms = v;
            }
            await repo.update({ movieId: args.id }, rest);
            return repo.findOne({
                where: { movieId: args.id },
                relations: [
                    "genres",
                    "director",
                    "reviews",
                    "reviews.user",
                    "vodPlatforms",
                    "country",
                    "language",
                    "cast",
                    "cast.actor",
                ],
            });
        },
        deleteMovie: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Movie);
            const res = await repo.delete({ movieId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.movieResolvers;
