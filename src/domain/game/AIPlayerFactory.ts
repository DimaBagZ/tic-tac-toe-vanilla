/**
 * Фабрика для создания ИИ игроков разных уровней сложности
 * Соблюдает принцип Dependency Inversion
 * Строгая типизация без использования any
 */

import type { Player, IPlayer } from "@/types/game.types";
import { AIDifficulty } from "@/types/game.types";
import { EasyAIPlayer } from "./EasyAIPlayer";
import { MediumAIPlayer } from "./MediumAIPlayer";
import { HardAIPlayer } from "./HardAIPlayer";

/**
 * Фабрика для создания ИИ игроков
 */
export class AIPlayerFactory {
  /**
   * Создает ИИ игрока указанного уровня сложности
   */
  static create(difficulty: AIDifficulty, player: Player): IPlayer {
    switch (difficulty) {
      case AIDifficulty.EASY:
        return new EasyAIPlayer(player);

      case AIDifficulty.MEDIUM:
        return new MediumAIPlayer(player);

      case AIDifficulty.HARD:
        return new HardAIPlayer(player);

      default:
        // Fallback на средний уровень
        return new MediumAIPlayer(player);
    }
  }
}
