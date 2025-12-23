/**
 * Компонент профиля пользователя
 * Соблюдает принцип Single Responsibility
 * Строгая типизация без использования any
 */

import React, { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { AvatarSelector } from "../UserAvatar/AvatarSelector";
import { UserNameInput } from "./UserNameInput";
import { DifficultySelector } from "@/components/game/DifficultySelector";
import { Modal } from "@/components/ui/Modal";
import type { AvatarId } from "@/domain/avatar/AvatarPreset";
import { AvatarValidator } from "@/domain/avatar/AvatarValidator";
import styles from "./UserProfile.module.css";

/**
 * Компонент профиля пользователя
 */
export const UserProfile: React.FC = () => {
  const { profile, updateName, updateAvatar, updateDifficulty } = useUserProfile();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  if (!profile) {
    return (
      <div className={styles.userProfile}>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  const handleAvatarSelect = (avatarId: AvatarId): void => {
    updateAvatar(avatarId);
    setShowAvatarSelector(false);
  };

  // Валидация avatarId из профиля
  const validAvatarId: AvatarId =
    AvatarValidator.validateAndNormalize(profile.avatarId) || "avatar-01";

  return (
    <div className={styles.userProfile}>
      <div className={styles.userProfile__header}>
        <h2 className={styles.userProfile__title}>Мой профиль</h2>
      </div>

      <div className={styles.userProfile__content}>
        {/* Аватар */}
        <div className={styles.userProfile__avatarSection}>
          <div className={styles.userProfile__avatarWrapper}>
            <UserAvatar avatarId={validAvatarId} size="large" showBorder={true} />
            <button
              type="button"
              className={styles.userProfile__avatarButton}
              onClick={() => setShowAvatarSelector(true)}
            >
              Изменить аватар
            </button>
          </div>
        </div>

        {/* Имя */}
        <div className={styles.userProfile__nameSection}>
          <UserNameInput currentName={profile.name} onSave={updateName} />
        </div>

        {/* Настройки сложности */}
        <div className={styles.userProfile__settingsSection}>
          <h3 className={styles.userProfile__settingsTitle}>Уровень сложности</h3>
          <DifficultySelector
            currentDifficulty={profile.preferredDifficulty}
            onSelect={updateDifficulty}
          />
        </div>
      </div>

      {/* Модальное окно выбора аватара */}
      {showAvatarSelector && (
        <Modal
          isOpen={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          className={styles.userProfile__modal}
        >
          <AvatarSelector
            currentAvatarId={validAvatarId}
            onSelect={handleAvatarSelect}
            onCancel={() => setShowAvatarSelector(false)}
          />
        </Modal>
      )}
    </div>
  );
};
