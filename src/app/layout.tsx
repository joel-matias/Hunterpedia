import type { Metadata } from "next";
import { Geist, Geist_Mono, Bangers } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hunterpedia",
  description: "Hunterpedia: información de personajes de Hunter × Hunter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} antialiased bg-(--color-fondo)`}>
        <main className="min-h-screen bg-(--color-fondo)">
          <header className="sticky top-0 z-40 w-full bg-black/70 backdrop-blur-md border-b border-white/8">
            <div className="w-full px-6 md:px-12 py-4 flex flex-col items-center justify-center gap-0.5">
              <Link href="/" className="text-4xl md:text-5xl font-bangers tracking-widest text-(--color-boton) hover:opacity-80 transition-opacity">
                Hunterpedia
              </Link>
              <p className="text-[10px] md:text-xs tracking-[0.3em] text-white/30 uppercase font-sans">
                Hunter × Hunter — Enciclopedia
              </p>
            </div>
          </header>

          <section className="w-full">{children}</section>
        </main>
      </body>
    </html>
  );
}
