"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center px-6 animate__animated animate__fadeIn">
      {/* 404 Number */}
      <h1 className="text-[8rem] sm:text-[10rem] font-bold tracking-tight text-primary drop-shadow-md animate__animated animate__pulse animate__infinite">
        404
      </h1>

      {/* Message */}
      <h2 className="text-2xl sm:text-3xl font-semibold mt-4">
        Oops! Page not found.
      </h2>
      <p className="mt-3 text-muted-foreground max-w-md">
        Looks like you’ve wandered off the map. The page you’re looking for doesn’t exist or might have been moved.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="mt-8 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        Go back home
      </Link>
    </div>
  )
}
