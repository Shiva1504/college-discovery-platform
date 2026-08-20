import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export async function Nav() {
  const session = await auth();

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-neutral-900 tracking-tight">
          CollegeFind
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/colleges"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            Explore
          </Link>
          <Link
            href="/compare"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            Compare
          </Link>
          <Link
            href="/account/saved"
            className="px-3 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            Saved
          </Link>
          {session?.user ? (
            <>
              <span className="ml-2 px-3 py-1.5 text-neutral-500 hidden sm:inline">
                {session.user.name ?? session.user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-3 py-1.5 rounded-md bg-neutral-900 text-white hover:bg-neutral-700"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
