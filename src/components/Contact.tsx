import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">
            Get in <span className="text-zinc-400">touch.</span>
          </h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about CollabHub? Our team is here to help you 
            get the most out of your workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Mail, title: "Email Us", detail: "support@collabhub.com", sub: "Response within 24h" },
                { icon: Phone, title: "Call Us", detail: "+1 (555) 000-0000", sub: "Mon-Fri, 9am-6pm EST" },
                { icon: MapPin, title: "Visit Us", detail: "123 Innovation Way", sub: "San Francisco, CA 94105" },
                { icon: MessageSquare, title: "Live Chat", detail: "Available 24/7", sub: "For Enterprise customers" }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-zinc-900 dark:text-white font-medium mb-1">{item.detail}</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
              <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Global Support</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                We have support teams across North America, Europe, and Asia to ensure 
                you get the help you need, regardless of your time zone.
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900"
                    alt="Support Team"
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                  +12
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-900/5">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-zinc-900 dark:text-white font-bold underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subject</label>
                  <select className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all dark:text-white appearance-none">
                    <option>General Inquiry</option>
                    <option>Sales & Enterprise</option>
                    <option>Technical Support</option>
                    <option>Billing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Message</label>
                  <textarea 
                    required
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all dark:text-white resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-zinc-900/20 dark:shadow-white/5"
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
