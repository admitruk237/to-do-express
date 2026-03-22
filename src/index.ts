import express, { request, response } from 'express';
import { PORT } from './config';
import { cardsRouter } from './routers/cards.router';
import { createTable } from './database/create-tables';

async function run() {
  await createTable();
  const server = express();

  server.use(express.json());

  server.get('/', (request, response) => {
    response.send('You are ok');
  });

  server.use('/cards', cardsRouter);

  server.listen(PORT);
}

run().catch((error) => console.error(error));
