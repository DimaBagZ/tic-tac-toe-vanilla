/**
 * Компонент преимуществ игры
 * Соблюдает принцип Single Responsibility
 * Строгая типизация без использования any
 */

import React from "react";
import styles from "./WelcomeFeatures.module.css";

export interface Feature {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface WelcomeFeaturesProps {
  readonly className?: string;
}

/**
 * Список преимуществ игры
 */
const FEATURES: readonly Feature[] = [
  {
    icon: "🤖",
    title: "Искусственный интеллект",
    description: "Играйте против ИИ трех уровней сложности: легкий, средний и сложный",
  },
  {
    icon: "🎁",
    title: "Промокоды за победы",
    description: "Выигрывайте промокоды при каждой победе и получайте награды",
  },
  {
    icon: "📊",
    title: "Статистика и достижения",
    description: "Отслеживайте свой прогресс, разблокируйте достижения и улучшайте результаты",
  },
  {
    icon: "🎨",
    title: "Красивый дизайн",
    description: "Современный интерфейс с пастельными тонами, созданный специально для вас",
  },
] as const;

/**
 * Компонент преимуществ игры
 */
export const WelcomeFeatures: React.FC<WelcomeFeaturesProps> = ({
  className = "",
}) => {
  return (
    <section className={`${styles.welcomeFeatures} ${className}`}>
      <h2 className={styles.welcomeFeatures__title}>Почему стоит играть?</h2>
      <div className={styles.welcomeFeatures__grid}>
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className={styles.welcomeFeatures__item}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.welcomeFeatures__itemIcon}>
              {feature.icon}
            </div>
            <h3 className={styles.welcomeFeatures__itemTitle}>
              {feature.title}
            </h3>
            <p className={styles.welcomeFeatures__itemDescription}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

