import { NextFunction, Request, Response } from 'express';
import { CardIdParams, ColumnIdParams } from '../../types/common';
import { getOneCard } from '../../database/cards-repository';

export const checkCardExistence = async (
  { params }: Request<CardIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const card = await getOneCard(params);
  if (card) {
    next();
    return;
  }
  response.status(404).send('Card no found');
};
