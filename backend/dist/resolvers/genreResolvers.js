"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genreResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.genreResolvers = {
    Query: {
        genres: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Genre);
            return repo.find({ relations: ["movies"] });
        },
        genre: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Genre);
            return repo.findOne({
                where: { genreId: args.id },
                relations: ["movies"],
            });
        },
    },
    Mutation: {
        createGenre: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Genre);
            const r = repo.create(args.input);
            const savedRaw = await repo.save(r);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateGenre: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Genre);
            await repo.update({ genreId: args.id }, args.input);
            return repo.findOne({
                where: { genreId: args.id },
                relations: ["movies"],
            });
        },
        deleteGenre: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Genre);
            const res = await repo.delete({ genreId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.genreResolvers;
