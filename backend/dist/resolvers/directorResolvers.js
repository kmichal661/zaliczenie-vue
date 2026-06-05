"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directorResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.directorResolvers = {
    Query: {
        directors: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Director);
            return repo.find({ relations: ["movies"] });
        },
        director: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Director);
            return repo.findOne({
                where: { directorId: args.id },
                relations: ["movies"],
            });
        },
    },
    Mutation: {
        createDirector: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Director);
            const r = repo.create(args.input);
            const savedRaw = await repo.save(r);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateDirector: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Director);
            await repo.update({ directorId: args.id }, args.input);
            return repo.findOne({
                where: { directorId: args.id },
                relations: ["movies"],
            });
        },
        deleteDirector: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Director);
            const res = await repo.delete({ directorId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.directorResolvers;
