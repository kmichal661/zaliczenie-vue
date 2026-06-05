"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
require("reflect-metadata");
const data_source_1 = require("./data-source");
const resolvers_1 = require("./resolvers");
const typeDefs_1 = require("./typeDefs");
async function startServer() {
    await data_source_1.AppDataSource.initialize();
    console.log("AppDataSource has been initialized.");
    // Apollo Server (standalone) on port 5000
    const server = new server_1.ApolloServer({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.resolvers });
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 5000 },
    });
    console.log(`🚀 Apollo Server ready at: ${url}`);
    // Separate small Express app to serve images on port 5001
    const imageApp = (0, express_1.default)();
    const imagesPath = "./src/images";
    imageApp.use("/images", express_1.default.static(imagesPath));
    const IMAGE_PORT = process.env.IMAGE_PORT || 5001;
    imageApp.listen(IMAGE_PORT, () => {
        console.log(`📁 Images served at http://localhost:${IMAGE_PORT}/images/<filename>`);
    });
}
startServer().catch(console.error);
