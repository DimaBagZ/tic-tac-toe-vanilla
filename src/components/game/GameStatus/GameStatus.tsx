/**
 * Компонент статуса игры
 * Соблюдает принцип Single Responsibility
 */

import React from "react";
import type { GameResult, Player } from "@/types/game.types";
import { GameResult as GameResultEnum } from "@/types/game.types";
import styles from "./GameStatus.module.css";

export interface GameStatusProps {
  readonly currentPlayer: Player;
  readonly result: GameResult;
  readonly isAITurn?: boolean;
  readonly winner?: Player | null;
}

/**
 * Компонент статуса игры
 */
export const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  result,
  isAITurn = false,
  winner = null,
}) => {
  const getStatusText = (): string => {
    if (result === GameResultEnum.WIN && winner) {
      return `Победил игрок ${winner}! 🎉`;
    }

    if (result === GameResultEnum.DRAW) {
      return "Ничья! 🤝";
    }

    if (isAITurn) {
      return "Ход компьютера...";
    }

    return `Ход игрока ${currentPlayer}`;
  };

  return (
    <div className={styles.gameStatus}>
      <div className={styles.gameStatus__text}>{getStatusText()}</div>
      {isAITurn && (
        <div className={styles.gameStatus__loader} aria-label="Загрузка">
          <span className={styles.gameStatus__loaderDot}></span>
          <span className={styles.gameStatus__loaderDot}></span>
          <span className={styles.gameStatus__loaderDot}></span>
        </div>
      )}
    </div>
  );
};
