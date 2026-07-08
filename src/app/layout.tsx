import './globals.css';
export const metadata = { title: 'Digital FTE', description: 'AI Agent Workstation' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}
