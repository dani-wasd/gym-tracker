import { and, eq, or } from "drizzle-orm";
import { db } from "@/src/lib/db/connection";
import { friendships, users, type User } from "@/src/lib/db/schemas";

/**
 * Convention: `userOneId` sent the request, `userTwoId` received it.
 * Only the receiver can accept; either side can remove.
 */
export type Friendship = typeof friendships.$inferSelect;

export interface FriendLink {
  friendshipId: string;
  user: User;
}

export interface FriendCircle {
  friends: FriendLink[];
  /** Requests waiting on me. */
  incoming: FriendLink[];
  /** Requests I sent that haven't been answered. */
  outgoing: FriendLink[];
}

const involves = (userId: string) =>
  or(eq(friendships.userOneId, userId), eq(friendships.userTwoId, userId));

export async function getFriendCircle(userId: string): Promise<FriendCircle> {
  const rows = await db
    .select({ friendship: friendships, user: users })
    .from(friendships)
    .innerJoin(
      users,
      or(
        and(eq(friendships.userOneId, userId), eq(users.userId, friendships.userTwoId)),
        and(eq(friendships.userTwoId, userId), eq(users.userId, friendships.userOneId)),
      ),
    )
    .where(involves(userId))
    .orderBy(users.username);

  const circle: FriendCircle = { friends: [], incoming: [], outgoing: [] };
  for (const { friendship, user } of rows) {
    const link = { friendshipId: friendship.id, user };
    if (friendship.status === "accepted") circle.friends.push(link);
    else if (friendship.userTwoId === userId) circle.incoming.push(link);
    else circle.outgoing.push(link);
  }
  return circle;
}

/** The friendship between two users, whichever of them asked first. */
export async function findFriendshipBetween(
  userA: string,
  userB: string,
): Promise<Friendship | null> {
  const [friendship] = await db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.userOneId, userA), eq(friendships.userTwoId, userB)),
        and(eq(friendships.userOneId, userB), eq(friendships.userTwoId, userA)),
      ),
    )
    .limit(1);
  return friendship ?? null;
}

export async function createFriendRequest(
  requesterId: string,
  receiverId: string,
): Promise<void> {
  await db
    .insert(friendships)
    .values({ userOneId: requesterId, userTwoId: receiverId, status: "pending" })
    .onConflictDoNothing();
}

/** Accepts a pending request. No-op unless `receiverId` is who it was sent to. */
export async function acceptFriendRequest(
  friendshipId: string,
  receiverId: string,
): Promise<void> {
  await db
    .update(friendships)
    .set({ status: "accepted" })
    .where(
      and(
        eq(friendships.id, friendshipId),
        eq(friendships.userTwoId, receiverId),
        eq(friendships.status, "pending"),
      ),
    );
}

/** Declines, cancels or unfriends. No-op unless `userId` is part of it. */
export async function deleteFriendship(
  friendshipId: string,
  userId: string,
): Promise<void> {
  await db
    .delete(friendships)
    .where(and(eq(friendships.id, friendshipId), involves(userId)));
}
