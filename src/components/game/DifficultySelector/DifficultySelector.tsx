/**
 * Компонент выбора уровня сложности ИИ
 * Соблюдает принцип Single Responsibility
 * Строгая типизация без использования any
 */

import React from "react";
import { AIDifficulty } from "@/types/game.types";
import styles from "./DifficultySelector.module.css";

export interface DifficultySelectorProps {
  readonly currentDifficulty: AIDifficulty;
  readonly onSelect: (difficulty: AIDifficulty) => void;
  readonly className?: string;
}

/**
 * Описание уровней сложности
 */
const DIFFICULTY_INFO: Record<
  AIDifficulty,
  { readonly label: string; readonly description: string; readonly emoji: string }
> = {
  [AIDifficulty.EASY]: {
    label: "Легкий",
    description: "Идеально для новичков",
    emoji: "😊",
  },
  [AIDifficulty.MEDIUM]: {
    label: "Средний",
    description: "Сбалансированный уровень",
    emoji: "🤔",
  },
  [AIDifficulty.HARD]: {
    label: "Сложный",
    description: "Для опытных игроков",
    emoji: "🧠",
  },
} as const;

/**
 * Компонент выбора уровня сложности
 */
export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelect,
  className,
}) => {
  const difficulties: readonly AIDifficulty[] = [
    AIDifficulty.EASY,
    AIDifficulty.MEDIUM,
    AIDifficulty.HARD,
  ];

  return (
    <div className={`${styles.difficultySelector} ${className || ""}`}>
      <h3 className={styles.difficultySelector__title}>Выберите уровень сложности</h3>
      <div className={styles.difficultySelector__grid}>
        {difficulties.map((difficulty) => {
          const isSelected = currentDifficulty === difficulty;
          const info = DIFFICULTY_INFO[difficulty];

          return (
            <button
              key={difficulty}
              type="button"
              className={`${styles.difficultySelector__item} ${
                isSelected ? styles["difficultySelector__item--selected"] : ""
              }`}
              onClick={() => onSelect(difficulty)}
              aria-label={`Выбрать уровень сложности: ${info.label}`}
              aria-pressed={isSelected}
            >
              <span className={styles.difficultySelector__emoji}>
                {info.emoji}
              </span>
              <span className={styles.difficultySelector__label}>
                {info.label}
              </span>
              <span className={styles.difficultySelector__description}>
                {info.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

