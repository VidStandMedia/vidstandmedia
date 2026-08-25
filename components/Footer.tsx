import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">

              <Image
                src="/logo.png"
                alt="VidStandMedia Logo"
                width={40}
                height={40}
              />

              <Link
  href="/"
  className="text-xl font-bold hover:text-red-500 transition"
>
  VidStandMedia
</Link>

            </div>

            <p className="mt-6 text-gray-400 leading-7">
              Helping YouTube creators grow with professionally
              managed Google Ads campaigns.
            </p>
          </div>

          {/* Navigation */}
          <div>

            <h3 className="text-lg font-semibold">
              Navigation
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link href="/faq" className="hover:text-red-500">
                FAQ
              </Link>

              <Link href="/terms" className="hover:text-red-500">
  Terms of Service
</Link>

<Link href="/privacy" className="hover:text-red-500">
  Privacy Policy
</Link>

<Link href="/#about" className="hover:text-red-500">
  About Us
</Link>

              <Link href="/login" className="hover:text-red-500">
                Login / Sign Up
              </Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h3 className="text-lg font-semibold">
              Contact
            </h3>

            <p className="mt-5 text-gray-400">
              support@vidstandmedia.com
            </p>

          </div>

          {/* Business */}
          <div>

            <h3 className="text-lg font-semibold">
              Business
            </h3>

            <div className="mt-5 space-y-3 text-gray-400">

              <p>Google Ads Management</p>

              <p>YouTube Promotion</p>

            </div>

          </div>

        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">

          © 2026 VidStandMedia. All rights reserved.

        </div>

      </div>
    </footer>
  );
}