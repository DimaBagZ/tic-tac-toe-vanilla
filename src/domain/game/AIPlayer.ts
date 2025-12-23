/**
 * ИИ игрок
 * Реализует простую стратегию: блокировка, атака, случайный ход
 * Соблюдает принцип Single Responsibility и Open/Closed
 */

import type { BoardState, Position } from "@/types/game.types";
import { Player, PlayerType } from "@/types/game.types";
import type { IPlayer } from "./IPlayer";
import { GameValidator } from "./GameValidator";
import { BOARD_SIZE, WINNING_LINES } from "@/utils/constants";

/**
 * Класс ИИ игрока
 */
export class AIPlayer implements IPlayer {
  private readonly player: Player;

  constructor(player: Player) {
    if (player === Player.EMPTY) {
      throw new Error("ИИ не может быть пустым игроком");
    }
    this.player = player;
  }

  /**
   * Делает ход
   */
  makeMove(board: BoardState): Position {
    // 1. Попытка выиграть (атака)
    const winningMove = this.findWinningMove(board);
    if (winningMove) {
      return winningMove;
    }

    // 2. Блокировка противника
    const blockingMove = this.findBlockingMove(board);
    if (blockingMove) {
      return blockingMove;
    }

    // 3. Захват центра (если свободен)
    const center: Position = { row: 1, col: 1 };
    if (GameValidator.isCellEmpty(board, center)) {
      return center;
    }

    // 4. Захват угла (если свободен)
    const corners: readonly Position[] = [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ];

    const availableCorners = corners.filter((corner) =>
      GameValidator.isCellEmpty(board, corner)
    );

    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // 5. Случайный доступный ход
    return this.findRandomMove(board);
  }

  /**
   * Находит выигрышный ход
   */
  private findWinningMove(board: BoardState): Position | null {
    return this.findMoveForPlayer(board, this.player);
  }

  /**
   * Находит ход для блокировки противника
   */
  private findBlockingMove(board: BoardState): Position | null {
    const opponent = this.player === Player.X ? Player.O : Player.X;
    return this.findMoveForPlayer(board, opponent);
  }

  /**
   * Находит ход для указанного игрока (для атаки или блокировки)
   */
  private findMoveForPlayer(
    board: BoardState,
    player: Player
  ): Position | null {
    for (const line of WINNING_LINES) {
      const cells = line.map((pos) => board[pos.row][pos.col]);
      const playerCount = cells.filter((cell) => cell === player).length;
      const emptyCount = cells.filter((cell) => cell === Player.EMPTY).length;

      // Если в линии 2 клетки игрока и 1 пустая - можем выиграть/заблокировать
      if (playerCount === 2 && emptyCount === 1) {
        const emptyPosition = line.find(
          (pos) => board[pos.row][pos.col] === Player.EMPTY
        );
        if (emptyPosition) {
          return emptyPosition;
        }
      }
    }

    return null;
  }

  /**
   * Находит случайный доступный ход
   */
  private findRandomMove(board: BoardState): Position {
    const availableMoves: Position[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const position: Position = { row, col };
        if (GameValidator.isCellEmpty(board, position)) {
          availableMoves.push(position);
        }
      }
    }

    if (availableMoves.length === 0) {
      throw new Error("Нет доступных ходов");
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  /**
   * Возвращает тип игрока
   */
  getPlayerType(): PlayerType {
    return PlayerType.AI;
  }
}

