"use client";

import { login } from './actions'
import { GlowCard, GlowCardContent } from "@/src/components/ui/glow-card";

export default function Login() {
  return (
    <main className="flex items-center justify-center h-screen">
      <GlowCard>
        <GlowCardContent>
          <form className="flex flex-col pt-2">
            <label>Email: </label>
            <input type="email" name="email" />
            <label>Password: </label>
            <input type="password" name="password" />
            <button formAction={login}>Login</button>
          </form>
          <small>Not a member? <a href="/signup">Sign up</a></small>
        </GlowCardContent>
      </GlowCard>
    </main>
  );
}