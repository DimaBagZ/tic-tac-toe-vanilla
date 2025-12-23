/**
 * Компонент главного баннера Welcome страницы
 * Соблюдает принцип Single Responsibility
 * Строгая типизация без использования any
 */

import React from "react";
import styles from "./WelcomeHero.module.css";

export interface WelcomeHeroProps {
  readonly className?: string;
}

/**
 * Компонент главного баннера
 */
export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ className = "" }) => {
  return (
    <section className={`${styles.welcomeHero} ${className}`}>
      <div className={styles.welcomeHero__container}>
        <h1 className={styles.welcomeHero__title}>
          <span className={styles.welcomeHero__emoji}>🎮</span>
          Добро пожаловать в Крестики-нолики!
        </h1>
        <p className={styles.welcomeHero__subtitle}>
          Увлекательная игра для всех возрастов. Сражайтесь с искусственным интеллектом,
          выигрывайте промокоды и отслеживайте свою статистику!
        </p>
        <div className={styles.welcomeHero__decorative}>
          <span className={styles.welcomeHero__decorativeItem}>✨</span>
          <span className={styles.welcomeHero__decorativeItem}>🎯</span>
          <span className={styles.welcomeHero__decorativeItem}>🏆</span>
        </div>
      </div>
    </section>
  );
};
