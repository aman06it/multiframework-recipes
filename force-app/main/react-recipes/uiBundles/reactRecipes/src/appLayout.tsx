import { Outlet } from 'react-router';
import Navbar from '@/components/app/Navbar';
import Footer from '@/components/app/Footer';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
