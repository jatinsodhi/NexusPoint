import React from 'react';
import { Users, Target, Heart, Award, Sparkles, Zap, Shield, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mission Section */}
        <section className="text-center mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-8">
            <Target className="w-4 h-4 text-zinc-900 dark:text-white" />
            Our Mission
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">
            Empowering teams to <br />
            <span className="text-zinc-400">build the future.</span>
          </h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            At CollabHub, we believe that the best work happens when teams are in sync. 
            Our mission is to provide the tools that bridge the gap between ideas and 
            execution, no matter where your team is located.
          </p>
        </section>

        {/* Values Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { 
              icon: Heart, 
              title: "User-Centric", 
              desc: "We build for the people who use our tools every day. Your productivity is our priority." 
            },
            { 
              icon: Award, 
              title: "Excellence", 
              desc: "We strive for perfection in every pixel and every line of code we write." 
            },
            { 
              icon: Sparkles, 
              title: "Innovation", 
              desc: "We're constantly pushing the boundaries of what's possible in team collaboration." 
            }
          ].map((value, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{value.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="bg-zinc-900 dark:bg-white rounded-[3rem] p-16 text-white dark:text-zinc-900 mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Users", value: "500K+" },
              { label: "Teams", value: "25K+" },
              { label: "Tasks Completed", value: "10M+" },
              { label: "Uptime", value: "99.9%" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-zinc-400 dark:text-zinc-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <p>
                Founded in 2024, CollabHub started as a small project to help a remote team 
                stay organized. We quickly realized that the problems we were solving 
                were universal.
              </p>
              <p>
                Today, we're a global team ourselves, building the platform we use 
                every single day. We're passionate about remote work, productivity, 
                and helping teams reach their full potential.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-zinc-900/10 dark:bg-white/10 rounded-3xl -rotate-3" />
            <img 
              src="https://picsum.photos/seed/team/800/600" 
              alt="Our Team" 
              className="relative rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
