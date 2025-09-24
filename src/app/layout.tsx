// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <div className="grid grid-cols-[280px_1fr] h-full">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex flex-col h-full">
            <Header />
            {/* This makes the main content scrollable */}
            <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}