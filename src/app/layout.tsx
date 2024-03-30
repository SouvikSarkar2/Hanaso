import "~/styles/globals.css";
import localfont from "next/font/local";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProviders } from "./_components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cerlions = localfont({
  src: [
    {
      path: "../fonts/Cerlions-Regular.otf",
    },
  ],
  variable: "--font-cerlions",
});

const ageya = localfont({
  src: [
    {
      path: "../fonts/Ageya.otf",
    },
  ],
  variable: "--font-ageya",
});

const canopee = localfont({
  src: [
    {
      path: "../fonts/Canopee Regular.otf",
    },
  ],
  variable: "--font-canopee",
});

const confillia = localfont({
  src: [
    {
      path: "../fonts/ConfilliaBold.otf",
    },
  ],
  variable: "--font-confillia",
});

const dahlia = localfont({
  src: [
    {
      path: "../fonts/dahlia-regular.otf",
    },
  ],
  variable: "--font-dahlia",
});

const quigly = localfont({
  src: [
    {
      path: "../fonts/QUIGLEYW.ttf",
    },
  ],
  variable: "--font-quigly",
});

const urbanist = localfont({
  src: [
    {
      path: "../fonts/Urbanist-Medium.ttf",
    },
  ],
  variable: "--font-urbanist",
});

export const metadata = {
  title: "H A N A S O",
  description: "A T3 CHAT-APP",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${quigly.variable} ${cerlions.variable} ${ageya.variable} ${canopee.variable} ${confillia.variable} ${dahlia.variable} ${inter.className}`}
      >
        <TRPCReactProvider>
          <ThemeProviders>{children}</ThemeProviders>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
