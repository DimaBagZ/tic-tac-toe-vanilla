"use client";

/**
 * Страница дашборда со статистикой игр
 * Интегрирует все компоненты статистики
 */

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useStatistics } from "@/hooks/useStatistics";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { StatisticsCard } from "@/components/dashboard/StatisticsCard";
import { RecentGames } from "@/components/dashboard/RecentGames";
import { Achievements } from "@/components/dashboard/Achievements";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { UserAvatar } from "@/components/user/UserAvatar";
import { Button } from "@/components/ui/Button";
import { AIDifficulty } from "@/types/game.types";
import { formatWinRate } from "@/utils/formatters";
import { AvatarValidator } from "@/domain/avatar/AvatarValidator";
import styles from "./page.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, isLoading } = useUserProfile();
  const { statistics, gameHistory } = useStatistics();
  const { achievements, checkAchievements } = useAchievements();

  // Проверка первого визита: если профиля нет (и загрузка завершена), редирект на welcome
  const hasRedirectedRef = useRef(false);
  useEffect(() => {
    if (!isLoading && profile === null && !hasRedirectedRef.current && pathname === "/dashboard") {
      hasRedirectedRef.current = true;
      router.replace("/welcome");
    }
  }, [profile, isLoading, router, pathname]);

  // Проверить достижения при загрузке (только один раз при монтировании)
  const hasCheckedAchievementsRef = useRef(false);
  useEffect(() => {
    if (profile && !hasCheckedAchievementsRef.current && statistics.totalGames > 0) {
      hasCheckedAchievementsRef.current = true;
      checkAchievements(statistics, gameHistory);
    }
  }, [statistics.totalGames, profile]);

  // Если профиль еще загружается, показываем загрузку
  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Загрузка...</p>
          </div>
        </div>
      </main>
    );
  }

  // Если профиля нет (и загрузка завершена), показываем загрузку (редирект произойдет через useEffect)
  if (!profile) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Загрузка...</p>
          </div>
        </div>
      </main>
    );
  }

  // Валидация avatarId из профиля
  const validAvatarId =
    profile && AvatarValidator.validateAndNormalize(profile.avatarId)
      ? AvatarValidator.validateAndNormalize(profile.avatarId)!
      : "avatar-01";

  // Получить текст сложности
  const getDifficultyText = (difficulty: AIDifficulty): string => {
    switch (difficulty) {
      case AIDifficulty.EASY:
        return "Легко";
      case AIDifficulty.MEDIUM:
        return "Средне";
      case AIDifficulty.HARD:
        return "Сложно";
      default:
        return difficulty;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.header__user}>
            <UserAvatar avatarId={validAvatarId} size="large" showBorder={true} />
            <div className={styles.header__userInfo}>
              <h1 className={styles.header__userName}>{profile?.name || "Игрок"}</h1>
              <p className={styles.header__userSubtitle}>Статистика игр</p>
            </div>
          </div>
              <div className={styles.header__actions}>
                <Link href="/profile" className={styles.header__link}>
                  <Button variant="outline">Личный кабинет</Button>
                </Link>
                <Link href="/" className={styles.header__link}>
                  <Button variant="outline">Вернуться к игре</Button>
                </Link>
              </div>
            </header>

        {/* Общая статистика */}
        <section className={styles.section}>
          <h2 className={styles.section__title}>Общая статистика</h2>
          <div className={styles.statisticsGrid}>
            <StatisticsCard
              title="Всего игр"
              value={statistics.totalGames}
              icon="🎮"
              trend="neutral"
            />
            <StatisticsCard title="Побед" value={statistics.wins} icon="🎉" trend="up" />
            <StatisticsCard
              title="Проигрышей"
              value={statistics.losses}
              icon="😔"
              trend="down"
            />
            <StatisticsCard
              title="Ничьих"
              value={statistics.draws}
              icon="🤝"
              trend="neutral"
            />
            <StatisticsCard
              title="Процент побед"
              value={formatWinRate(statistics.winRate)}
              subtitle={`${statistics.wins} из ${statistics.totalGames}`}
              icon="📊"
              trend={statistics.winRate >= 50 ? "up" : "down"}
            />
            <StatisticsCard
              title="Текущая серия"
              value={statistics.currentStreak}
              subtitle="побед подряд"
              icon="🔥"
              trend={statistics.currentStreak > 0 ? "up" : "neutral"}
            />
            <StatisticsCard
              title="Лучшая серия"
              value={statistics.bestStreak}
              subtitle="побед подряд"
              icon="⭐"
              trend="up"
            />
          </div>
        </section>

        {/* График статистики по сложности */}
        <section className={styles.section}>
          <h2 className={styles.section__title}>Статистика по уровням сложности</h2>
          <div className={styles.chartContainer}>
            <StatisticsChart
              title="Побед по уровням сложности"
              data={[
                {
                  label: "Легко",
                  value: statistics.gamesByDifficulty[AIDifficulty.EASY].wins,
                  color: "var(--color-success)",
                },
                {
                  label: "Средне",
                  value: statistics.gamesByDifficulty[AIDifficulty.MEDIUM].wins,
                  color: "var(--color-primary)",
                },
                {
                  label: "Сложно",
                  value: statistics.gamesByDifficulty[AIDifficulty.HARD].wins,
                  color: "var(--color-accent)",
                },
              ]}
            />
          </div>
          <div className={styles.difficultyGrid}>
            {Object.entries(statistics.gamesByDifficulty).map(([difficulty, stats]) => (
              <div key={difficulty} className={styles.difficultyCard}>
                <h3 className={styles.difficultyCard__title}>
                  {getDifficultyText(difficulty as AIDifficulty)}
                </h3>
                <div className={styles.difficultyCard__stats}>
                  <div className={styles.difficultyCard__stat}>
                    <span className={styles.difficultyCard__statLabel}>Побед:</span>
                    <span className={styles.difficultyCard__statValue}>{stats.wins}</span>
                  </div>
                  <div className={styles.difficultyCard__stat}>
                    <span className={styles.difficultyCard__statLabel}>Проигрышей:</span>
                    <span className={styles.difficultyCard__statValue}>
                      {stats.losses}
                    </span>
                  </div>
                  <div className={styles.difficultyCard__stat}>
                    <span className={styles.difficultyCard__statLabel}>Ничьих:</span>
                    <span className={styles.difficultyCard__statValue}>
                      {stats.draws}
                    </span>
                  </div>
                  <div className={styles.difficultyCard__stat}>
                    <span className={styles.difficultyCard__statLabel}>
                      Процент побед:
                    </span>
                    <span className={styles.difficultyCard__statValue}>
                      {formatWinRate(stats.winRate)}
                    </span>
                  </div>
                </div>
                {/* Прогресс-бар для процента побед */}
                <div className={styles.difficultyCard__progress}>
                  <div
                    className={styles.difficultyCard__progressBar}
                    style={{ width: `${Math.min(stats.winRate, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Достижения */}
        <section className={styles.section}>
          <Achievements achievements={achievements} />
        </section>

        {/* Последние игры */}
        <section className={styles.section}>
          <RecentGames gameHistory={gameHistory} maxItems={20} />
        </section>
      </div>
    </main>
  );
}
