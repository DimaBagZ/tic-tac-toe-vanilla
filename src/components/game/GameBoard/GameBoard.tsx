/**
 * Компонент игрового поля
 * Соблюдает принцип Single Responsibility
 * Оптимизирован с React.memo для предотвращения лишних ре-рендеров
 */

import React from "react";
import type { BoardState, Position } from "@/types/game.types";
import { GameCell } from "../GameCell";
import styles from "./GameBoard.module.css";

export interface GameBoardProps {
  readonly board: BoardState;
  readonly onCellClick: (position: Position) => void;
  readonly disabled?: boolean;
}

/**
 * Компонент игрового поля
 * Мемоизирован для оптимизации производительности
 */
export const GameBoard: React.FC<GameBoardProps> = React.memo(
  ({ board, onCellClick, disabled = false }) => {
    return (
      <div
        className={styles.gameBoard}
        role="grid"
        aria-label="Игровое поле крестики-нолики"
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position: Position = { row: rowIndex, col: colIndex };
            return (
              <GameCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                position={position}
                onClick={onCellClick}
                disabled={disabled}
              />
            );
          })
        )}
      </div>
    );
  }
);

GameBoard.displayName = "GameBoard";

