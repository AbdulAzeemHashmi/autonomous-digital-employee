import type { ReactNode } from 'react';
import './globals.css';
export const metadata = {
  title: 'Autonomous Digital Employee | AI Agent Workstation',
  description: 'Delegate tasks to your autonomous AI agent powered by Gemini and LangChain',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

