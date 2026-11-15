import { AddFriendForm } from "@/src/components/friends/add-friend-form";
import { PageHeader } from "@/src/components/ui/page-header";
import { Section } from "@/src/components/ui/section";

interface FriendsFrameProps {
  incoming: React.ReactNode;
  friends: React.ReactNode;
  outgoing: React.ReactNode;
}

/** The static parts of the Friends tab, with slots for the lists that need data. */
export function FriendsFrame({ incoming, friends, outgoing }: FriendsFrameProps) {
  return (
    <div className="flex flex-col gap-14">
      <PageHeader eyebrow="Each week is shown in that person's timezone" title="Friends" />

      {incoming}
      {friends}

      <Section eyebrow="Add a friend" title="Call a spotter">
        <AddFriendForm />
      </Section>

      {outgoing}
    </div>
  );
}
