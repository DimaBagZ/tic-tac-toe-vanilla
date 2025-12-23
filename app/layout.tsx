import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Крестики-нолики",
  description: "Игра крестики-нолики против компьютера",
  authors: [{ name: "DimaBagZ" }],
  creator: "DimaBagZ",
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
