"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto h-20 px-8 flex items-center">

        {/* Logo + Brand */}

        <Link
          href="/"
          className="flex items-center gap-3 text-3xl font-extrabold text-white hover:text-red-500 transition mr-16"
        >
          <Image
            src="/logo.png"
            alt="VidStandMedia Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />

          <span>
            VidStandMedia
          </span>
        </Link>


        {/* Navigation */}

        <nav className="flex flex-1 items-center gap-12 text-lg">

          <Link
            href="/faq"
            className="text-white hover:text-red-500 transition"
          >
            FAQ
          </Link>

          <Link
            href="/terms"
            className="text-white hover:text-red-500 transition"
          >
            Terms of Service
          </Link>

          <Link
            href="/#about"
            className="text-white hover:text-red-500 transition"
          >
            About Us
          </Link>

        </nav>


        {/* Account Button */}

        {session ? (
          <div className="flex items-center gap-4">

            <Link
              href="/onboarding"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              My Campaign
            </Link>

            <button
              onClick={() => signOut()}
              className="text-white hover:text-red-500 transition"
            >
              Sign Out
            </button>

          </div>
        ) : (
          <Link
            href="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Login / Sign Up
          </Link>
        )}

      </div>
    </header>
  );
}