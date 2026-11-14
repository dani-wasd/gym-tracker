import { Suspense } from "react";
import { FriendsFrame } from "./frame";
import {
  FriendsSection,
  FriendsSkeleton,
  IncomingRequests,
  OutgoingRequests,
} from "./sections";

/**
 * Static text paints at once; the lists stream in. Request lists are usually
 * empty, so they get no placeholder — one that vanished would only make the
 * page jump.
 */
export default function FriendsPage() {
  return (
    <FriendsFrame
      incoming={
        <Suspense>
          <IncomingRequests />
        </Suspense>
      }
      friends={
        <Suspense fallback={<FriendsSkeleton />}>
          <FriendsSection />
        </Suspense>
      }
      outgoing={
        <Suspense>
          <OutgoingRequests />
        </Suspense>
      }
    />
  );
}
