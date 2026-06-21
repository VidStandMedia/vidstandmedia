"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {!session ? (
          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 bg-black text-white rounded-xl"
          >
            Sign in with YouTube
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-xl">
              Signed in as {session.user?.email}
            </p>

            <button
              onClick={() => signOut()}
              className="px-6 py-3 bg-red-500 text-white rounded-xl"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </main>
  );
}