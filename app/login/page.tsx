import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">Sign in</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="text-sm text-neutral-500 text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline text-neutral-900">
          Sign up
        </Link>
      </p>
    </div>
  );
}
