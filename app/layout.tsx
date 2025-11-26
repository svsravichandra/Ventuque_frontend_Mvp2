import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from 'next/font/google';
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ventique - Transform Your Photos into 3D Chibi Figurines",
  description: "Turn your memories into custom 3D-printed chibi-style car vent figurines. Premium quality, personalized designs with real-time 3D preview.",
  keywords: ["3D printing", "custom figurines", "chibi", "car accessories", "personalized gifts"],
  authors: [{ name: "Ventique" }],
  openGraph: {
    title: "Ventique - Custom 3D Chibi Figurines",
    description: "Transform your photos into unique 3D-printed car vent figurines",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
