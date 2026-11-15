import { AddFriendForm } from "@/src/components/friends/add-friend-form";
import { PageHeader } from "@/src/components/ui/page-header";

interface FriendsFrameProps {
  incoming: React.ReactNode;
  friends: React.ReactNode;
  outgoing: React.ReactNode;
}

/** The static parts of the friends tab, with slots for the lists that need data. */
export function FriendsFrame({ incoming, friends, outgoing }: FriendsFrameProps) {
  return (
    <div className="flex flex-col gap-14">
      <PageHeader eyebrow="Each week is shown in that person's timezone" title="Friends" />

      {incoming}
      {friends}

      <section>
        <p className="eyebrow">Add a friend</p>
        <h2 className="headline mt-1 mb-6 text-5xl">Send a request</h2>
        <AddFriendForm />
      </section>

      {outgoing}
    </div>
  );
}
