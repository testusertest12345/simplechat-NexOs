"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Globe,
  Database,
  Lock,
  ClipboardList,
  ShieldCheck,
  UserCheck,
  Trash2,
  EyeOff,
} from "lucide-react";
const rights = [
  {
    icon: UserCheck,
    title: "Data Export",
    description: "You can download a complete copy of all your personal data at any time directly from your account settings, giving you full visibility of what we store.",
  },
  {
    icon: Trash2,
    title: "Right to Deletion",
    description: "Request permanent deletion of your account and all associated data. This action is irreversible. Accounts that do not comply with our Privacy Policy may be suspended or deleted.",
  },
  {
    icon: EyeOff,
    title: "Opt-Out",
    description: "You can disable optional analytics and cookies at any time, giving you control over which data is collected while still enjoying the game.",
  },
];


export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 relative">
      <Image
          src="/privacy.jpg"
          alt="Privacy Header"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-10 opacity-20"
        />
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="px-6 md:px-12 py-10 text-center relative z-10">
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          Privacy & Policy
        </motion.h1>
      </motion.header>

      <main className="flex-1 relative z-10 px-2 md:px-12 pb-20 space-y-20">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-[linear-gradient(135deg,rgba(25,28,38,0.85),rgba(15,17,25,0.6))]
                        backdrop-blur-xl border border-green-500/20 rounded-3xl 
                        p-10 md:p-14 shadow-2xl overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-green-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shadow-inner shadow-green-500/20">
                <ShieldCheck className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Your Privacy Matters
              </h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Sensitive data is <strong className="text-green-400">end-to-end encrypted</strong> and
              never shared with third parties. You may request export or deletion of your data anytime.
            </p>
            <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto">
                <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                Download Data
                </button>
                <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                Request Data Deletion
                </button>
            </div>
          </div>
        </motion.section>
        <section>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
            Your Rights
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {rights.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 20 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg hover:border-white/20 transition"
              >
                <r.icon className="h-6 w-6 text-green-400 mb-3" />
                <h4 className="text-lg font-semibold mb-2">{r.title}</h4>
                <p className="text-sm text-gray-400">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
            Data Categories
          </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
                {
                id: "public",
                title: "Public Data",
                description: "Visible to all players in the multiplayer world.",
                icon: Globe,
                items: [
                    "Username & avatar",
                    "Public chat messages",
                    "Shared exploration progress",
                    "Player level & achievements",
                ],
                },
                {
                id: "collected",
                title: "Collected Data",
                description: "Gameplay and technical data for performance and stability.",
                icon: Database,
                items: [
                    "Session logs (time, areas visited, interactions)",
                    "Performance stats (FPS, ping, crashes)",
                    "Multiplayer activity (parties, trades, events)",
                    "Bug reports & analytics",
                ],
                },
                {
                id: "private",
                title: "Private Data",
                description: "Sensitive data stored securely and never shared.",
                icon: Lock,
                items: [
                    "Email (account only)",
                    "Encrypted login credentials",
                    "Payment history (if applicable)",
                    "Security logs",
                ],
                },
            ].map((section, i) => (
                <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 120, damping: 20 }}
                className="bg-[linear-gradient(135deg,rgba(12,14,20,0.7),rgba(8,10,15,0.5))]
                            backdrop-blur-xl border border-white/10 rounded-2xl
                            p-6 shadow-xl hover:border-white/20 hover:shadow-2xl
                            transition-all flex flex-col"
                >
                <div className="flex items-center gap-3 mb-4">
                    <section.icon className="h-6 w-6 text-white/90" />
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                <ul className="space-y-2 text-sm text-gray-300">
                    {section.items.map((item, j) => (
                    <li
                        key={j}
                        className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg"
                    >
                        <ClipboardList className="h-4 w-4 text-gray-400" />
                        {item}
                    </li>
                    ))}
                </ul>
                </motion.div>
            ))}
            </div>
        </section>

      </main>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-10 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl animate-pulse" />
      </div>
    </div>
  );
}