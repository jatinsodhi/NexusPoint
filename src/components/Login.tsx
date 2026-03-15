import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
  Menu,
  X
} from 'lucide-react';
import Footer from './Footer';
import About from './About';
import Contact from './Contact';

export default function Login() {
  const [page, setPage] = useState<'home' | 'about' | 'contact'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const navigate = (p: 'home' | 'about' | 'contact') => {
    setPage(p);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      {/* Landing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 font-bold text-xl">C</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">CollabHub</h1>
          </button>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('home')} className={`text-sm font-bold transition-colors ${page === 'home' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}>Home</button>
            <button onClick={() => navigate('about')} className={`text-sm font-bold transition-colors ${page === 'about' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}>About</button>
            <button onClick={() => navigate('contact')} className={`text-sm font-bold transition-colors ${page === 'contact' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}>Contact</button>
            <button 
              onClick={handleLogin}
              className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              Get Started
            </button>
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-900 dark:text-white">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 p-8 space-y-6 animate-in slide-in-from-top-4">
            <button onClick={() => navigate('home')} className="block w-full text-left text-lg font-bold text-zinc-900 dark:text-white">Home</button>
            <button onClick={() => navigate('about')} className="block w-full text-left text-lg font-bold text-zinc-900 dark:text-white">About</button>
            <button onClick={() => navigate('contact')} className="block w-full text-left text-lg font-bold text-zinc-900 dark:text-white">Contact</button>
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {page === 'home' && (
          <>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 pt-48 pb-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-8">
                <Sparkles className="w-4 h-4 text-amber-500" />
                The future of team collaboration
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 dark:text-white tracking-tight mb-8 leading-[0.9]">
                Work together,<br />
                <span className="text-zinc-400">anywhere.</span>
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                CollabHub brings your team's projects, tasks, and conversations into one 
                seamless real-time workspace. Boost productivity with AI-powered assistance.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleLogin}
                  className="w-full md:w-auto px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-zinc-900/20 dark:shadow-white/5"
                >
                  Start Collaborating Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full md:w-auto px-10 py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="mt-24 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent z-10" />
                <img 
                  src="https://picsum.photos/seed/dashboard/1200/800" 
                  alt="Dashboard Preview" 
                  className="rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
                  referrerPolicy="no-referrer"
                />
              </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="bg-zinc-50 dark:bg-zinc-900/50 py-32 px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                  <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Everything you need to ship faster</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">Powerful tools designed for modern teams who value speed and clarity.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: LayoutDashboard, title: "Kanban Boards", desc: "Visualize your workflow and track progress with intuitive drag-and-drop boards." },
                    { icon: MessageSquare, title: "Real-time Chat", desc: "Keep the conversation going with instant messaging built right into your workspace." },
                    { icon: Sparkles, title: "AI Assistant", desc: "Leverage Gemini AI to manage tasks, summarize discussions, and boost efficiency." },
                    { icon: Zap, title: "Instant Sync", desc: "Every change is synchronized across all team members instantly with zero lag." },
                    { icon: Shield, title: "Role-based Access", desc: "Granular permissions ensure the right people have the right access to your projects." },
                    { icon: Globe, title: "Global Teams", desc: "Built for remote-first teams working across time zones and continents." }
                  ].map((feature, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all group">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-8 text-center">
              <div className="max-w-3xl mx-auto bg-zinc-900 dark:bg-white rounded-[3rem] p-16 text-white dark:text-zinc-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <h2 className="text-4xl font-bold mb-6">Ready to transform your team?</h2>
                <p className="text-zinc-400 dark:text-zinc-500 mb-10 text-lg">Join thousands of teams already using CollabHub to build the future.</p>
                <button
                  onClick={handleLogin}
                  className="px-10 py-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all inline-flex items-center gap-3"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </section>
          </>
        )}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
