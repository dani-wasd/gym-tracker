import { PageHeader } from "@/src/components/ui/page-header";
import { LoadingRegion, SkeletonText } from "@/src/components/ui/skeleton";

/** Shown the instant the link is clicked, before the server has answered. */
export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-16">
      <PageHeader eyebrow="Your account" title="Settings" />
      <section>
        <p className="eyebrow">What friends see</p>
        <h2 className="headline mt-1 mb-6 text-5xl">Profile</h2>
        <LoadingRegion label="settings">
          <SkeletonText width="24ch" lines={3} className="max-w-xl text-2xl" />
        </LoadingRegion>
      </section>
    </div>
  );
}
