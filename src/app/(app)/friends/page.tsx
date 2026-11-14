import { AddFriendForm } from "@/src/components/friends/add-friend-form";
import { FriendRow, type FriendWeek } from "@/src/components/friends/friend-row";
import { RequestList } from "@/src/components/friends/request-list";
import { requireProfile } from "@/src/lib/auth";
import { getFriendCircle, type FriendLink } from "@/src/lib/data/friends";
import { timezoneOf } from "@/src/lib/data/users";
import { getCurrentWeekSummary } from "@/src/lib/data/week-summary";
import { localClockLabel, timezoneOffsetLabel } from "@/src/lib/dates";

async function toFriendWeek({ friendshipId, user }: FriendLink): Promise<FriendWeek> {
  const timezone = timezoneOf(user);
  return {
    friendshipId,
    username: user.username,
    localClock: localClockLabel(timezone),
    offset: timezoneOffsetLabel(timezone),
    week: await getCurrentWeekSummary(user),
  };
}

export default async function FriendsPage() {
  const profile = await requireProfile();
  const circle = await getFriendCircle(profile.userId);
  const friends = await Promise.all(circle.friends.map(toFriendWeek));

  return (
    <div className="flex flex-col gap-14">
      <section>
        <p className="eyebrow">Friends · each week runs on its owner&apos;s clock</p>
        <h1 className="headline mt-2 text-[clamp(3.5rem,13vw,9rem)]">The rack</h1>
      </section>

      <RequestList title="Wants on your rack" direction="incoming" requests={circle.incoming} />

      {friends.length === 0 ? (
        <p className="max-w-md text-sm text-steel">
          Rack&apos;s empty. Add someone below — once they accept, their week hangs
          here and yours hangs on theirs. Nobody skips quietly.
        </p>
      ) : (
        <ul className="border-t border-iron">
          {friends.map((friend) => (
            <FriendRow key={friend.friendshipId} friend={friend} />
          ))}
        </ul>
      )}

      <section>
        <p className="eyebrow">Add a friend</p>
        <h2 className="headline mt-1 mb-6 text-5xl">Call a spotter</h2>
        <AddFriendForm />
      </section>

      <RequestList title="Waiting on them" direction="outgoing" requests={circle.outgoing} />
    </div>
  );
}
