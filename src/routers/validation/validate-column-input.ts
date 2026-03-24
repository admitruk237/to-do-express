import { Request, Response } from 'express';

import { Column, CreateColumnRequest } from '../../types/columns';
import { ColumnIdParams } from '../../types/common';

export const validateColumnInput = (
  { body }: Request<ColumnIdParams, Column, CreateColumnRequest>,
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
