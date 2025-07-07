import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habilidade - Plataforma de Ensino Online",
  description: "Transforme seu futuro com educação de qualidade. Aprenda com os melhores profissionais e domine as tecnologias mais demandadas do mercado.",
  keywords: "educação online, cursos, tecnologia, programação, design, marketing digital",
  authors: [{ name: "Habilidade" }],
  openGraph: {
    title: "Habilidade - Plataforma de Ensino Online",
    description: "Transforme seu futuro com educação de qualidade",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
