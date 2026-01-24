"use client";

import { BrainIcon } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

export default function Navbar({ links = [] }) {
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center justify-between py-4 px-6 md:px-20 border-b border-border backdrop-blur-lg bg-background/80 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <BrainIcon className="w-6 h-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Resuvo
          </span>
        </Link>
      </div>
      <div className="hidden md:flex gap-6">
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <SignInButton />}
      </div>
    </nav>
  );
}
