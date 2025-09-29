// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PopularityPanel from '@/components/PopularityPanel';
import { Toaster } from 'sonner'; // Import the Toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <div className="grid h-full grid-cols-[280px_1fr]">
          {/* Column 1: The Sidebar */}
          <Sidebar />

          {/* Column 2: The Main Content */}
          <div className="flex h-full flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
              {children}
            </main>
          </div>
        </div>
         <Toaster richColors />
      </body>
    </html>
  );
}