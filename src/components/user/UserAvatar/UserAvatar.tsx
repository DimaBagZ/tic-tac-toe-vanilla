/**
 * Компонент отображения аватара пользователя
 * Соблюдает принцип Single Responsibility
 * Строгая типизация без использования any
 */

import React from "react";
import Image from "next/image";
import type { AvatarId } from "@/domain/avatar/AvatarPreset";
import { AvatarRegistry } from "@/domain/avatar/AvatarRegistry";
import styles from "./UserAvatar.module.css";

export interface UserAvatarProps {
  readonly avatarId: AvatarId;
  readonly size?: "small" | "medium" | "large";
  readonly className?: string;
  readonly showBorder?: boolean;
}

/**
 * Размеры аватаров в пикселях
 */
const SIZE_MAP = {
  small: 40,
  medium: 64,
  large: 120,
} as const;

/**
 * Компонент аватара пользователя
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarId,
  size = "medium",
  className,
  showBorder = false,
}) => {
  const avatar = AvatarRegistry.getById(avatarId);

  if (!avatar) {
    // Fallback на дефолтный аватар
    return (
      <div
        className={`${styles.userAvatar} ${styles[`userAvatar--${size}`]} ${
          showBorder ? styles["userAvatar--bordered"] : ""
        } ${className || ""}`}
      >
        <span className={styles.userAvatar__fallback}>👤</span>
      </div>
    );
  }

  const sizePx = SIZE_MAP[size];

  return (
    <div
      className={`${styles.userAvatar} ${styles[`userAvatar--${size}`]} ${
        showBorder ? styles["userAvatar--bordered"] : ""
      } ${className || ""}`}
    >
      <Image
        src={avatar.metadata.url}
        alt={avatar.metadata.name}
        width={sizePx}
        height={sizePx}
        className={styles.userAvatar__image}
        priority={size === "large"}
      />
    </div>
  );
};

