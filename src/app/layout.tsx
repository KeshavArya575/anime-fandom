// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PopularityPanel from '@/components/PopularityPanel';
import MicroFeed from '@/components/MicroFeed';
import UpcomingReleases from '@/components/UpcomingReleases';
import Footer from '@/components/Footer'; // ✅ 1. Import the new Footer
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        {/* ✅ 2. Wrap everything in a flex column */}
        <div className="flex min-h-screen flex-col">
          <Header />
          {/* ✅ 3. This container will now grow to fill available space */}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <div className="flex flex-1">
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
              <aside className="hidden w-80 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-6 lg:block">
                <div className="space-y-6">
                  <PopularityPanel />
                  <MicroFeed />
                  <UpcomingReleases />
                </div>
              </aside>
            </div>
          </div>
          <Footer /> {/* ✅ 4. Add the Footer at the end */}
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}