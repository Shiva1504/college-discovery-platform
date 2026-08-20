import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">
        Create an account
      </h1>
      <SignupForm />
      <p className="text-sm text-neutral-500 text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="underline text-neutral-900">
          Sign in
        </Link>
      </p>
    </div>
  );
}
