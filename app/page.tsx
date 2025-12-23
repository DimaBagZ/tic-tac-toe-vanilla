"use client";

/**
 * Главная страница игры
 * Интегрирует все компоненты
 */

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { useTelegram } from "@/hooks/useTelegram";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useStatistics } from "@/hooks/useStatistics";
import { useAchievements } from "@/hooks/useAchievements";
import { GameBoard } from "@/components/game/GameBoard";
import { GameStatus } from "@/components/game/GameStatus";
import { WinModal } from "@/components/modals/WinModal";
import { LoseModal } from "@/components/modals/LoseModal";
import { UserAvatar } from "@/components/user/UserAvatar";
import { Button } from "@/components/ui/Button";
import {
  GameResult as GameResultEnum,
  Player as PlayerEnum,
  AIDifficulty,
} from "@/types/game.types";
import { AvatarValidator } from "@/domain/avatar/AvatarValidator";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, isLoading } = useUserProfile();
  const { statistics, gameHistory, updateStatistics } = useStatistics();
  const { checkAchievements } = useAchievements();
  const { sendWinMessage, sendLoseMessage } = useTelegram();

  const difficulty = profile?.preferredDifficulty;
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [hasSentTelegramMessage, setHasSentTelegramMessage] = useState(false);

  const { gameState, isAITurn, promoCode, handleCellClick, resetGame, isGameOver } =
    useGame({
      difficulty,
      onGameEnd: (result, diff, duration, promo) => {
        updateStatistics(result, diff, duration, promo);
      },
    });

  // Проверка первого визита: если профиля нет (и загрузка завершена), редирект на welcome
  const hasRedirectedRef = useRef(false);
  useEffect(() => {
    if (!isLoading && profile === null && !hasRedirectedRef.current && pathname === "/") {
      hasRedirectedRef.current = true;
      router.replace("/welcome");
    }
  }, [profile, isLoading, router, pathname]);

  // Проверить достижения после обновления статистики
  // Используем useRef для отслеживания последней проверенной статистики
  const lastCheckedRef = useRef<number>(0);
  useEffect(() => {
    if (
      statistics.totalGames > 0 &&
      profile &&
      statistics.lastPlayed !== lastCheckedRef.current &&
      statistics.lastPlayed > 0
    ) {
      lastCheckedRef.current = statistics.lastPlayed;
      const newlyUnlocked = checkAchievements(statistics, gameHistory);
      if (newlyUnlocked.length > 0) {
        // Можно показать уведомление о новых достижениях
        console.log("Новые достижения разблокированы:", newlyUnlocked);
      }
    }
  }, [statistics.lastPlayed, statistics.totalGames, profile]);

  // Обработка завершения игры
  useEffect(() => {
    if (!isGameOver || hasSentTelegramMessage || !profile) {
      return;
    }

    const handleGameEnd = async (): Promise<void> => {
      if (gameState.result === GameResultEnum.WIN) {
        if (gameState.winner?.player === PlayerEnum.X && promoCode) {
          // Игрок выиграл
          setShowWinModal(true);
          await sendWinMessage(promoCode);
          setHasSentTelegramMessage(true);
        } else if (gameState.winner?.player === PlayerEnum.O) {
          // Компьютер выиграл
          setShowLoseModal(true);
          await sendLoseMessage();
          setHasSentTelegramMessage(true);
        }
      } else if (gameState.result === GameResultEnum.DRAW) {
        // Ничья - показываем модальное окно, но НЕ отправляем сообщение в Telegram
        setShowLoseModal(true);
        setHasSentTelegramMessage(true);
      }
    };

    void handleGameEnd();
  }, [
    isGameOver,
    gameState,
    promoCode,
    sendWinMessage,
    sendLoseMessage,
    hasSentTelegramMessage,
    profile,
  ]);

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

  const handlePlayAgain = (): void => {
    resetGame();
    setShowWinModal(false);
    setShowLoseModal(false);
    setHasSentTelegramMessage(false);
  };

  const handleCloseWinModal = (): void => {
    setShowWinModal(false);
  };

  const handleCloseLoseModal = (): void => {
    setShowLoseModal(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          {/* Logo */}
          <div className={styles.header__logo}>
            <Logo href="/welcome" size="medium" />
          </div>

          {/* User info */}
          <div className={styles.header__user}>
            <UserAvatar avatarId={validAvatarId} size="small" showBorder={true} />
            <span className={styles.header__userName}>{profile?.name || "Игрок"}</span>
            <Link href="/dashboard" className={styles.header__dashboardLink}>
              📊 Статистика
            </Link>
          </div>
        </header>

        {/* Game title and difficulty */}
        <div className={styles.gameHeader}>
          <h1 className={styles.title}>🎮 Крестики-нолики</h1>
          <p className={styles.subtitle}>
            Играйте против компьютера и выигрывайте промокоды!
          </p>
          {difficulty && (
            <div className={styles.difficultyBadge}>
              <span className={styles.difficultyBadge__label}>Уровень сложности:</span>
              <span className={styles.difficultyBadge__value}>
                {difficulty === AIDifficulty.EASY
                  ? "Легко"
                  : difficulty === AIDifficulty.MEDIUM
                  ? "Средне"
                  : "Сложно"}
              </span>
            </div>
          )}
        </div>

        <div className={styles.gameSection}>
          <GameStatus
            currentPlayer={gameState.currentPlayer}
            result={gameState.result}
            isAITurn={isAITurn}
            winner={gameState.winner?.player || null}
          />

          <GameBoard
            board={gameState.board}
            onCellClick={handleCellClick}
            disabled={isAITurn || isGameOver}
          />

          {isGameOver && (
            <div className={styles.gameOverActions}>
              <Button variant="primary" onClick={handlePlayAgain}>
                Сыграть еще раз
              </Button>
            </div>
          )}
        </div>

        <WinModal
          isOpen={showWinModal}
          onClose={handleCloseWinModal}
          onPlayAgain={handlePlayAgain}
          promoCode={promoCode || ""}
        />

        <LoseModal
          isOpen={showLoseModal}
          onClose={handleCloseLoseModal}
          onPlayAgain={handlePlayAgain}
          isDraw={gameState.result === GameResultEnum.DRAW}
        />
      </div>
    </main>
  );
}
