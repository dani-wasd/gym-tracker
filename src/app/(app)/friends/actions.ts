"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/src/lib/auth";
import {
  acceptFriendRequest,
  createFriendRequest,
  deleteFriendship,
  findFriendshipBetween,
} from "@/src/lib/data/friends";
import { findUserByEmail } from "@/src/lib/data/users";
import type { ActionResult } from "@/src/lib/definitions";
import { ROUTES } from "@/src/lib/routes";
import { normalizeEmail } from "@/src/lib/validation";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Same answer whether or not the account exists, so emails can't be probed.
const REQUEST_SENT: ActionResult = {
  ok: true,
  message: "Sent. If that email has an account, they'll see your request.",
};

export async function sendFriendRequest(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await requireProfile();

  const email = normalizeEmail(formData.get("email"));
  if (!email) return { ok: false, error: "Enter a valid email address." };
  if (email === profile.email.toLowerCase()) {
    return { ok: false, error: "That's your own email." };
  }

  const target = await findUserByEmail(email);
  if (!target) return REQUEST_SENT;

  const existing = await findFriendshipBetween(profile.userId, target.userId);
  if (!existing) {
    await createFriendRequest(profile.userId, target.userId);
  } else if (existing.status === "pending" && existing.userTwoId === profile.userId) {
    // They had already asked us — sending one back is a yes.
    await acceptFriendRequest(existing.id, profile.userId);
  }

  revalidatePath(ROUTES.friends);
  return REQUEST_SENT;
}

export async function acceptRequest(friendshipId: string): Promise<void> {
  const profile = await requireProfile();
  if (!UUID_PATTERN.test(friendshipId)) return;

  await acceptFriendRequest(friendshipId, profile.userId);
  revalidatePath(ROUTES.friends);
}

/** Declines an incoming request, cancels an outgoing one, or unfriends. */
export async function removeFriendship(friendshipId: string): Promise<void> {
  const profile = await requireProfile();
  if (!UUID_PATTERN.test(friendshipId)) return;

  await deleteFriendship(friendshipId, profile.userId);
  revalidatePath(ROUTES.friends);
}
