import { removeFriendship } from "@/src/app/(app)/friends/actions";
import { WeekStack } from "@/src/components/stack/week-stack";
import { ConfirmButton } from "@/src/components/ui/confirm-button";
import { describeWeek, type WeekSummary } from "@/src/lib/week";

export interface FriendWeek {
  friendshipId: string;
  username: string;
  /** Their wall clock right now, e.g. "Tue 9:14 PM". */
  localClock: string;
  /** e.g. "UTC+08:00" */
  offset: string;
  week: WeekSummary;
}

/** One friend on the rack: their week, judged on their own clock. */
export function FriendRow({ friend }: { friend: FriendWeek }) {
  return (
    <li className="border-b border-iron py-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="headline text-5xl">{friend.username}</h3>
          <p className="mt-2 font-display text-xl leading-none font-bold uppercase tracking-wide text-steel">
            {describeWeek(friend.week)}
          </p>
        </div>
        <p className="eyebrow text-right">
          Their clock: {friend.localClock}
          <br />
          {friend.offset}
        </p>
      </div>

      <WeekStack summary={friend.week} size="sm" />

      <form action={removeFriendship.bind(null, friend.friendshipId)} className="mt-3 flex justify-end">
        <ConfirmButton>Drop from rack</ConfirmButton>
      </form>
    </li>
  );
}
