import { cache } from "react";
import { FriendRow, type FriendWeek } from "@/src/components/friends/friend-row";
import { RequestList } from "@/src/components/friends/request-list";
import { EmptyStack } from "@/src/components/stack/stack";
import { LoadingRegion, SkeletonText } from "@/src/components/ui/skeleton";
import { requireProfile } from "@/src/lib/auth";
import { getFriendCircle, type FriendLink } from "@/src/lib/data/friends";
import { timezoneOf } from "@/src/lib/data/users";
import { getCurrentWeek } from "@/src/lib/data/week-summary";
import { localClockLabel, timezoneOffsetLabel } from "@/src/lib/dates";

/* The data-backed parts of the friends tab. All three lists share one fetch. */

const loadCircle = cache(async () => {
  const profile = await requireProfile();
  return getFriendCircle(profile.userId);
});

async function toFriendWeek({ friendshipId, user }: FriendLink): Promise<FriendWeek> {
  const timezone = timezoneOf(user);
  return {
    friendshipId,
    username: user.username,
    localClock: localClockLabel(timezone),
    offset: timezoneOffsetLabel(timezone),
    week: (await getCurrentWeek(user)).summary,
  };
}

export async function FriendsSection() {
  const circle = await loadCircle();
  const friends = await Promise.all(circle.friends.map(toFriendWeek));

  if (friends.length === 0) {
    return (
      <p className="max-w-md text-sm text-steel">
        No friends yet. Send a request below. Once they accept, you&apos;ll see
        each other&apos;s week.
      </p>
    );
  }

  return (
    <ul className="border-t border-iron">
      {friends.map((friend) => (
        <FriendRow key={friend.friendshipId} friend={friend} />
      ))}
    </ul>
  );
}

export function FriendsSkeleton() {
  return (
    <LoadingRegion label="friends">
      <ul className="border-t border-iron">
        {["6ch", "9ch"].map((nameWidth) => (
          <li key={nameWidth} className="border-b border-iron py-8">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <SkeletonText width={nameWidth} className="headline text-5xl" />
                <SkeletonText width="18ch" className="mt-2 font-display text-xl" />
              </div>
              <SkeletonText width="20ch" lines={2} className="eyebrow" />
            </div>
            <div className="mt-6 flex items-center gap-5">
              <EmptyStack size="sm" />
              <div className="min-h-14 flex-1 border-l-4 border-iron pl-4">
                <SkeletonText width="16ch" className="font-display text-xl" />
                <SkeletonText width="28ch" className="mt-2 text-xs" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}

export async function IncomingRequests() {
  const { incoming } = await loadCircle();
  return <RequestList title="Requests for you" direction="incoming" requests={incoming} />;
}

export async function OutgoingRequests() {
  const { outgoing } = await loadCircle();
  return <RequestList title="Requests you sent" direction="outgoing" requests={outgoing} />;
}
