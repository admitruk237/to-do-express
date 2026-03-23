import { Request, Response } from 'express';
import { IdParams } from '../../types/common';
import { Board, CreateBoardRequest } from '../../types/boards';

export const validateBoardInput = (
  { body }: Request<IdParams, Board, CreateBoardRequest>,
  response: Response,
  next: () => void,
): void => {
  if (typeof body !== 'object' || !body.name || typeof body.name !== 'string') {
    response.status(400).send({
      error: 'Validation error',
    });
    return;
  }

  next();
};
