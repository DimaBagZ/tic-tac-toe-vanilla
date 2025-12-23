/**
 * API Route для отправки сообщений в Telegram
 * Соблюдает принцип Single Responsibility
 */

import { NextRequest, NextResponse } from "next/server";
import { TelegramService } from "@/services/telegram";
import type { TelegramSendMessageRequest } from "@/types/api.types";

/**
 * POST endpoint для отправки сообщений в Telegram
 */
export async function POST(request: NextRequest) {
  try {
    // Валидация метода
    if (request.method !== "POST") {
      return NextResponse.json({ error: "Метод не разрешен" }, { status: 405 });
    }

    // Парсинг тела запроса
    let body: TelegramSendMessageRequest;
    try {
      body = (await request.json()) as TelegramSendMessageRequest;
    } catch {
      return NextResponse.json({ error: "Неверный формат JSON" }, { status: 400 });
    }

    // Валидация данных
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Поле 'message' обязательно и должно быть строкой" },
        { status: 400 }
      );
    }

    // Создание сервиса
    let telegramService: TelegramService;
    try {
      telegramService = TelegramService.createFromEnv();
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Ошибка конфигурации Telegram",
        },
        { status: 500 }
      );
    }

    // Отправка сообщения
    let result;
    if (body.code) {
      // Отправка сообщения о победе с промокодом
      result = await telegramService.sendWinMessage(body.code);
    } else {
      // Отправка обычного сообщения
      result = await telegramService.sendMessage(body.message);
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Ошибка отправки сообщения",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Сообщение отправлено успешно",
        messageId: result.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка в API Route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
