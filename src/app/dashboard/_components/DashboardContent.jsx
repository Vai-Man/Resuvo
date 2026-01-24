"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  FileText,
  Brain,
  Code,
  FileSearch,
  PenTool,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

const dashboardItems = [
  {
    title: "AI Mock Interviews",
    desc: "Practice with realistic, AI-driven interviews tailored to your role.",
    icon: Brain,
    href: "/dashboard/interview",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "Resume Builder",
    desc: "Create professional resumes with intelligent AI-assisted content.",
    icon: FileText,
    href: "/dashboard/resume-builder",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    title: "Resume Analyzer",
    desc: "Get ATS-optimized feedback and improve your resume's impact.",
    icon: FileSearch,
    href: "/dashboard/analyze-resume",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    title: "Technical Questions",
    desc: "Master coding challenges with detailed AI explanations.",
    icon: Code,
    href: "/dashboard/questions",
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    title: "Cover Letters",
    desc: "Generate compelling, job-specific cover letters instantly.",
    icon: PenTool,
    href: "/dashboard/cover-letter",
    color: "from-rose-500/20 to-rose-500/5",
  },
  {
    title: "Resume Signal Audit",
    desc: "Identify unsupported claims and vague language in your resume.",
    icon: Zap,
    href: "/dashboard/resume-signal-audit",
    color: "from-amber-500/20 to-amber-500/5",
  },
];

export function DashboardContent({ firstName }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Welcome Section */}
      <section className="px-6 md:px-20 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">Welcome to Resuvo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{firstName}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Select a tool below to begin your intelligent career preparation. Each feature is powered by advanced AI to help you excel.
          </p>
        </motion.div>
      </section>

      {/* Dashboard Grid */}
      <section className="px-6 md:px-20 pb-20 max-w-7xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={item.href}
                  className="group relative h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center text-primary transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {item.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <span>Get started</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
