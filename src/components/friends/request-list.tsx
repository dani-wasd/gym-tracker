import { acceptRequest, removeFriendship } from "@/src/app/(app)/friends/actions";
import { Button } from "@/src/components/ui/button";
import type { FriendLink } from "@/src/lib/data/friends";

interface RequestListProps {
  title: string;
  /** `incoming` requests can be accepted or declined; `outgoing` only cancelled. */
  direction: "incoming" | "outgoing";
  requests: FriendLink[];
}

export function RequestList({ title, direction, requests }: RequestListProps) {
  if (requests.length === 0) return null;

  return (
    <section>
      <p className="eyebrow">{title}</p>
      <ul className="mt-2">
        {requests.map(({ friendshipId, user }) => (
          <li
            key={friendshipId}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-iron py-3"
          >
            <span className="font-display text-3xl leading-none font-extrabold uppercase">
              {user.username}
            </span>
            <div className="flex gap-3">
              {direction === "incoming" && (
                <form action={acceptRequest.bind(null, friendshipId)}>
                  <Button type="submit" size="sm">
                    Accept
                  </Button>
                </form>
              )}
              <form action={removeFriendship.bind(null, friendshipId)}>
                <Button type="submit" variant="outline" size="sm">
                  {direction === "incoming" ? "Decline" : "Cancel"}
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
