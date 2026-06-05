import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400/30 dark:bg-purple-800/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-pink-400/20 dark:bg-pink-800/20 rounded-full blur-3xl animate-float animate-delay-1000" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-800/20 rounded-full blur-3xl animate-float animate-delay-2000" />
      </div>
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}