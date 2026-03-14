import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoBackground from './VideoBackground';

export default function Layout() {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', position: 'relative' }}>
      <VideoBackground />
      <Navbar />
      <main className="container animate-fade-in" style={{ flex: 1, padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
