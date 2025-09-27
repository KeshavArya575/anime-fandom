// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <div className="grid h-full grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex h-full flex-col">
            <Header />
            {/* This makes the main content scrollable */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}