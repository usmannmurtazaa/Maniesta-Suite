import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      {/* Dynamic animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-pink-400/20 dark:bg-pink-800/20 rounded-full blur-3xl animate-float animate-delay-1000" />
        <div className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-400/20 dark:bg-indigo-800/20 rounded-full blur-3xl animate-float animate-delay-2000" />
        <div className="absolute bottom-0 right-20 w-[300px] h-[300px] bg-violet-400/15 dark:bg-violet-800/15 rounded-full blur-3xl animate-float animate-delay-3000" />
      </div>
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
