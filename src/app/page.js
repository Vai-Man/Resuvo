"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Zap, Target, TrendingUp, Brain, BookOpen, Award } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 md:px-20 pt-16 pb-20 md:py-24">
        {/* Gradient background blur */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="mb-6 inline-block">
            <span className="text-sm font-semibold text-primary px-4 py-2 bg-primary/10 rounded-full">
              AI-Powered Career Intelligence
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Master Your Career
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/70">
              With Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Resuvo combines AI-driven interview preparation, intelligent resume optimization, and skill insights to help you stand out and advance with confidence.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-block"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-lg hover:bg-primary/90 transition-all shadow-lg"
            >
              Start Preparing Smarter
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>


      </section>

      {/* Core Value Proposition */}
      <section className="py-24 px-6 md:px-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Resuvo
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for professionals who demand precision, clarity, and real results. Resuvo transforms preparation into strategy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Brain,
              title: "Intelligent Feedback",
              desc: "AI-powered analysis pinpoints your strengths and areas for growth with actionable insights.",
            },
            {
              icon: Target,
              title: "Precision Preparation",
              desc: "Target-specific interview questions, resume optimization, and skill assessments tailored to your goals.",
            },
            {
              icon: TrendingUp,
              title: "Measurable Progress",
              desc: "Track your improvement over time with detailed performance metrics and comparative analysis.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comprehensive Career Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to prepare, present, and perform at your best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Zap,
              title: "AI Mock Interviews",
              desc: "Practice with realistic, AI-driven interviews. Get real-time feedback on clarity, confidence, and technical depth.",
              features: ["Behavioral & Technical Questions", "Voice & Text Options", "Performance Analytics"],
            },
            {
              icon: BookOpen,
              title: "Smart Resume Intelligence",
              desc: "Upload, analyze, and optimize your resume. Get AI-powered suggestions for ATS compatibility and impact.",
              features: ["Keyword Optimization", "ATS Analysis", "Content Improvement"],
            },
            {
              icon: Target,
              title: "Cover Letter Mastery",
              desc: "Generate tailored cover letters that align with job descriptions and showcase your unique value.",
              features: ["Job-Specific Customization", "Tone Adjustment", "Quick Generation"],
            },
            {
              icon: Award,
              title: "Technical Skills Practice",
              desc: "Master coding challenges and technical concepts with guided AI feedback and best practices.",
              features: ["Multi-Language Support", "Difficulty Levels", "Detailed Solutions"],
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.desc}</p>
                    <ul className="space-y-2">
                      {feature.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 px-6 md:px-20 bg-muted/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/LandingPageMockInterviewImage.png"
              alt="Resuvo Interview Feature"
              width={500}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Interview Preparation Redefined
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Resuvo's AI interviewer adapts to your responses, delivering real-time feedback on communication, technical accuracy, and professional presence. Practice until you're confident, then ace your interviews.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Adaptive question difficulty based on performance",
                "Comprehensive feedback after each response",
                "Track improvement across multiple sessions",
                "Detailed performance reports and insights",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Build Your Career Edge
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-20"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Advance Your Career?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join professionals who are taking control of their career trajectory. Start your intelligent preparation today.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-block"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-lg hover:bg-primary/90 transition-all shadow-lg"
            >
              Explore Resuvo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-6 md:px-20 border-t border-border text-center text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto">
          <p>© {new Date().getFullYear()} Resuvo. All rights reserved.</p>
          <p className="mt-2 text-xs">Intelligence. Precision. Results.</p>
        </div>
      </footer>
    </div>
  );
}
