import dotenv from 'dotenv';
dotenv.config(); // ✅ Cargar variables de entorno desde el inicio

import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import jwt from 'jsonwebtoken'; // ✅ Usar import en lugar de require
import db from './config/connection.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startApolloServer() {
  console.log('🔗 Connecting to MongoDB at:', process.env.MONGODB_URI);
  console.log('⏳ Starting Apollo Server...');
  await server.start();
  console.log('✅ Apollo Server started');

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        let user = null;
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            user = decoded;
          } catch (err: any) {
            console.error('❌ Invalid token:', err.message);
          }
        }

        return { user };
      },
    })
  );

  console.log('🚦 Middleware configured');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) =>
      res.sendFile(path.join(__dirname, '../client/build/index.html'))
    );
  }

  db.once('open', () => {
    console.log('🛢️ MongoDB connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();
