"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actorResolvers = void 0;
const data_source_1 = require("../data-source");
const entity_1 = require("../entity");
exports.actorResolvers = {
    Query: {
        actors: async () => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Actor);
            return repo.find({ relations: ["movieRoles", "movieRoles.movie"] });
        },
        actor: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Actor);
            return repo.findOne({
                where: { actorId: args.id },
                relations: ["movieRoles", "movieRoles.movie"],
            });
        },
    },
    Mutation: {
        createActor: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Actor);
            const r = repo.create(args.input);
            const savedRaw = await repo.save(r);
            return Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
        },
        updateActor: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Actor);
            await repo.update({ actorId: args.id }, args.input);
            return repo.findOne({
                where: { actorId: args.id },
                relations: ["movieRoles", "movieRoles.movie"],
            });
        },
        deleteActor: async (_, args) => {
            const repo = data_source_1.AppDataSource.getRepository(entity_1.Actor);
            const res = await repo.delete({ actorId: args.id });
            return res.affected && res.affected > 0;
        },
    },
};
exports.default = exports.actorResolvers;
