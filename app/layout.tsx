// @ts-nocheck
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { getGarrison365Config, buildCssVars } from '@/lib/garrison365-config';

import { Garrison365LivePreview } from '@/components/Garrison365LivePreview';
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Glow Wellness — Recovery · Float · Holistic Spa',
  description: 'Portland\'s premier recovery studio. Float therapy, infrared sauna, cryotherapy, massage, and curated wellness rituals.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getGarrison365Config();
  const vars = buildCssVars(cfg?.brand);
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} style={vars as React.CSSProperties}>
      <body>{children}<Garrison365LivePreview /></body>
    </html>
  );
}
