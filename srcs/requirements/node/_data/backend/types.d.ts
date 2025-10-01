import 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    // the authenticate function you added with app.decorate
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}