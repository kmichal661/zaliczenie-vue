"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteMovieResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.favoriteMovieResolvers = {
    Query: {
        favoriteMovies: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.FavoriteMovie);
            return repo.find({ relations: ["user", "movie"] });
        },
        favoriteMovie: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.FavoriteMovie);
            return repo.findOne({
                where: { favoriteMovieId: args.id },
                relations: ["user", "movie"],
            });
        },
    },
    Mutation: {
        createFavoriteMovie: async (_, args, ctx) => {
            console.log("createFavoriteMovie called with", args);
            try {
                const repo = data_source_1.AppDataSource.getRepository(entity_1.FavoriteMovie);
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
                    }
                    catch (e) {
                        // ignore
                    }
                }
                // if no userId provided, try to extract from Authorization header
                if (!userId && ctx && ctx.req && ctx.req.headers) {
                    const auth = ctx.req.headers.authorization || ctx.req.headers.Authorization;
                    if (auth && typeof auth === "string") {
                        const token = auth.replace(/^Bearer\s+/i, "");
                        try {
                            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "dev_secret");
                            userId = payload.userId;
                        }
                        catch (e) {
                            console.warn("Invalid JWT in createFavoriteMovie");
                        }
                    }
                }
                console.log("createFavoriteMovie resolved userId=", userId, "movieId=", movieId);
                const fm = repo.create(rest);
                if (userId) {
                    const u = await data_source_1.AppDataSource.getRepository(entity_1.User).findOne({
                        where: { userId },
                    });
                    if (u)
                        fm.user = u;
                    else
                        throw new Error("User not found");
                }
                else {
                    throw new Error("userId is required");
                }
                if (movieId) {
                    const m = await data_source_1.AppDataSource.getRepository(entity_1.Movie).findOne({
                        where: { movieId },
                    });
                    if (m)
                        fm.movie = m;
                    else
                        throw new Error("Movie not found");
                }
                else {
                    throw new Error("movieId is required");
                }
                // prevent duplicates: check if already exists
                const exists = await repo.findOne({
                    where: {
                        user: { userId: fm.user.userId },
                        movie: { movieId: fm.movie.movieId },
                    },
                });
                if (exists)
                    return exists;
                const savedRaw = await repo.save(fm);
                return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
            }
            catch (e) {
                console.error("createFavoriteMovie error", e);
                throw new Error(e.message || "Failed to create favorite");
            }
        },
        updateFavoriteMovie: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.FavoriteMovie);
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
            await repo.update({ favoriteMovieId: args.id }, rest);
            return repo.findOne({
                where: { favoriteMovieId: args.id },
                relations: ["user", "movie"],
            });
        },
        deleteFavoriteMovie: async (_, args, ctx) => {
            console.log("deleteFavoriteMovie called with", args);
            try {
                const repo = data_source_1.AppDataSource.getRepository(entity_1.FavoriteMovie);
                const res = await repo.delete({ favoriteMovieId: args.id });
                return res.affected && res.affected > 0;
            }
            catch (e) {
                console.error("deleteFavoriteMovie error", e);
                throw new Error(e.message || "Failed to delete favorite");
            }
        },
    },
};
exports.default = exports.favoriteMovieResolvers;
