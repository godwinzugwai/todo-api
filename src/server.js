require('dotenv/config');
const app = require('./app');
const prisma = require('./db/prisma');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Todo API listening on http://localhost:${PORT}`);
});

//this closes the HTTP server and the database connection cleanly 
async function shutdown () {
  server.close(async () => {
    await prisma.disconnect();
    proces.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

//feat(server): disconnect Prisma on shutdown