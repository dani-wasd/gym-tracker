import { AddFriendForm } from "@/src/components/friends/add-friend-form";
import { PageHeader } from "@/src/components/ui/page-header";

interface FriendsFrameProps {
  incoming: React.ReactNode;
  friends: React.ReactNode;
  outgoing: React.ReactNode;
}

/** The static parts of "The rack", with slots for the lists that need data. */
export function FriendsFrame({ incoming, friends, outgoing }: FriendsFrameProps) {
  return (
    <div className="flex flex-col gap-14">
      <PageHeader eyebrow="Friends · each week runs on its owner's clock" title="The rack" />

      {incoming}
      {friends}

      <section>
        <p className="eyebrow">Add a friend</p>
        <h2 className="headline mt-1 mb-6 text-5xl">Call a spotter</h2>
        <AddFriendForm />
      </section>

      {outgoing}
    </div>
  );
}
