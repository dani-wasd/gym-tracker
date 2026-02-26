'use server'

import { db } from '@/src/lib/db/connection'
import { users } from '@/src/lib/db/schemas/users.schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // TODO: validate inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  console.log('User logged in:', data.email)

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (!error && authData.user) {
    await db.insert(users).values({
      userId: authData.user.id, // Use the ID from Supabase Auth
      email: data.email,
      username: formData.get('username') as string,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  }
  else {
    redirect('/error')
  }

  console.log('User signed up:', data.email)

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}