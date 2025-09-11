import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://passcodesapp.github.io/Passcodes-Website/"),
  title: {
    default: "Passcodes - Open Source Password Manager",
    template: "%s | Passcodes",
  },
  description: "Take Down the Headache of Remembering Passwords!!",
  // alternates: {
  //   canonical: "https://passcodesapp.github.io/Passcodes-Website/",
  //   languages: {
  //     "en-US": "https://passcodesapp.github.io/Passcodes-Website//en-US",
  //     "de-DE": "https://passcodesapp.github.io/Passcodes-Website//de-DE",
  //   },
  // },
  openGraph: {
    title: "Passcodes - Open Source Password Manager",
    description: "Take Down the Headache of Remembering Passwords!!",
    url: "https://passcodesapp.github.io/Passcodes-Website",
    siteName: "Passcodes",
    images: [
      {
        url: "https://passcodesapp.github.io/Passcodes-Website/public/passcodes-banner.png",
      },
      {
        url: "https://passcodesapp.github.io/Passcodes-Website/public/passcodes.png",
      },
    ],
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
