import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

const geistSans = localFont({
  src: [
    {
      path: './fonts/Geist-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: './fonts/Geist-Italic-VariableFont_wght.ttf',
      style: 'italic',
    }
  ],
  variable: '--font-geist-sans',
});

export const metadata = {
  title: 'PersonaIQ',
  description: 'AI-powered Presence Engine',
  icons: {
    icon: '/icon.png',
  },
};

import { AuthProvider } from '@/providers/auth-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${GeistMono.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
