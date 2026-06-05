"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchlistResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.watchlistResolvers = {
    Query: {
        watchlists: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Watchlist);
            return repo.find({ relations: ["user", "movie"] });
        },
        watchlist: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Watchlist);
            return repo.findOne({
                where: { watchlistId: args.id },
                relations: ["user", "movie"],
            });
        },
    },
    Mutation: {
        createWatchlist: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Watchlist);
            const input = { ...args.input };
            const { userId, movieId, ...rest } = input;
            const w = repo.create(rest);
            if (userId) {
                const u = await data_source_1.AppDataSource.getRepository(entity_1.User).findOne({
                    where: { userId },
                });
                if (u)
                    w.user = u;
            }
            if (movieId) {
                const m = await data_source_1.AppDataSource.getRepository(entity_1.Movie).findOne({
                    where: { movieId },
                });
                if (m)
                    w.movie = m;
            }
            const savedRaw = await repo.save(w);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateWatchlist: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Watchlist);
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
            await repo.update({ watchlistId: args.id }, rest);
            return repo.findOne({
                where: { watchlistId: args.id },
                relations: ["user", "movie"],
            });
        },
        deleteWatchlist: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Watchlist);
            const res = await repo.delete({ watchlistId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.watchlistResolvers;
