import Link from "next/link";
import { signup } from "../actions";
import { AuthForm } from "@/src/components/auth/auth-form";
import { Field } from "@/src/components/ui/field";
import { ROUTES } from "@/src/lib/routes";

export default function SignupPage() {
  return (
    <>
      <h1 className="headline text-8xl">Join the rack</h1>

      <AuthForm action={signup} submitLabel="Create account" includeTimezone>
        <Field
          label="Username"
          name="username"
          required
          minLength={2}
          maxLength={24}
          autoComplete="username"
        />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </AuthForm>

      <p className="text-sm text-steel">
        Already lifting here?{" "}
        <Link href={ROUTES.login} className="text-chalk underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}
