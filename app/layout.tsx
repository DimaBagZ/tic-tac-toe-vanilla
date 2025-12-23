import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Крестики-нолики",
    template: "%s | Крестики-нолики",
  },
  description:
    "Играйте в крестики-нолики против искусственного интеллекта разных уровней сложности. Получайте промокоды при победе, отслеживайте статистику и достижения. Красивая игра для всех возрастов.",
  keywords: [
    "крестики-нолики",
    "tic-tac-toe",
    "игра",
    "искусственный интеллект",
    "ИИ",
    "промокоды",
    "статистика",
    "достижения",
  ],
  authors: [{ name: "DimaBagZ" }],
  creator: "DimaBagZ",
  publisher: "DimaBagZ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://tic-tac-toe-vanilla.vercel.app",
    title: "Крестики-нолики - Игра против ИИ",
    description:
      "Играйте в крестики-нолики против искусственного интеллекта. Получайте промокоды при победе!",
    siteName: "Крестики-нолики",
  },
  twitter: {
    card: "summary_large_image",
    title: "Крестики-нолики - Игра против ИИ",
    description:
      "Играйте в крестики-нолики против искусственного интеллекта. Получайте промокоды при победе!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function handleChunkError(error) {
                  const message = error?.message || error || '';
                  if (
                    message.includes('ChunkLoadError') ||
                    message.includes('Failed to fetch dynamically imported module') ||
                    message.includes('Loading chunk') ||
                    error?.name === 'ChunkLoadError'
                  ) {
                    console.warn('Обнаружена ошибка загрузки chunk, перезагружаем страницу...');
                    setTimeout(function() {
                      window.location.reload();
                    }, 100);
                    return true;
                  }
                  return false;
                }
                
                window.addEventListener('error', function(event) {
                  if (handleChunkError(event.error || event)) {
                    event.preventDefault();
                  }
                });
                
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason;
                  const message = typeof reason === 'string' ? reason : reason?.message || '';
                  if (
                    message.includes('ChunkLoadError') ||
                    message.includes('Failed to fetch dynamically imported module') ||
                    message.includes('Loading chunk')
                  ) {
                    console.warn('Обнаружена ошибка загрузки chunk в Promise, перезагружаем страницу...');
                    event.preventDefault();
                    setTimeout(function() {
                      window.location.reload();
                    }, 100);
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
