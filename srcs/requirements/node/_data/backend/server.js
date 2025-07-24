const fastify = require('fastify')();
const path = require('path');
const fastifyStatic = require('@fastify/static');

// Register the static plugin
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public'), // Folder with your HTML files
  prefix: '/', // Optional: URL prefix
});

// Serve a custom page at the root route
fastify.get('/', (request, reply) => {
  reply.type('text/html').sendFile('index.html'); // Replace with your desired file
});

fastify.get('/ping', async () => {
  return { pong: 'it works!' };
});

// Start the server
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});
