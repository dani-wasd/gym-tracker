import Link from "next/link";
import { login } from "../actions";
import { AuthForm } from "@/src/components/auth/auth-form";
import { Field } from "@/src/components/ui/field";
import { ROUTES } from "@/src/lib/routes";

export default function LoginPage() {
  return (
    <>
      <h1 className="headline text-8xl">Clock in</h1>

      <AuthForm action={login} submitLabel="Sign in">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </AuthForm>

      <p className="text-sm text-steel">
        Not a member?{" "}
        <Link href={ROUTES.signup} className="text-chalk underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </>
  );
}
