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
      <body>{children}</body>
    </html>
  );
}

