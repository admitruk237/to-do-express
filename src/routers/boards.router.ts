import express, { Response, Request } from 'express';
import {
  GetBoardsResponse,
  Board,
  CreateBoardRequest,
  GetBoardResponse,
} from '../types/boards';

import {
  createBoard,
  deleteBoard,
  getManyBoards,
  getOneBoard,
  updateBoard,
} from '../database/boards-repository';
import { randomUUID } from 'crypto';
import { validateBoardInput } from './validation';
import { BoardIdParams } from '../types/common';
export const boardsRouter = express.Router();

boardsRouter.get(
  '/',
  async (request: Request<{}, {}>, response: Response<GetBoardsResponse>) => {
    const boards = await getManyBoards();
    response.send(boards);
  },
);

boardsRouter.get(
  '/:boardId',
  async (
    request: Request<BoardIdParams>,
    response: Response<GetBoardResponse | string>,
  ) => {
    const board = await getOneBoard(request.params.boardId);

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
  '/:boardId',
  validateBoardInput,
  async (
    request: Request<BoardIdParams, Board, CreateBoardRequest>,
    response: Response<Board>,
  ) => {
    const board = {
      id: request.params.boardId,
      name: request.body.name,
    };
    await updateBoard(board);
    response.send(board);
  },
);

boardsRouter.delete(
  '/:boardId',
  async (request: Request<BoardIdParams>, response: Response<void>) => {
    await deleteBoard(request.params.boardId);
    response.sendStatus(204);
  },
);
