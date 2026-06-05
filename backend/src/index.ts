import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";

async function startServer() {
  await AppDataSource.initialize();
  console.log("AppDataSource has been initialized.");

  // Apollo Server (standalone) on port 5000
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    // forward the request to the context so resolvers can access headers
    context: async ({ req }) => ({ req }),
  });
  console.log(`🚀 Apollo Server ready at: ${url}`);

  // Separate small Express app to serve images on port 5001
  const path = require("path");
  const imageApp = express();
  // Serve files from backend/images (drop files there)
  const imagesPath = path.join(process.cwd(), "images");
  imageApp.use("/images", express.static(imagesPath));
  const IMAGE_PORT = process.env.IMAGE_PORT || 5001;
  imageApp.listen(IMAGE_PORT, () => {
    console.log(
      `📁 Images served at http://localhost:${IMAGE_PORT}/images/<filename>`,
    );
    console.log(`Serving files from: ${imagesPath}`);
  });
}

startServer().catch(console.error);
