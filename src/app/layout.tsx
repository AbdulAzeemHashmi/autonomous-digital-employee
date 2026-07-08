import type { ReactNode } from 'react';
import './globals.css';
export const metadata = { title: 'Digital FTE', description: 'AI Agent Workstation' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}
