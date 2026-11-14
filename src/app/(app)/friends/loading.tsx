import { FriendsFrame } from "./frame";
import { FriendsSkeleton } from "./sections";

/** Shown the instant the tab is clicked, before the server has answered. */
export default function FriendsLoading() {
  return <FriendsFrame incoming={null} friends={<FriendsSkeleton />} outgoing={null} />;
}
