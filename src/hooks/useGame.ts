/**
 * Hook для управления игрой
 * Инкапсулирует всю логику игры
 * Соблюдает принцип Single Responsibility
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { GameEngine } from "@/domain/game/GameEngine";
import { AIPlayerFactory } from "@/domain/game/AIPlayerFactory";
import { PromoCodeGenerator } from "@/domain/promo/PromoCodeGenerator";
import type {
  GameState,
  Position,
  GameResult,
  Player,
  Winner,
  AIDifficulty,
} from "@/types/game.types";
import {
  GameResult as GameResultEnum,
  Player as PlayerEnum,
  AIDifficulty as AIDifficultyEnum,
} from "@/types/game.types";
import type { IPlayer } from "@/domain/game/IPlayer";

export interface UseGameOptions {
  readonly difficulty?: AIDifficulty;
  readonly onGameEnd?: (
    result: GameResult,
    difficulty: AIDifficulty,
    duration?: number,
    promoCode?: string
  ) => void;
}

export interface UseGameReturn {
  readonly gameState: GameState;
  readonly isAITurn: boolean;
  readonly promoCode: string | null;
  readonly handleCellClick: (position: Position) => void;
  readonly resetGame: () => void;
  readonly isGameOver: boolean;
}

/**
 * Hook для управления игрой
 */
export const useGame = (options?: UseGameOptions): UseGameReturn => {
  const difficulty: AIDifficulty =
    options?.difficulty || AIDifficultyEnum.MEDIUM;
  const [gameState, setGameState] = useState<GameState>(() => {
    const engine = new GameEngine();
    return engine.getGameState();
  });

  const [isAITurn, setIsAITurn] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const gameStartTimeRef = useRef<number | null>(null);

  const engineRef = useRef<GameEngine | null>(null);
  const aiPlayerRef = useRef<IPlayer | null>(null);

  // Инициализация движка и ИИ
  useEffect(() => {
    engineRef.current = new GameEngine();
    aiPlayerRef.current = AIPlayerFactory.create(difficulty, PlayerEnum.O);
    setGameState(engineRef.current.getGameState());
    gameStartTimeRef.current = Date.now();
  }, [difficulty]);

  /**
   * Обработка хода компьютера
   */
  const makeAIMove = useCallback(async (): Promise<void> => {
    if (!engineRef.current || !aiPlayerRef.current) {
      return;
    }

    setIsAITurn(true);

    // Небольшая задержка для лучшего UX
    await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const board = engineRef.current.getBoard();
        const aiPosition = aiPlayerRef.current.makeMove(board);
        const result: GameResult = engineRef.current.makeMove(aiPosition, PlayerEnum.O);

        const newGameState: GameState = engineRef.current.getGameState();
        setGameState(newGameState);

        // Если компьютер выиграл или ничья
        if (result === GameResultEnum.WIN || result === GameResultEnum.DRAW) {
          setIsAITurn(false);
          // Вызвать callback при завершении игры
          // Результат с точки зрения игрока: если компьютер выиграл - это проигрыш (IN_PROGRESS)
          if (options?.onGameEnd && gameStartTimeRef.current) {
            const duration = Math.floor(
              (Date.now() - gameStartTimeRef.current) / 1000
            );
            const finalResult: GameResult =
              newGameState.winner?.player === PlayerEnum.O
                ? GameResultEnum.IN_PROGRESS // Проигрыш игрока (компьютер выиграл)
                : GameResultEnum.DRAW; // Ничья
            options.onGameEnd(finalResult, difficulty, duration);
          }
        }
      } catch (error) {
        console.error("Ошибка хода компьютера:", error);
        setIsAITurn(false);
    } finally {
      setIsAITurn(false);
    }
  }, [options, difficulty]);

  /**
   * Обработка клика игрока на ячейку
   */
  const handleCellClick = useCallback(
    (position: Position): void => {
      if (!engineRef.current) {
        return;
      }

      // Проверка, что игра не завершена и не ход компьютера
      if (
        gameState.result !== GameResultEnum.IN_PROGRESS ||
        isAITurn ||
        gameState.currentPlayer !== PlayerEnum.X
      ) {
        return;
      }

      try {
        const result: GameResult = engineRef.current.makeMove(position, PlayerEnum.X);
        const newGameState: GameState = engineRef.current.getGameState();
        setGameState(newGameState);

        // Если игрок выиграл - генерируем промокод
        const winner: Winner | null = newGameState.winner;
        const winnerPlayer: Player | undefined = winner?.player;
        let generatedPromoCode: string | null = null;
        if (
          result === GameResultEnum.WIN &&
          winner !== null &&
          winnerPlayer === PlayerEnum.X
        ) {
          const code: string = PromoCodeGenerator.generate();
          setPromoCode(code);
          generatedPromoCode = code;
        }

        // Если игра завершена - вызвать callback
        if (
          (result === GameResultEnum.WIN || result === GameResultEnum.DRAW) &&
          options?.onGameEnd &&
          gameStartTimeRef.current
        ) {
          const duration = Math.floor(
            (Date.now() - gameStartTimeRef.current) / 1000
          );
          // Результат с точки зрения игрока
          const finalResult: GameResult =
            result === GameResultEnum.WIN && winnerPlayer === PlayerEnum.X
              ? GameResultEnum.WIN // Игрок выиграл
              : result === GameResultEnum.DRAW
              ? GameResultEnum.DRAW // Ничья
              : GameResultEnum.IN_PROGRESS; // Проигрыш игрока (компьютер выиграл)
          options.onGameEnd(finalResult, difficulty, duration, generatedPromoCode || undefined);
        }

        // Если игра продолжается - ход компьютера
        if (result === GameResultEnum.IN_PROGRESS) {
          void makeAIMove();
        }
      } catch (error) {
        console.error("Ошибка хода игрока:", error);
      }
    },
    [gameState, isAITurn, makeAIMove, options, difficulty]
  );

  /**
   * Сброс игры
   */
  const resetGame = useCallback((): void => {
    if (!engineRef.current) {
      return;
    }

    engineRef.current.reset();
    setGameState(engineRef.current.getGameState());
    setIsAITurn(false);
    setPromoCode(null);
    gameStartTimeRef.current = Date.now();
  }, []);

  const isGameOver: boolean =
    gameState.result === GameResultEnum.WIN || gameState.result === GameResultEnum.DRAW;

  return {
    gameState,
    isAITurn,
    promoCode,
    handleCellClick,
    resetGame,
    isGameOver,
  };
};
