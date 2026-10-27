import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'GoPratle | Event Requirement Posting Flow',
  description: 'Post and discover event requirements for Planners, Performers, and Crew members.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased">
        <Navbar />
        <main className="flex-1 py-8 px-4 sm:px-6">
          {children}
        </main>
        <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
          GoPratle Technical Assignment &bull; Built with Next.js, Express &amp; MongoDB
        </footer>
      </body>
    </html>
  );
}
