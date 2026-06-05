"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieCastResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.movieCastResolvers = {
    Query: {
        movieCasts: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.MovieCast);
            return repo.find({ relations: ["movie", "actor"] });
        },
        movieCast: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.MovieCast);
            return repo.findOne({
                where: { castId: args.id },
                relations: ["movie", "actor"],
            });
        },
    },
    Mutation: {
        createMovieCast: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.MovieCast);
            const input = { ...args.input };
            const { movieId, actorId, ...rest } = input;
            const mc = repo.create(rest);
            if (movieId) {
                const m = await data_source_1.AppDataSource.getRepository(entity_1.Movie).findOne({
                    where: { movieId },
                });
                if (m)
                    mc.movie = m;
            }
            if (actorId) {
                const a = await data_source_1.AppDataSource.getRepository(entity_1.Actor).findOne({
                    where: { actorId },
                });
                if (a)
                    mc.actor = a;
            }
            const savedRaw = await repo.save(mc);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateMovieCast: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.MovieCast);
            const input = { ...args.input };
            const { movieId, actorId, ...rest } = input;
            if (movieId) {
                const m = await data_source_1.AppDataSource.getRepository(entity_1.Movie).findOne({
                    where: { movieId },
                });
                if (m)
                    rest.movie = m;
            }
            if (actorId) {
                const a = await data_source_1.AppDataSource.getRepository(entity_1.Actor).findOne({
                    where: { actorId },
                });
                if (a)
                    rest.actor = a;
            }
            await repo.update({ castId: args.id }, rest);
            return repo.findOne({
                where: { castId: args.id },
                relations: ["movie", "actor"],
            });
        },
        deleteMovieCast: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.MovieCast);
            const res = await repo.delete({ castId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.movieCastResolvers;
