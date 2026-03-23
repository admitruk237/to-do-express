import express, { Response, Request } from 'express';
import { GetBoardsResponse, Board, CreateBoardRequest } from '../types/boards';
import { IdParams } from '../types/common';
import {
  createBoard,
  deleteBoard,
  getManyBoards,
  getOneBoard,
  updateBoard,
} from '../database/boards-repository';
import { randomUUID } from 'crypto';
import { validateBoardInput } from './validation';
export const boardsRouter = express.Router();

boardsRouter.get(
  '/',
  async (request: Request<{}, {}>, response: Response<GetBoardsResponse>) => {
    const boards = await getManyBoards();
    response.send(boards);
  },
);

boardsRouter.get(
  '/:id',
  async (
    request: Request<IdParams, {}>,
    response: Response<Board | string>,
  ) => {
    const board = await getOneBoard(request.params.id);
    if (!board) {
      response.status(404).send('Board not found');
      return;
    }
    response.send(board);
  },
);

boardsRouter.post(
  '/',
  // validateBoardInput,
  async (
    request: Request<{}, Board, CreateBoardRequest>,
    response: Response<Board | string>,
  ) => {
    if (!request.body || !request.body.name) {
      response.status(400).send('Field "name" is required');
      return;
    }
    const board: Board = {
      id: randomUUID(),
      name: request.body.name,
    };
    await createBoard(board);
    response.send(board);
  },
);

boardsRouter.put(
  '/:id',
  validateBoardInput,
  async (
    request: Request<IdParams, Board, CreateBoardRequest>,
    response: Response<Board>,
  ) => {
    const board = {
      id: request.params.id,
      name: request.body.name,
    };
    await updateBoard(board);
    response.send(board);
  },
);

boardsRouter.delete(
  '/:id',
  async (request: Request<IdParams>, response: Response<void>) => {
    await deleteBoard(request.params.id);
    response.sendStatus(204);
  },
);
