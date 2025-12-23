/**
 * Компонент ячейки игрового поля
 * Соблюдает принцип Single Responsibility
 * Оптимизирован с React.memo для предотвращения лишних ре-рендеров
 */

import React from "react";
import type { Player, Position } from "@/types/game.types";
import { Player as PlayerEnum } from "@/types/game.types";
import styles from "./GameCell.module.css";

export interface GameCellProps {
  readonly value: Player;
  readonly position: Position;
  readonly onClick: (position: Position) => void;
  readonly disabled?: boolean;
}

/**
 * Компонент ячейки
 * Мемоизирован для оптимизации производительности
 */
export const GameCell: React.FC<GameCellProps> = React.memo(
  ({ value, position, onClick, disabled = false }) => {
    const handleClick = (): void => {
      if (!disabled && value === PlayerEnum.EMPTY) {
        onClick(position);
      }
    };

    const cellClasses = [
      styles.gameCell,
      value === PlayerEnum.X && styles["gameCell--x"],
      value === PlayerEnum.O && styles["gameCell--o"],
      disabled && styles["gameCell--disabled"],
      value === PlayerEnum.EMPTY && !disabled && styles["gameCell--clickable"],
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        type="button"
        className={cellClasses}
        onClick={handleClick}
        disabled={disabled || value !== PlayerEnum.EMPTY}
        aria-label={`Ячейка ${position.row + 1}, ${position.col + 1}, значение: ${value || "пусто"}`}
      >
        {value !== PlayerEnum.EMPTY && (
          <span className={styles.gameCell__symbol}>{value}</span>
        )}
      </button>
    );
  }
);

GameCell.displayName = "GameCell";

