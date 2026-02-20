"use client";

import { signup } from '../actions'
import { GlowCard, GlowCardContent } from "@/src/components/ui/glow-card";

export default function Login() {
  return (
    <main className="flex items-center justify-center h-screen">
      <GlowCard>
        <GlowCardContent>
          <form className="flex flex-col pt-2">
            <label>Username: </label>
            <input type="text" name="username" />
            <label>Email: </label>
            <input type="email" name="email" />
            <label>Password: </label>
            <input type="password" name="password" />
            <button formAction={signup}>Sign up</button>
          </form>
        </GlowCardContent>
      </GlowCard>
    </main>
  );
}