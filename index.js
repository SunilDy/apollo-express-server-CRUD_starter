const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const http = require('http');

// Imports
const {typeDefs, resolvers} = require('./server/exports');
const {username,pass} = require('./keys');
const { pubsub } = require('./server/resolvers');

const main = async () => {
    const app = express();

    // DB config
    mongoose.connect(`mongodb://${username}:${pass}@localhost:27017/apollo`, {useNewUrlParser: true})
        .then(console.log("==> Connected to the database!"));

    const PORT = process.env.PORT || 4000;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res, pubsub })
    });
    server.applyMiddleware({ app, path: "/graphql" });

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen({port: PORT}, () => {
        console.log(`==> Server running on https://localhost:${PORT}/graphql`)
    });
}

main();