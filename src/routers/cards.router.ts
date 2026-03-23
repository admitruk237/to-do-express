import express, { Response, Request } from 'express';
import { GetCardsTypeResponse, Card, CreateCardRequest } from '../types/cards';
import { IdParams } from '../types/common';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import { randomUUID } from 'crypto';
import { text } from 'body-parser';
import { validateCardInput } from './validation';

export const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  async (
    request: Request<{}, {}>,
    response: Response<GetCardsTypeResponse>,
  ) => {
    const cards = await getManyCards();
    response.send(cards);
  },
);

cardsRouter.get(
  '/:id',
  async (request: Request<IdParams, {}>, response: Response<Card | string>) => {
    const card = await getOneCard(request.params.id);
    if (!card) {
      response.status(404).send('Card not found');
      return;
    }
    response.send(card);
  },
);

cardsRouter.post(
  '/',
  validateCardInput,
  async (
    request: Request<{}, Card, CreateCardRequest>,
    response: Response<Card>,
  ) => {
    const card: Card = {
      text: request.body.text,
      id: randomUUID(),
    };
    await createCard(card);
    response.send(card);
  },
);

cardsRouter.put(
  '/:id',
  validateCardInput,
  async (
    request: Request<IdParams, Card, CreateCardRequest>,
    response: Response<Card>,
  ) => {
    const card = {
      id: request.params.id,
      text: request.body.text,
    };
    await updateCard(card);
    response.send(card);
  },
);

cardsRouter.delete(
  '/:id',
  async (request: Request<IdParams>, response: Response<void>) => {
    await deleteCard(request.params.id);
    response.sendStatus(204);
  },
);
